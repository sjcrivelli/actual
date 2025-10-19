// @ts-strict-ignore
import { getClock } from '@actual-app/crdt';
import { AccountSyncSource } from '../types/models/account';

import * as connection from '../platform/server/connection';
import { logger } from '../platform/server/log';
import {
  getBankSyncError,
  getDownloadError,
  getSyncError,
  getTestKeyError,
} from '../shared/errors';
import * as monthUtils from '../shared/months';
import { q } from '../shared/query';
import {
  ungroupTransactions,
  updateTransaction,
  deleteTransaction,
} from '../shared/transactions';
import { integerToAmount } from '../shared/util';
import { Handlers } from '../types/handlers';
import {
  AccountEntity,
  CategoryEntity,
  CategoryGroupEntity,
  PayeeEntity,
  ScheduleEntity,
} from '../types/models';
import { ServerHandlers } from '../types/server-handlers';

import { addTransactions } from './accounts/sync';
import {
  accountModel,
  budgetModel,
  categoryModel,
  categoryGroupModel,
  payeeModel,
  remoteFileModel,
  scheduleModel,
  APIScheduleEntity,
  AmountOPType,
} from './api-models';
import { aqlQuery } from './aql';
import * as cloudStorage from './cloud-storage';
import { type RemoteFile } from './cloud-storage';
import * as db from './db';
import { APIError } from './errors';
import { runMutator } from './mutators';
import * as prefs from './prefs';
import * as sheet from './sheet';
import { setSyncingMode, batchMessages } from './sync';

let IMPORT_MODE = false;

// The API is different in two ways: we never want undo enabled, and
// we also need to notify the UI manually if stuff has changed (if
// they are connecting to an already running instance, the UI should
// update). The wrapper handles that.
function withMutation<Params extends Array<unknown>, ReturnType>(
  handler: (...args: Params) => Promise<ReturnType>,
) {
  return (...args: Params) => {
    return runMutator(
      async () => {
        const latestTimestamp = getClock().timestamp.toString();
        const result = await handler(...args);

        const rows = await db.all<Pick<db.DbCrdtMessage, 'dataset'>>(
          'SELECT DISTINCT dataset FROM messages_crdt WHERE timestamp > ?',
          [latestTimestamp],
        );

        // Only send the sync event if anybody else is connected
        if (connection.getNumClients() > 1) {
          connection.send('sync-event', {
            type: 'success',
            tables: rows.map(row => row.dataset),
          });
        }

        return result;
      },
      { undoDisabled: true },
    );
  };
}

let handlers = {} as unknown as Handlers;

async function validateMonth(month) {
  if (!month.match(/^\d{4}-\d{2}$/)) {
    throw APIError('Invalid month format, use YYYY-MM: ' + month);
  }

  if (!IMPORT_MODE) {
    const { start, end } = await handlers['get-budget-bounds']();
    const range = monthUtils.range(start, end);
    if (!range.includes(month)) {
      throw APIError('No budget exists for month: ' + month);
    }
  }
}

async function validateExpenseCategory(debug, id) {
  if (id == null) {
    throw APIError(`${debug}: category id is required`);
  }

  const row = await db.first<Pick<db.DbCategory, 'is_income'>>(
    'SELECT is_income FROM categories WHERE id = ?',
    [id],
  );

  if (!row) {
    throw APIError(`${debug}: category “${id}” does not exist`);
  }

  if (row.is_income !== 0) {
    throw APIError(`${debug}: category “${id}” is not an expense category`);
  }
}

function checkFileOpen() {
  if (!(prefs.getPrefs() || {}).id) {
    throw APIError('No budget file is open');
  }
}

let batchPromise = null;

handlers['api/batch-budget-start'] = async function () {
  if (batchPromise) {
    throw APIError('Cannot start a batch process: batch already started');
  }

  // If we are importing, all we need to do is start a raw database
  // transaction. Updating spreadsheet cells doesn't go through the
  // syncing layer in that case.
  if (IMPORT_MODE) {
    db.asyncTransaction(() => {
      return new Promise((resolve, reject) => {
        batchPromise = { resolve, reject };
      });
    });
  } else {
    batchMessages(() => {
      return new Promise((resolve, reject) => {
        batchPromise = { resolve, reject };
      });
    });
  }
};

handlers['api/batch-budget-end'] = async function () {
  if (!batchPromise) {
    throw APIError('Cannot end a batch process: no batch started');
  }

  batchPromise.resolve();
  batchPromise = null;
};

handlers['api/load-budget'] = async function ({ id }) {
  const { id: currentId } = prefs.getPrefs() || {};

  if (currentId !== id) {
    connection.send('start-load');
    const { error } = await handlers['load-budget']({ id });

    if (!error) {
      connection.send('finish-load');
    } else {
      connection.send('show-budgets');

      throw new Error(getSyncError(error, id));
    }
  }
};

handlers['api/download-budget'] = async function ({ syncId, password }) {
  const { id: currentId } = prefs.getPrefs() || {};
  if (currentId) {
    await handlers['close-budget']();
  }

  const budgets = await handlers['get-budgets']();
  const localBudget = budgets.find(b => b.groupId === syncId);
  let remoteBudget: RemoteFile;

  // Load a remote file if we could not find the file locally
  if (!localBudget) {
    const files = await handlers['get-remote-files']();
    if (!files) {
      throw new Error('Could not get remote files');
    }
    const file = files.find(f => f.groupId === syncId);
    if (!file) {
      throw new Error(
        `Budget “${syncId}” not found. Check the sync id of your budget in the Advanced section of the settings page.`,
      );
    }

    remoteBudget = file;
  }

  const activeFile = remoteBudget ? remoteBudget : localBudget;

  // Set the e2e encryption keys
  if (activeFile.encryptKeyId) {
    if (!password) {
      throw new Error(
        `File ${activeFile.name} is encrypted. Please provide a password.`,
      );
    }

    const result = await handlers['key-test']({
      cloudFileId: remoteBudget ? remoteBudget.fileId : localBudget.cloudFileId,
      password,
    });
    if (result.error) {
      throw new Error(getTestKeyError(result.error));
    }
  }

  // Sync the local budget file
  if (localBudget) {
    await handlers['load-budget']({ id: localBudget.id });
    const result = await handlers['sync-budget']();
    if (result.error) {
      throw new Error(getSyncError(result.error, localBudget.id));
    }
    return;
  }

  // Download the remote file (no need to perform a sync as the file will already be up-to-date)
  const result = await handlers['download-budget']({
    cloudFileId: remoteBudget.fileId,
  });
  if (result.error) {
    logger.log('Full error details', result.error);
    throw new Error(getDownloadError(result.error));
  }
  await handlers['load-budget']({ id: result.id });
};

handlers['api/get-budgets'] = async function () {
  const budgets = await handlers['get-budgets']();
  const files = (await handlers['get-remote-files']()) || [];
  return [
    ...budgets.map(file => budgetModel.toExternal(file)),
    ...files.map(file => remoteFileModel.toExternal(file)).filter(file => file),
  ];
};

handlers['api/sync'] = async function () {
  const { id } = prefs.getPrefs();
  const result = await handlers['sync-budget']();
  if (result.error) {
    throw new Error(getSyncError(result.error, id));
  }
};

handlers['api/bank-sync'] = async function (args) {
  const batchSync = args?.accountId == null;
  const allErrors = [];

  if (!batchSync) {
    const { errors } = await handlers['accounts-bank-sync']({
      ids: [args.accountId],
    });

    allErrors.push(...errors);
  } else {
    const accountsData = await handlers['accounts-get']();
    const accountIdsToSync = accountsData.map(a => a.id);
    const simpleFinAccounts = accountsData.filter(
      a => a.account_sync_source === 'simpleFin',
    );
    const simpleFinAccountIds = simpleFinAccounts.map(a => a.id);

    if (simpleFinAccounts.length > 1) {
      const res = await handlers['simplefin-batch-sync']({
        ids: simpleFinAccountIds,
      });

      res.forEach(a => allErrors.push(...a.res.errors));
    }

    const { errors } = await handlers['accounts-bank-sync']({
      ids: accountIdsToSync.filter(a => !simpleFinAccountIds.includes(a)),
    });

    allErrors.push(...errors);
  }

  const errors = allErrors.filter(e => e != null);
  if (errors.length > 0) {
    throw new Error(getBankSyncError(errors[0]));
  }
};

handlers['api/start-import'] = async function ({ budgetName }) {
  // Notify UI to close budget
  await handlers['close-budget']();

  // Create the budget
  await handlers['create-budget']({ budgetName, avoidUpload: true });

  // Clear out the default expense categories
  await db.runQuery('DELETE FROM categories WHERE is_income = 0');
  await db.runQuery('DELETE FROM category_groups WHERE is_income = 0');

  // Turn syncing off
  setSyncingMode('import');

  connection.send('start-import');
  IMPORT_MODE = true;
};

handlers['api/finish-import'] = async function () {
  checkFileOpen();

  sheet.get().markCacheDirty();

  // We always need to fully reload the app. Importing doesn't touch
  // the spreadsheet, but we can't just recreate the spreadsheet
  // either; there is other internal state that isn't created
  const { id } = prefs.getPrefs();
  await handlers['close-budget']();
  await handlers['load-budget']({ id });

  await handlers['get-budget-bounds']();
  await sheet.waitOnSpreadsheet();

  await cloudStorage.upload().catch(() => {});

  connection.send('finish-import');
  IMPORT_MODE = false;
};

handlers['api/abort-import'] = async function () {
  if (IMPORT_MODE) {
    checkFileOpen();

    const { id } = prefs.getPrefs();

    await handlers['close-budget']();
    await handlers['delete-budget']({ id });
    connection.send('show-budgets');
  }

  IMPORT_MODE = false;
};

handlers['api/query'] = async function ({ query }) {
  checkFileOpen();
  // Ensure query is a Query object, not a string
  return aqlQuery(q(query));
};

handlers['api/budget-months'] = async function () {
  checkFileOpen();
  const { start, end } = await handlers['get-budget-bounds']();
  return monthUtils.range(start, end);
};

handlers['api/budget-month'] = async function ({ month }) {
  checkFileOpen();
  await validateMonth(month);

  const { data: groups }: { data: CategoryGroupEntity[] } = await aqlQuery(
    q('category_groups').select('*'),
  );
  const sheetName = monthUtils.sheetForMonth(month);

  function value(name) {
    const v = sheet.get().getCellValue(sheetName, name);
    return v === '' ? 0 : v;
  }

  // This is duplicated from main.js because the return format is
  // different (for now)
  // Cast as any to satisfy handler type
  return {
    month,
    incomeAvailable: value('available-funds') as number,
    lastMonthOverspent: value('last-month-overspent') as number,
    forNextMonth: value('buffered') as number,
    totalBudgeted: value('total-budgeted') as number,
    toBudget: value('to-budget') as number,

    fromLastMonth: value('from-last-month') as number,
    totalIncome: value('total-income') as number,
    totalSpent: value('total-spent') as number,
    totalBalance: value('total-leftover') as number,

    categoryGroups: groups.map(group => {
      if (group.is_income) {
        return {
          ...categoryGroupModel.toExternal(group),
          received: value('total-income'),
          categories: (group as any).categories.map((cat: any) => ({
            ...categoryModel.toExternal(cat),
            received: value(`sum-amount-${cat.id}`),
          })),
        };
      }
      return {
        ...categoryGroupModel.toExternal(group),
        budgeted: value(`group-budget-${group.id}`),
        spent: value(`group-sum-amount-${group.id}`),
        balance: value(`group-leftover-${group.id}`),
        categories: (group as any).categories.map((cat: any) => ({
          ...categoryModel.toExternal(cat),
          budgeted: value(`budget-${cat.id}`),
          spent: value(`sum-amount-${cat.id}`),
          balance: value(`leftover-${cat.id}`),
          carryover: value(`carryover-${cat.id}`),
        })),
      };
    }),
  } as any;
};

handlers['api/budget-set-amount'] = withMutation(async function ({
  month,
  categoryId,
  amount,
}) {
  checkFileOpen();
  return handlers['budget/budget-amount']({
    month,
    category: categoryId,
    amount,
  });
});

handlers['api/budget-set-carryover'] = withMutation(async function ({
  month,
  categoryId,
  flag,
}) {
  checkFileOpen();
  await validateMonth(month);
  await validateExpenseCategory('budget-set-carryover', categoryId);
  return handlers['budget/set-carryover']({
    startMonth: month,
    category: categoryId,
    flag,
  });
});

handlers['api/budget-hold-for-next-month'] = withMutation(async function ({
  month,
  amount,
}) {
  checkFileOpen();
  await validateMonth(month);
  if (amount <= 0) {
    throw APIError('Amount to hold needs to be greater than 0');
  }
  return handlers['budget/hold-for-next-month']({
    month,
    amount,
  });
});

handlers['api/budget-reset-hold'] = withMutation(async function ({ month }) {
  checkFileOpen();
  await validateMonth(month);
  return handlers['budget/reset-hold']({ month });
});

handlers['api/transactions-export'] = async function ({
  transactions,
  categoryGroups,
  payees,
  accounts,
}) {
  checkFileOpen();
  return handlers['transactions-export']({
    transactions,
    categoryGroups,
    payees,
    accounts,
  });
};

handlers['api/transactions-import'] = withMutation(async function ({
  accountId,
  transactions,
  isPreview = false,
  opts,
}) {
  checkFileOpen();
  return handlers['transactions-import']({
    accountId,
    transactions,
    isPreview,
    opts,
  });
});

handlers['api/transactions-add'] = withMutation(async function ({
  accountId,
  transactions,
  runTransfers = false,
  learnCategories = false,
}) {
  checkFileOpen();
  await addTransactions(accountId, transactions, {
    runTransfers,
    learnCategories,
  });
  return 'ok' as const;
});

handlers['api/transactions-get'] = async function ({
  accountId,
  startDate,
  endDate,
}) {
  checkFileOpen();
  const { data } = await aqlQuery(
    q('transactions')
      .filter({
        $and: [
          accountId && { account: accountId },
          startDate && { date: { $gte: startDate } },
          endDate && { date: { $lte: endDate } },
        ].filter(Boolean),
      })
      .select('*')
      .options({ splits: 'grouped' }),
  );
  return data;
};

handlers['api/transaction-update'] = withMutation(async function ({
  id,
  fields,
}) {
  checkFileOpen();
  const { data } = await aqlQuery(
    q('transactions').filter({ id }).select('*').options({ splits: 'grouped' }),
  );
  const transactions = ungroupTransactions(data);

  if (transactions.length === 0) {
    return [];
  }

  const { diff } = updateTransaction(transactions, { id, ...fields });
  return handlers['transactions-batch-update'](diff)['updated'];
});

handlers['api/transaction-delete'] = withMutation(async function ({ id }) {
  checkFileOpen();
  const { data } = await aqlQuery(
    q('transactions').filter({ id }).select('*').options({ splits: 'grouped' }),
  );
  const transactions = ungroupTransactions(data);

  if (transactions.length === 0) {
    return [];
  }

  const { diff } = deleteTransaction(transactions, id);
  return handlers['transactions-batch-update'](diff)['deleted'];
});

handlers['api/accounts-get'] = async function () {
  checkFileOpen();
  // TODO: Force cast to AccountEntity. This should be updated to an AQL query.
  const accounts = (await db.getAccounts()) as AccountEntity[];
  return accounts.map(account => accountModel.toExternal(account));
};

handlers['api/account-create'] = withMutation(async function ({
  account,
  initialBalance = null,
}) {
  checkFileOpen();
  // Ensure all required properties for AccountEntity
  const apiAccount: AccountEntity = {
    ...accountModel.toExternal(account),
    sort_order: account.sort_order ?? 0,
    last_reconciled: account.last_reconciled ?? null,
    tombstone: account.tombstone ?? 0,
    offbudget: account.offbudget ? 1 : 0,
    closed: account.closed ? 1 : 0,
    id: account.id,
    name: account.name,
    // Fill required _SyncFields<false> properties with null
    account_id: null,
    bank: null,
    bankName: null,
    bankId: null,
    mask: null,
    official_name: null,
    balance_current: null,
    balance_available: null,
    balance_limit: null,
    account_sync_source: null,
    last_sync: null,
  };
  return handlers['api/account-create']({
    account: apiAccount,
    initialBalance,
  });
});

handlers['api/account-update'] = withMutation(async function ({ id, fields }) {
  checkFileOpen();
  const apiFields: AccountEntity = {
    id: fields.id ?? '',
    name: fields.name ?? '',
    offbudget: typeof fields.offbudget === 'boolean' ? (fields.offbudget ? 1 : 0) : fields.offbudget ?? 0,
    closed: typeof fields.closed === 'boolean' ? (fields.closed ? 1 : 0) : fields.closed ?? 0,
    sort_order: fields.sort_order ?? 0,
    last_reconciled: fields.last_reconciled ?? null,
    tombstone: typeof fields.tombstone === 'boolean' ? (fields.tombstone ? 1 : 0) : fields.tombstone ?? 0,
    account_id: 'account_id' in fields ? fields.account_id as string : null,
    bank: 'bank' in fields ? fields.bank as string : null,
    bankName: 'bankName' in fields ? fields.bankName as string : null,
    bankId: 'bankId' in fields ? fields.bankId as number : null,
    mask: 'mask' in fields ? fields.mask as string : null,
    official_name: 'official_name' in fields ? fields.official_name as string : null,
    balance_current: 'balance_current' in fields ? fields.balance_current as number : null,
    balance_available: 'balance_available' in fields ? fields.balance_available as number : null,
    balance_limit: 'balance_limit' in fields ? fields.balance_limit as number : null,
    account_sync_source: 'account_sync_source' in fields ? fields.account_sync_source as AccountSyncSource : null,
    last_sync: 'last_sync' in fields ? fields.last_sync as string : null,
  };
  return handlers['api/account-update']({
    id,
    fields: apiFields,
  });
});

handlers['api/category-group-create'] = withMutation(async function ({ group }) {
  checkFileOpen();
  // Use the first category or a default CategoryEntity
  const cat = Array.isArray(group.categories) && group.categories.length > 0
    ? group.categories[0]
    : {
        id: '',
        name: '',
        group: group.id ?? '',
        is_income: typeof group.is_income === 'boolean' ? group.is_income : group.is_income ?? false,
        goal_def: null,
        template_settings: null,
        sort_order: 0,
        tombstone: false,
        hidden: false,
      };
  return handlers['api/category-group-create']({ group: cat });
});

handlers['api/category-group-update'] = withMutation(async function ({ id, fields }) {
  checkFileOpen();
  const apiFields: CategoryGroupEntity = {
    id: fields.id ?? '',
    name: fields.name ?? '',
    is_income: typeof fields.is_income === 'boolean' ? fields.is_income : fields.is_income ?? false,
    sort_order: fields.sort_order ?? 0,
    tombstone: typeof fields.tombstone === 'boolean' ? fields.tombstone : fields.tombstone ?? false,
    hidden: typeof fields.hidden === 'boolean' ? fields.hidden : fields.hidden ?? false,
    categories: [], // Removed categories as per the requirement
  };
  return handlers['api/category-group-update']({ id, fields: apiFields });
});

handlers['api/category-create'] = withMutation(async function ({ category }) {
  checkFileOpen();
  const apiCategory: CategoryEntity = {
    id: category.id ?? '',
    name: category.name ?? '',
    is_income: typeof category.is_income === 'boolean' ? category.is_income : category.is_income ?? false,
    group: category.group ?? '',
    goal_def: category.goal_def ?? null,
    template_settings: category.template_settings ?? null,
    sort_order: category.sort_order ?? 0,
    tombstone: typeof category.tombstone === 'boolean' ? category.tombstone : category.tombstone ?? false,
    hidden: typeof category.hidden === 'boolean' ? category.hidden : category.hidden ?? false,
  };
  return handlers['api/category-create']({ category: apiCategory });
});

handlers['api/category-update'] = withMutation(async function ({ id, fields }) {
  checkFileOpen();
  const apiFields: CategoryEntity = {
    id: fields.id ?? '',
    name: fields.name ?? '',
    is_income: typeof fields.is_income === 'boolean' ? fields.is_income : fields.is_income ?? false,
    group: fields.group ?? '',
    goal_def: fields.goal_def ?? null,
    template_settings: fields.template_settings ?? null,
    sort_order: fields.sort_order ?? 0,
    tombstone: typeof fields.tombstone === 'boolean' ? fields.tombstone : fields.tombstone ?? false,
    hidden: typeof fields.hidden === 'boolean' ? fields.hidden : fields.hidden ?? false,
  };
  return handlers['api/category-update']({ id, fields: apiFields });
});

handlers['api/payee-update'] = withMutation(async function ({ id, fields }) {
  checkFileOpen();
  const apiFields: PayeeEntity = {
    id: fields.id ?? '',
    name: fields.name ?? '',
    transfer_acct: fields.transfer_acct ?? null,
    favorite: typeof fields.favorite === 'boolean' ? fields.favorite : fields.favorite ?? false,
    learn_categories: typeof fields.learn_categories === 'boolean' ? fields.learn_categories : fields.learn_categories ?? false,
    tombstone: typeof fields.tombstone === 'boolean' ? fields.tombstone : fields.tombstone ?? false,
  };
  return handlers['api/payee-update']({ id, fields: apiFields });
});

handlers['api/payee-update'] = withMutation(async function ({ id, fields }) {
  checkFileOpen();
  // Ensure all required properties for PayeeEntity
  const apiFields: PayeeEntity = {
    id: fields.id ?? '',
    name: fields.name ?? '',
    transfer_acct: fields.transfer_acct ?? null,
    favorite: typeof fields.favorite === 'boolean' ? fields.favorite : fields.favorite ?? false,
    learn_categories: typeof fields.learn_categories === 'boolean' ? fields.learn_categories : fields.learn_categories ?? false,
    tombstone: typeof fields.tombstone === 'boolean' ? fields.tombstone : fields.tombstone ?? false,
  };
  return handlers['api/payee-update']({
    id,
    fields: apiFields,
  });
});

handlers['api/payee-delete'] = withMutation(async function ({ id }) {
  checkFileOpen();
  return handlers['api/payee-delete']({ id });
});

handlers['api/payees-merge'] = withMutation(async function ({
  targetId,
  mergeIds,
}) {
  checkFileOpen();
  return handlers['payees-merge']({ targetId, mergeIds });
});

handlers['api/rules-get'] = async function () {
  checkFileOpen();
  return handlers['rules-get']();
};

handlers['api/payee-rules-get'] = async function ({ id }) {
  checkFileOpen();
  return handlers['payees-get-rules']({ id });
};

handlers['api/rule-create'] = withMutation(async function ({ rule }) {
  checkFileOpen();
  const addedRule = await handlers['rule-add'](rule);

  if ('error' in addedRule) {
    throw APIError('Failed creating a new rule', addedRule.error);
  }

  return addedRule;
});

handlers['api/rule-update'] = withMutation(async function ({ rule }) {
  checkFileOpen();
  const updatedRule = await handlers['rule-update'](rule);

  if ('error' in updatedRule) {
    throw APIError('Failed updating the rule', updatedRule.error);
  }

  return updatedRule;
});

handlers['api/rule-delete'] = withMutation(async function (id) {
  checkFileOpen();
  return handlers['rule-delete'](String(id));
});

handlers['api/schedules-get'] = async function () {
  checkFileOpen();
  const { data } = await aqlQuery(q('schedules').select('*'));
  const schedules = data as ScheduleEntity[];
  return schedules.map(schedule => scheduleModel.toExternal(schedule));
};

// --- Schedule handlers ---

handlers['api/schedule-create'] = withMutation(async function (
  schedule: APIScheduleEntity
) {
  checkFileOpen();
  // Ensure required props exist
  return handlers['api/schedule-create']({
    ...schedule,
    id: schedule.id ?? '',
    name: schedule.name ?? '',
  });
}) as unknown as (arg: unknown) => Promise<void>;

handlers['api/schedule-update'] = withMutation(
  (async function ({
    id,
    fields,
    resetNextDate,
  }: {
    id: string;
    fields: Record<string, any>;
    resetNextDate?: boolean;
  }): Promise<any> {
    checkFileOpen();
    return handlers['schedule-update']({ id, fields, resetNextDate });
  }) as unknown as (arg: unknown) => Promise<void>
);

handlers['api/schedule-delete'] = withMutation(
  (async function (id: string): Promise<void> {
    checkFileOpen();
    return handlers['schedule-delete'](id);
  }) as unknown as (arg: unknown) => Promise<void>,
);

handlers['api/get-id-by-name'] = async function ({ type, name }) {
  checkFileOpen();

  const allowedTypes = ['payees', 'categories', 'schedules', 'accounts'];

  if (!allowedTypes.includes(type)) {
    throw APIError('Provide a valid type');
  }

  const { data } = await aqlQuery(q(type).filter({ name }).select('*'));

  if (!data || data.length === 0) {
    throw APIError(`Not found: ${type} with name ${name}`);
  }

  return data[0].id;
};

handlers['api/get-server-version'] = (async function (): Promise<string> {
  try {
    const result = await handlers['get-server-version']();
    if ('version' in result) {
      return result.version;
    }
    return result.error ?? 'unknown';
  } catch (e) {
    return 'unknown';
  }
}) as unknown as () => Promise<string>;

export function installAPI(serverHandlers: ServerHandlers) {
  const merged = Object.assign({}, serverHandlers, handlers);
  handlers = merged as Handlers;
  return merged;
}
