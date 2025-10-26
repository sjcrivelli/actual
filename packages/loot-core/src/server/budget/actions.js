// @ts-strict-ignore
import * as asyncStorage from '../../platform/server/asyncStorage';
import { getLocale } from '../../shared/locale';
import * as monthUtils from '../../shared/months';
import { integerToCurrency, safeNumber } from '../../shared/util';
import * as db from '../db';
import * as sheet from '../sheet';
import { batchMessages } from '../sync';
export async function getSheetValue(sheetName, cell) {
    const node = await sheet.getCell(sheetName, cell);
    return safeNumber(typeof node.value === 'number' ? node.value : 0);
}
export async function getSheetBoolean(sheetName, cell) {
    const node = await sheet.getCell(sheetName, cell);
    return typeof node.value === 'boolean' ? node.value : false;
}
// We want to only allow the positive movement of money back and
// forth. buffered should never be allowed to go into the negative,
// and you shouldn't be allowed to pull non-existent money from
// leftover.
function calcBufferedAmount(toBudget, buffered, amount) {
    amount = Math.min(Math.max(amount, -buffered), Math.max(toBudget, 0));
    return buffered + amount;
}
function getBudgetTable() {
    return isReflectBudget() ? 'reflect_budgets' : 'zero_budgets';
}
export function isReflectBudget() {
    const budgetType = db.firstSync(`SELECT value FROM preferences WHERE id = ?`, ['budgetType']);
    const val = budgetType ? budgetType.value : 'envelope';
    return val === 'tracking';
}
function dbMonth(month) {
    return parseInt(month.replace('-', ''));
}
function getBudgetData(table, month) {
    return db.all(`
    SELECT b.*, c.is_income, c.hidden, g.hidden AS group_hidden
    FROM ${table} b
    LEFT JOIN categories c ON b.category = c.id
    LEFT JOIN category_groups g ON c.cat_group = g.id
    WHERE c.tombstone = 0 AND b.month = ?
  `, [month]);
}
function getAllMonths(startMonth) {
    const { createdMonths } = sheet.get().meta();
    let latest = null;
    for (const month of createdMonths) {
        if (latest == null || month > latest) {
            latest = month;
        }
    }
    return monthUtils.rangeInclusive(startMonth, latest);
}
// TODO: Valid month format in all the functions below
export function getBudget({ category, month, }) {
    const table = getBudgetTable();
    const existing = db.firstSync(`SELECT * FROM ${table} WHERE month = ? AND category = ?`, [dbMonth(month), category]);
    return existing ? existing.amount || 0 : 0;
}
export function setBudget({ category, month, amount, }) {
    amount = safeNumber(typeof amount === 'number' ? amount : 0);
    const table = getBudgetTable();
    const existing = db.firstSync(`SELECT id FROM ${table} WHERE month = ? AND category = ?`, [
        dbMonth(month),
        category,
    ]);
    if (existing) {
        return db.update(table, { id: existing.id, amount });
    }
    return db.insert(table, {
        id: `${dbMonth(month)}-${category}`,
        month: dbMonth(month),
        category,
        amount,
    });
}
export function setGoal({ month, category, goal, long_goal }) {
    const table = getBudgetTable();
    const existing = db.firstSync(`SELECT id FROM ${table} WHERE month = ? AND category = ?`, [
        dbMonth(month),
        category,
    ]);
    if (existing) {
        return db.update(table, {
            id: existing.id,
            goal,
            long_goal,
        });
    }
    return db.insert(table, {
        id: `${dbMonth(month)}-${category}`,
        month: dbMonth(month),
        category,
        goal,
        long_goal,
    });
}
export function setBuffer(month, amount) {
    const existing = db.firstSync(`SELECT id FROM zero_budget_months WHERE id = ?`, [month]);
    if (existing) {
        return db.update('zero_budget_months', {
            id: existing.id,
            buffered: amount,
        });
    }
    return db.insert('zero_budget_months', { id: month, buffered: amount });
}
function setCarryover(table, category, month, flag) {
    const existing = db.firstSync(`SELECT id FROM ${table} WHERE month = ? AND category = ?`, [
        month,
        category,
    ]);
    if (existing) {
        return db.update(table, { id: existing.id, carryover: flag ? 1 : 0 });
    }
    return db.insert(table, {
        id: `${month}-${category}`,
        month,
        category,
        carryover: flag ? 1 : 0,
    });
}
// Actions
export async function copyPreviousMonth({ month, }) {
    const prevMonth = dbMonth(monthUtils.prevMonth(month));
    const table = getBudgetTable();
    const budgetData = await getBudgetData(table, prevMonth.toString());
    await batchMessages(async () => {
        budgetData.forEach(prevBudget => {
            if (prevBudget.is_income === 1 && !isReflectBudget()) {
                return;
            }
            if (prevBudget.hidden === 1 || prevBudget.group_hidden === 1) {
                return;
            }
            setBudget({
                category: prevBudget.category,
                month,
                amount: prevBudget.amount,
            });
        });
    });
}
export async function copySinglePreviousMonth({ month, category, }) {
    const prevMonth = monthUtils.prevMonth(month);
    const newAmount = await getSheetValue(monthUtils.sheetForMonth(prevMonth), 'budget-' + category);
    await batchMessages(async () => {
        setBudget({ category, month, amount: newAmount });
    });
}
export async function setZero({ month }) {
    const categories = await db.all('SELECT * FROM v_categories WHERE tombstone = 0');
    await batchMessages(async () => {
        categories.forEach(cat => {
            if (cat.is_income === 1 && !isReflectBudget()) {
                return;
            }
            setBudget({ category: cat.id, month, amount: 0 });
        });
    });
}
export async function set3MonthAvg({ month, }) {
    const categories = await db.all(`
  SELECT c.*
  FROM categories c
  LEFT JOIN category_groups g ON c.cat_group = g.id
  WHERE c.tombstone = 0 AND c.hidden = 0 AND g.hidden = 0
  `);
    const prevMonth1 = monthUtils.prevMonth(month);
    const prevMonth2 = monthUtils.prevMonth(prevMonth1);
    const prevMonth3 = monthUtils.prevMonth(prevMonth2);
    await batchMessages(async () => {
        for (const cat of categories) {
            if (cat.is_income === 1 && !isReflectBudget()) {
                continue;
            }
            const spent1 = await getSheetValue(monthUtils.sheetForMonth(prevMonth1), 'sum-amount-' + cat.id);
            const spent2 = await getSheetValue(monthUtils.sheetForMonth(prevMonth2), 'sum-amount-' + cat.id);
            const spent3 = await getSheetValue(monthUtils.sheetForMonth(prevMonth3), 'sum-amount-' + cat.id);
            let avg = Math.round((spent1 + spent2 + spent3) / 3);
            if (cat.is_income === 0) {
                avg *= -1;
            }
            setBudget({ category: cat.id, month, amount: avg });
        }
    });
}
export async function set12MonthAvg({ month, }) {
    const categories = await db.all(`
  SELECT c.*
  FROM categories c
  LEFT JOIN category_groups g ON c.cat_group = g.id
  WHERE c.tombstone = 0 AND c.hidden = 0 AND g.hidden = 0
  `);
    await batchMessages(async () => {
        for (const cat of categories) {
            if (cat.is_income === 1 && !isReflectBudget()) {
                continue;
            }
            setNMonthAvg({ month, N: 12, category: cat.id });
        }
    });
}
export async function set6MonthAvg({ month, }) {
    const categories = await db.all(`
  SELECT c.*
  FROM categories c
  LEFT JOIN category_groups g ON c.cat_group = g.id
  WHERE c.tombstone = 0 AND c.hidden = 0 AND g.hidden = 0
  `);
    await batchMessages(async () => {
        for (const cat of categories) {
            if (cat.is_income === 1 && !isReflectBudget()) {
                continue;
            }
            setNMonthAvg({ month, N: 6, category: cat.id });
        }
    });
}
export async function setNMonthAvg({ month, N, category, }) {
    const categoryFromDb = await db.first('SELECT is_income FROM v_categories WHERE id = ?', [category]);
    let prevMonth = monthUtils.prevMonth(month);
    let sumAmount = 0;
    for (let l = 0; l < N; l++) {
        sumAmount += await getSheetValue(monthUtils.sheetForMonth(prevMonth), 'sum-amount-' + category);
        prevMonth = monthUtils.prevMonth(prevMonth);
    }
    await batchMessages(async () => {
        let avg = Math.round(sumAmount / N);
        if (categoryFromDb.is_income === 0) {
            avg *= -1;
        }
        setBudget({ category, month, amount: avg });
    });
}
export async function holdForNextMonth({ month, amount, }) {
    const row = await db.first('SELECT buffered FROM zero_budget_months WHERE id = ?', [month]);
    const sheetName = monthUtils.sheetForMonth(month);
    const toBudget = await getSheetValue(sheetName, 'to-budget');
    if (toBudget > 0) {
        const bufferedAmount = calcBufferedAmount(toBudget, (row && row.buffered) || 0, amount);
        await setBuffer(month, bufferedAmount);
        return true;
    }
    return false;
}
export async function resetHold({ month }) {
    await setBuffer(month, 0);
}
export async function coverOverspending({ month, to, from, }) {
    const sheetName = monthUtils.sheetForMonth(month);
    const toBudgeted = await getSheetValue(sheetName, 'budget-' + to);
    const leftover = await getSheetValue(sheetName, 'leftover-' + to);
    const leftoverFrom = await getSheetValue(sheetName, from === 'to-budget' ? 'to-budget' : 'leftover-' + from);
    if (leftover >= 0 || leftoverFrom <= 0) {
        return;
    }
    const amountCovered = Math.min(-leftover, leftoverFrom);
    // If we are covering it from the to be budgeted amount, ignore this
    if (from !== 'to-budget') {
        const fromBudgeted = await getSheetValue(sheetName, 'budget-' + from);
        await setBudget({
            category: from,
            month,
            amount: fromBudgeted - amountCovered,
        });
    }
    await batchMessages(async () => {
        await setBudget({
            category: to,
            month,
            amount: toBudgeted + amountCovered,
        });
        await addMovementNotes({
            month,
            amount: amountCovered,
            to,
            from,
        });
    });
}
export async function transferAvailable({ month, amount, category, }) {
    const sheetName = monthUtils.sheetForMonth(month);
    const leftover = await getSheetValue(sheetName, 'to-budget');
    amount = Math.max(Math.min(amount, leftover), 0);
    const budgeted = await getSheetValue(sheetName, 'budget-' + category);
    await setBudget({ category, month, amount: budgeted + amount });
}
export async function coverOverbudgeted({ month, category, }) {
    const sheetName = monthUtils.sheetForMonth(month);
    const toBudget = await getSheetValue(sheetName, 'to-budget');
    const categoryBudget = await getSheetValue(sheetName, 'budget-' + category);
    await batchMessages(async () => {
        await setBudget({ category, month, amount: categoryBudget + toBudget });
        await addMovementNotes({
            month,
            amount: -toBudget,
            from: category,
            to: 'overbudgeted',
        });
    });
}
export async function transferCategory({ month, amount, from, to, }) {
    const sheetName = monthUtils.sheetForMonth(month);
    const fromBudgeted = await getSheetValue(sheetName, 'budget-' + from);
    await batchMessages(async () => {
        await setBudget({ category: from, month, amount: fromBudgeted - amount });
        // If we are simply moving it back into available cash to budget,
        // don't do anything else
        if (to !== 'to-budget') {
            const toBudgeted = await getSheetValue(sheetName, 'budget-' + to);
            await setBudget({ category: to, month, amount: toBudgeted + amount });
        }
        await addMovementNotes({
            month,
            amount,
            to,
            from,
        });
    });
}
export async function setCategoryCarryover({ startMonth, category, flag, }) {
    const table = getBudgetTable();
    const months = getAllMonths(startMonth);
    await batchMessages(async () => {
        for (const month of months) {
            setCarryover(table, category, dbMonth(month).toString(), flag);
        }
    });
}
function addNewLine(notes) {
    return !notes ? '' : `${notes}${notes && '\n'}`;
}
async function addMovementNotes({ month, amount, to, from, }) {
    const displayAmount = integerToCurrency(amount);
    const monthBudgetNotesId = `budget-${month}`;
    const existingMonthBudgetNotes = addNewLine(db.firstSync(`SELECT n.note FROM notes n WHERE n.id = ?`, [monthBudgetNotesId])?.note);
    const locale = getLocale(await asyncStorage.getItem('language'));
    const displayDay = monthUtils.format(monthUtils.currentDate(), 'MMMM dd', locale);
    const categories = await db.getCategories([from, to].filter(c => c !== 'to-budget' && c !== 'overbudgeted'));
    const fromCategoryName = from === 'to-budget'
        ? 'To Budget'
        : categories.find(c => c.id === from)?.name;
    const toCategoryName = to === 'to-budget'
        ? 'To Budget'
        : to === 'overbudgeted'
            ? 'Overbudgeted'
            : categories.find(c => c.id === to)?.name;
    const note = `Reassigned ${displayAmount} from ${fromCategoryName} → ${toCategoryName} on ${displayDay}`;
    await db.update('notes', {
        id: monthBudgetNotesId,
        note: `${existingMonthBudgetNotes}- ${note}`,
    });
}
export async function resetIncomeCarryover({ month, }) {
    const table = getBudgetTable();
    const categories = await db.all('SELECT * FROM v_categories WHERE is_income = 1 AND tombstone = 0');
    await batchMessages(async () => {
        for (const category of categories) {
            await setCarryover(table, category.id, dbMonth(month).toString(), false);
        }
    });
}
