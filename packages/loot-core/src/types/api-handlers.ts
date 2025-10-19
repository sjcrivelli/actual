// packages/loot-core/src/types/api-handlers.ts

// Import shared model types if available
import type { AccountEntity, TransactionEntity, CategoryEntity, CategoryGroupEntity, PayeeEntity } from './models';

// Define common API payloads and response shapes
export interface QueryArgs {
  query: string;
}

export interface BudgetMonthArgs {
  month: string;
}

export interface AccountCreateArgs {
  account: AccountEntity;
  initialBalance?: number;
}

export interface AccountUpdateArgs {
  id: string;
  fields: Partial<AccountEntity>;
}

export interface CategoryGroupCreateArgs {
  group: CategoryGroupEntity;
}

export interface CategoryGroupUpdateArgs {
  id: string;
  fields: Partial<CategoryGroupEntity>;
}

export interface CategoryCreateArgs {
  category: CategoryEntity;
}

export interface CategoryUpdateArgs {
  id: string;
  fields: Partial<CategoryEntity>;
}

export interface PayeeCreateArgs {
  payee: PayeeEntity;
}

export interface PayeeUpdateArgs {
  id: string;
  fields: Partial<PayeeEntity>;
}

export interface PayeeDeleteArgs {
  id: string;
}

export interface AccountDeleteArgs {
  id: string;
}

export interface TransactionBatchArgs {
  accountId: string;
  transactions: TransactionEntity[];
  isPreview?: boolean;
}

// API Handlers
export interface APIHandlers {
  'api/query': (arg: QueryArgs) => Promise<unknown>;
  'api/budget-month': (arg: BudgetMonthArgs) => Promise<{
    transactions: TransactionEntity[];
    categoryGroups: CategoryEntity[];
    payees: PayeeEntity[];
    accounts: AccountEntity[];
  }>;
  'api/account-create': (arg: AccountCreateArgs) => Promise<string>;
  'api/account-update': (arg: AccountUpdateArgs) => Promise<void>;
  'api/account-delete': (arg: AccountDeleteArgs) => Promise<void>;
  'api/category-group-create': (arg: CategoryGroupCreateArgs) => Promise<string>;
  'api/category-group-update': (arg: CategoryGroupUpdateArgs) => Promise<void>;
  'api/category-create': (arg: CategoryCreateArgs) => Promise<string>;
  'api/category-update': (arg: CategoryUpdateArgs) => Promise<void>;
  'api/payee-create': (arg: PayeeCreateArgs) => Promise<string>;
  'api/payee-update': (arg: PayeeUpdateArgs) => Promise<void>;
  'api/payee-delete': (arg: PayeeDeleteArgs) => Promise<void>;
  'api/transaction-batch': (arg: TransactionBatchArgs) => Promise<void>;
  'api/schedule-create': (arg: unknown) => Promise<void>;
  'api/schedule-update': (arg: unknown) => Promise<void>;
  'api/schedule-delete': (arg: unknown) => Promise<void>;
  'api/schedules-get': () => Promise<unknown>;
  'api/get-id-by-name': (arg: { type: string; name: string }) => Promise<string>;
  'api/get-server-version': () => Promise<string>;
}
