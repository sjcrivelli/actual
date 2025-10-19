import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useMemo, useCallback, } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgExpandArrow, SvgSubtract } from '@actual-app/components/icons/v0';
import { Popover } from '@actual-app/components/popover';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import memoizeOne from 'memoize-one';
import { getNormalisedString } from 'loot-core/shared/normalisation';
import { groupById } from 'loot-core/shared/util';
import { PayeeMenu } from './PayeeMenu';
import { PayeeTable } from './PayeeTable';
import { Search } from '@desktop-client/components/common/Search';
import { TableHeader, Cell, SelectCell, } from '@desktop-client/components/table';
import { useSelected, SelectedProvider, useSelectedDispatch, useSelectedItems, } from '@desktop-client/hooks/useSelected';
import { pushModal } from '@desktop-client/modals/modalsSlice';
import { useDispatch } from '@desktop-client/redux';
const getPayeesById = memoizeOne((payees) => groupById(payees));
function PayeeTableHeader() {
    const { t } = useTranslation();
    const dispatchSelected = useSelectedDispatch();
    const selectedItems = useSelectedItems();
    return (_jsx(View, { children: _jsxs(TableHeader, { style: {
                backgroundColor: theme.tableBackground,
                color: theme.pageTextLight,
                zIndex: 200,
                userSelect: 'none',
            }, collapsed: true, children: [_jsx(SelectCell, { exposed: true, focused: false, selected: selectedItems.size > 0, icon: _jsx(SvgSubtract, { width: 6, height: 6 }), onSelect: e => dispatchSelected({ type: 'select-all', isRangeSelect: e.shiftKey }) }), _jsx(Cell, { value: t('Name'), width: "flex" })] }) }));
}
export const ManagePayees = ({ payees, ruleCounts, orphanedPayees, initialSelectedIds, onBatchChange, onViewRules, onCreateRule, ...props }) => {
    const [filter, setFilter] = useState('');
    const table = useRef(null);
    const triggerRef = useRef(null);
    const [orphanedOnly, setOrphanedOnly] = useState(false);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const filteredPayees = useMemo(() => {
        let filtered = payees;
        if (filter) {
            filtered = filtered.filter(p => getNormalisedString(p.name).includes(getNormalisedString(filter)));
        }
        if (orphanedOnly) {
            filtered = filtered.filter(p => orphanedPayees.map(o => o.id).includes(p.id));
        }
        return filtered;
    }, [payees, filter, orphanedOnly, orphanedPayees]);
    const selected = useSelected('payees', filteredPayees, initialSelectedIds);
    function applyFilter(f) {
        if (filter !== f) {
            setFilter(f);
        }
    }
    const onUpdate = useCallback((id, name, value) => {
        const payee = payees.find(p => p.id === id);
        if (payee && payee[name] !== value) {
            onBatchChange({
                updated: [{ id, [name]: value }],
                added: [],
                deleted: [],
            });
        }
    }, [payees, onBatchChange]);
    const getSelectableIds = useCallback(() => {
        return Promise.resolve(filteredPayees.filter(p => p.transfer_acct == null).map(p => p.id));
    }, [filteredPayees]);
    function onDelete(ids) {
        onBatchChange({
            deleted: ids ?? [...selected.items].map(id => ({ id })),
            updated: [],
            added: [],
        });
        if (!ids)
            selected.dispatch({ type: 'select-none' });
    }
    function onFavorite() {
        const allFavorited = [...selected.items]
            .map(id => payeesById[id].favorite)
            .every(f => f);
        if (allFavorited) {
            onBatchChange({
                updated: [...selected.items].map(id => ({ id, favorite: false })),
                added: [],
                deleted: [],
            });
        }
        else {
            onBatchChange({
                updated: [...selected.items].map(id => ({ id, favorite: true })),
                added: [],
                deleted: [],
            });
        }
        selected.dispatch({ type: 'select-none' });
    }
    function onLearn() {
        const allLearnCategories = [...selected.items]
            .map(id => payeesById[id].learn_categories)
            .every(f => f);
        if (allLearnCategories) {
            onBatchChange({
                updated: [...selected.items].map(id => ({
                    id,
                    learn_categories: false,
                })),
                added: [],
                deleted: [],
            });
        }
        else {
            onBatchChange({
                updated: [...selected.items].map(id => ({
                    id,
                    learn_categories: true,
                })),
                added: [],
                deleted: [],
            });
        }
        selected.dispatch({ type: 'select-none' });
    }
    async function onMerge() {
        const ids = [...selected.items];
        await props.onMerge(ids);
        selected.dispatch({ type: 'select-none' });
    }
    const onChangeCategoryLearning = useCallback(() => {
        dispatch(pushModal({ modal: { name: 'payee-category-learning' } }));
    }, [dispatch]);
    const buttonsDisabled = selected.items.size === 0;
    const payeesById = getPayeesById(payees);
    const [menuOpen, setMenuOpen] = useState(false);
    return (_jsxs(View, { style: { height: '100%' }, children: [_jsxs(View, { style: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '0 0 15px',
                }, children: [_jsxs(View, { style: { flexShrink: 0 }, children: [_jsxs(Button, { ref: triggerRef, variant: "bare", style: { marginRight: 10 }, isDisabled: buttonsDisabled, onPress: () => setMenuOpen(true), children: [buttonsDisabled
                                        ? t('No payees selected')
                                        : t('{{count}} payees', {
                                            count: selected.items.size,
                                        }), _jsx(SvgExpandArrow, { width: 8, height: 8, style: { marginLeft: 5 } })] }), _jsx(Popover, { triggerRef: triggerRef, isOpen: menuOpen, placement: "bottom start", style: { width: 250 }, onOpenChange: () => setMenuOpen(false), children: _jsx(PayeeMenu, { payeesById: payeesById, selectedPayees: selected.items, onClose: () => setMenuOpen(false), onDelete: onDelete, onMerge: onMerge, onFavorite: onFavorite, onLearn: onLearn }) })] }), _jsx(View, { style: {
                            flexShrink: 0,
                        }, children: (orphanedOnly || (orphanedPayees && orphanedPayees.length > 0)) && (_jsx(Button, { variant: "bare", style: { marginRight: 10 }, onPress: () => setOrphanedOnly(prev => !prev), children: orphanedOnly
                                ? t('Show all payees')
                                : t('Show {{count}} unused payees', {
                                    count: orphanedPayees.length,
                                }) })) }), _jsx(View, { style: { flex: 1 } }), _jsx(Search, { placeholder: t('Filter payees...'), value: filter, onChange: applyFilter })] }), _jsx(SelectedProvider, { instance: selected, fetchAllIds: getSelectableIds, children: _jsxs(View, { style: {
                        flex: 1,
                        border: '1px solid ' + theme.tableBorder,
                        borderTopLeftRadius: 4,
                        borderTopRightRadius: 4,
                        overflow: 'hidden',
                    }, children: [_jsx(PayeeTableHeader, {}), filteredPayees.length === 0 ? (_jsx(View, { style: {
                                textAlign: 'center',
                                color: theme.pageTextSubdued,
                                fontStyle: 'italic',
                                fontSize: 13,
                                marginTop: 5,
                            }, children: _jsx(Trans, { children: "No payees" }) })) : (_jsx(PayeeTable, { ref: table, payees: filteredPayees, ruleCounts: ruleCounts, onUpdate: onUpdate, onViewRules: onViewRules, onCreateRule: onCreateRule, onDelete: ids => onDelete(ids.map(id => ({ id }))) }))] }) }), _jsx(View, { style: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    margin: '20px 0',
                    flexShrink: 0,
                }, children: _jsx(View, { style: {
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '1em',
                    }, children: _jsx(Button, { "aria-label": t('Category learning settings'), variant: "normal", onPress: onChangeCategoryLearning, children: _jsx(Trans, { children: "Category learning settings" }) }) }) })] }));
};
