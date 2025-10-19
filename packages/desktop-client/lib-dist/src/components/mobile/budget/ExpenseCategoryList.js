import { jsx as _jsx } from "react/jsx-runtime";
import { DropIndicator, GridList, useDragAndDrop } from 'react-aria-components';
import { useTranslation } from 'react-i18next';
import { theme } from '@actual-app/components/theme';
import { css } from '@emotion/css';
import { ExpenseCategoryListItem } from './ExpenseCategoryListItem';
import { moveCategory } from '@desktop-client/budget/budgetSlice';
import { useDispatch } from '@desktop-client/redux';
export function ExpenseCategoryList({ categoryGroup, categories, month, onEditCategory, onBudgetAction, show3Columns, showBudgetedColumn, shouldHideCategory, }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { dragAndDropHooks } = useDragAndDrop({
        getItems: keys => [...keys].map(key => ({
            'text/plain': key,
        })),
        renderDropIndicator: target => {
            return (_jsx(DropIndicator, { target: target, className: css({
                    '&[data-drop-target]': {
                        height: 4,
                        backgroundColor: theme.tableBorderSeparator,
                        opacity: 1,
                        borderRadius: 4,
                    },
                }) }));
        },
        onReorder: e => {
            const [key] = e.keys;
            const categoryIdToMove = key;
            const categoryToMove = categories.find(c => c.id === categoryIdToMove);
            if (!categoryToMove) {
                throw new Error(`Internal error: category with ID ${categoryIdToMove} not found.`);
            }
            if (!categoryToMove.group) {
                throw new Error(`Internal error: category ${categoryIdToMove} is not in a group and cannot be moved.`);
            }
            const targetCategoryId = e.target.key;
            if (e.target.dropPosition === 'before') {
                dispatch(moveCategory({
                    id: categoryToMove.id,
                    groupId: categoryToMove.group,
                    targetId: targetCategoryId,
                }));
            }
            else if (e.target.dropPosition === 'after') {
                const targetCategoryIndex = categories.findIndex(c => c.id === targetCategoryId);
                if (targetCategoryIndex === -1) {
                    throw new Error(`Internal error: category with ID ${targetCategoryId} not found.`);
                }
                const nextToTargetCategory = categories[targetCategoryIndex + 1];
                dispatch(moveCategory({
                    id: categoryToMove.id,
                    groupId: categoryToMove.group,
                    // Due to the way `moveCategory` works, we use the category next to the
                    // actual target category here because `moveCategory` always shoves the
                    // category *before* the target category.
                    // On the other hand, using `null` as `targetId` moves the category
                    // to the end of the list.
                    targetId: nextToTargetCategory?.id || null,
                }));
            }
        },
    });
    return (_jsx(GridList, { "aria-label": t('{{categoryGroupName}} expense group categories', {
            categoryGroupName: categoryGroup.name,
        }), items: categories, dragAndDropHooks: dragAndDropHooks, dependencies: [
            month,
            onEditCategory,
            onBudgetAction,
            shouldHideCategory,
            show3Columns,
            showBudgetedColumn,
        ], children: category => (_jsx(ExpenseCategoryListItem, { value: category, month: month, onEditCategory: onEditCategory, onBudgetAction: onBudgetAction, isHidden: shouldHideCategory(category), show3Columns: show3Columns, showBudgetedColumn: showBudgetedColumn }, category.id)) }));
}
