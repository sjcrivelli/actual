import { createSlice } from '@reduxjs/toolkit';
import { t } from 'i18next';
import memoizeOne from 'memoize-one';
import { send } from '../../../loot-core/src/platform/client/fetch';
import { resetApp } from '@desktop-client/app/appSlice';
import { addGenericErrorNotification, addNotification, } from '@desktop-client/notifications/notificationsSlice';
import { createAppAsyncThunk } from '../redux';
const sliceName = 'budget';
const initialState = {
    categories: {
        grouped: [],
        list: [],
    },
    isCategoriesLoading: false,
    isCategoriesLoaded: false,
    isCategoriesDirty: false,
};
const budgetSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        markCategoriesDirty(state) {
            _markCategoriesDirty(state);
        },
    },
    extraReducers: builder => {
        builder.addCase(resetApp, () => initialState);
        builder.addCase(createCategoryGroup.fulfilled, _markCategoriesDirty);
        builder.addCase(updateCategoryGroup.fulfilled, _markCategoriesDirty);
        builder.addCase(deleteCategoryGroup.fulfilled, _markCategoriesDirty);
        builder.addCase(createCategory.fulfilled, _markCategoriesDirty);
        builder.addCase(updateCategory.fulfilled, _markCategoriesDirty);
        builder.addCase(deleteCategory.fulfilled, _markCategoriesDirty);
        builder.addCase(moveCategoryGroup.fulfilled, _markCategoriesDirty);
        builder.addCase(moveCategory.fulfilled, _markCategoriesDirty);
        builder.addCase(reloadCategories.fulfilled, (state, action) => {
            _loadCategories(state, action.payload);
        });
        builder.addCase(reloadCategories.rejected, state => {
            state.isCategoriesLoading = false;
        });
        builder.addCase(reloadCategories.pending, state => {
            state.isCategoriesLoading = true;
        });
        builder.addCase(getCategories.fulfilled, (state, action) => {
            _loadCategories(state, action.payload);
        });
        builder.addCase(getCategories.rejected, state => {
            state.isCategoriesLoading = false;
        });
        builder.addCase(getCategories.pending, state => {
            state.isCategoriesLoading = true;
        });
    },
});
export const createCategoryGroup = createAppAsyncThunk(`${sliceName}/createCategoryGroup`, async ({ name }) => {
    const id = await send('category-group-create', { name });
    return id;
});
export const updateCategoryGroup = createAppAsyncThunk(`${sliceName}/updateCategoryGroup`, async ({ group }) => {
    // Strip off the categories field if it exist. It's not a real db
    // field but groups have this extra field in the client most of the time
    const { categories: _, ...groupNoCategories } = group;
    await send('category-group-update', groupNoCategories);
});
export const deleteCategoryGroup = createAppAsyncThunk(`${sliceName}/deleteCategoryGroup`, async ({ id, transferId }) => {
    await send('category-group-delete', { id, transferId });
});
export const createCategory = createAppAsyncThunk(`${sliceName}/createCategory`, async ({ name, groupId, isIncome, isHidden }) => {
    const id = await send('category-create', {
        name,
        groupId,
        isIncome,
        hidden: isHidden,
    });
    return id;
});
export const updateCategory = createAppAsyncThunk(`${sliceName}/updateCategory`, async ({ category }) => {
    await send('category-update', category);
});
export const deleteCategory = createAppAsyncThunk(`${sliceName}/deleteCategory`, async ({ id, transferId }, { dispatch }) => {
    const { error } = await send('category-delete', { id, transferId });
    if (error) {
        switch (error) {
            case 'category-type':
                dispatch(addNotification({
                    notification: {
                        id: `${sliceName}/deleteCategory/transfer`,
                        type: 'error',
                        message: t('A category must be transferred to another of the same type (expense or income)'),
                    },
                }));
                break;
            default:
                dispatch(addGenericErrorNotification());
        }
        throw new Error(error);
    }
});
export const moveCategory = createAppAsyncThunk(`${sliceName}/moveCategory`, async ({ id, groupId, targetId }) => {
    await send('category-move', { id, groupId, targetId });
});
export const moveCategoryGroup = createAppAsyncThunk(`${sliceName}/moveCategoryGroup`, async ({ id, targetId }) => {
    await send('category-group-move', { id, targetId });
});
function translateCategories(categories) {
    return categories?.map(cat => ({
        ...cat,
        name: cat.name?.toLowerCase() === 'starting balances'
            ? t('Starting Balances')
            : cat.name,
    }));
}
export const getCategories = createAppAsyncThunk(`${sliceName}/getCategories`, async () => {
    const categories = await send('get-categories');
    categories.list = translateCategories(categories.list);
    categories.grouped.forEach(group => {
        group.categories = translateCategories(group.categories);
    });
    return categories;
}, {
    condition: (_, { getState }) => {
        const { budget } = getState();
        return (!budget.isCategoriesLoading &&
            (budget.isCategoriesDirty || !budget.isCategoriesLoaded));
    },
});
export const reloadCategories = createAppAsyncThunk(`${sliceName}/reloadCategories`, async () => {
    const categories = await send('get-categories');
    categories.list = translateCategories(categories.list);
    categories.grouped.forEach(group => {
        group.categories = translateCategories(group.categories);
    });
    return categories;
});
export const applyBudgetAction = createAppAsyncThunk(`${sliceName}/applyBudgetAction`, async ({ month, type, args }, { dispatch }) => {
    switch (type) {
        case 'budget-amount':
            await send('budget/budget-amount', {
                month,
                category: args.category,
                amount: args.amount,
            });
            break;
        case 'copy-last':
            await send('budget/copy-previous-month', { month });
            break;
        case 'set-zero':
            await send('budget/set-zero', { month });
            break;
        case 'set-3-avg':
            await send('budget/set-3month-avg', { month });
            break;
        case 'set-6-avg':
            await send('budget/set-6month-avg', { month });
            break;
        case 'set-12-avg':
            await send('budget/set-12month-avg', { month });
            break;
        case 'check-templates':
            dispatch(addNotification({
                notification: await send('budget/check-templates'),
            }));
            break;
        case 'apply-goal-template':
            dispatch(addNotification({
                notification: await send('budget/apply-goal-template', { month }),
            }));
            break;
        case 'overwrite-goal-template':
            dispatch(addNotification({
                notification: await send('budget/overwrite-goal-template', {
                    month,
                }),
            }));
            break;
        case 'apply-single-category-template':
            dispatch(addNotification({
                notification: await send('budget/apply-single-template', {
                    month,
                    category: args.category,
                }),
            }));
            break;
        case 'cleanup-goal-template':
            dispatch(addNotification({
                notification: await send('budget/cleanup-goal-template', { month }),
            }));
            break;
        case 'hold':
            await send('budget/hold-for-next-month', {
                month,
                amount: args.amount,
            });
            break;
        case 'reset-hold':
            await send('budget/reset-hold', { month });
            break;
        case 'cover-overspending':
            await send('budget/cover-overspending', {
                month,
                to: args.to,
                from: args.from,
            });
            break;
        case 'transfer-available':
            await send('budget/transfer-available', {
                month,
                amount: args.amount,
                category: args.category,
            });
            break;
        case 'cover-overbudgeted':
            await send('budget/cover-overbudgeted', {
                month,
                category: args.category,
            });
            break;
        case 'transfer-category':
            await send('budget/transfer-category', {
                month,
                amount: args.amount,
                from: args.from,
                to: args.to,
            });
            break;
        case 'carryover': {
            await send('budget/set-carryover', {
                startMonth: month,
                category: args.category,
                flag: args.flag,
            });
            break;
        }
        case 'reset-income-carryover':
            await send('budget/reset-income-carryover', { month });
            break;
        case 'apply-multiple-templates':
            dispatch(addNotification({
                notification: await send('budget/apply-multiple-templates', {
                    month,
                    categoryIds: args.categories,
                }),
            }));
            break;
        case 'set-single-3-avg':
            await send('budget/set-n-month-avg', {
                month,
                N: 3,
                category: args.category,
            });
            break;
        case 'set-single-6-avg':
            await send('budget/set-n-month-avg', {
                month,
                N: 6,
                category: args.category,
            });
            break;
        case 'set-single-12-avg':
            await send('budget/set-n-month-avg', {
                month,
                N: 12,
                category: args.category,
            });
            break;
        case 'copy-single-last':
            await send('budget/copy-single-month', {
                month,
                category: args.category,
            });
            break;
        default:
            console.log(`Invalid action type: ${type}`);
    }
});
export const getCategoriesById = memoizeOne((categoryGroups) => {
    const res = {};
    categoryGroups?.forEach(group => {
        group.categories?.forEach(cat => {
            res[cat.id] = cat;
        });
    });
    return res;
});
export const { name, reducer, getInitialState } = budgetSlice;
export const actions = {
    ...budgetSlice.actions,
    applyBudgetAction,
    getCategories,
    reloadCategories,
    createCategoryGroup,
    updateCategoryGroup,
    deleteCategoryGroup,
    createCategory,
    updateCategory,
    deleteCategory,
    moveCategory,
    moveCategoryGroup,
};
export const { markCategoriesDirty } = budgetSlice.actions;
function _loadCategories(state, categories) {
    state.categories = categories;
    categories.list = translateCategories(categories.list);
    categories.grouped.forEach(group => {
        group.categories = translateCategories(group.categories);
    });
    state.isCategoriesLoading = false;
    state.isCategoriesLoaded = true;
    state.isCategoriesDirty = false;
}
function _markCategoriesDirty(state) {
    state.isCategoriesDirty = true;
}
