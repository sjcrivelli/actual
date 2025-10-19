import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgExpandArrow } from '@actual-app/components/icons/v0';
import { Popover } from '@actual-app/components/popover';
import { Text } from '@actual-app/components/text';
import { View } from '@actual-app/components/view';
import { send, sendCatch } from 'loot-core/platform/client/fetch';
import { FilterMenu } from './FilterMenu';
import { NameFilter } from './NameFilter';
export function SavedFilterMenuButton({ conditions, conditionsOp, filterId, onClearFilters, onReloadSavedFilter, savedFilters, }) {
    const { t } = useTranslation();
    const [nameOpen, setNameOpen] = useState(false);
    const [adding, setAdding] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const triggerRef = useRef(null);
    const [err, setErr] = useState(null);
    const [menuItem, setMenuItem] = useState('');
    const [name, setName] = useState(filterId?.name ?? '');
    const id = filterId?.id;
    const originalSavedFilter = useRef(null);
    const onFilterMenuSelect = async (item) => {
        setMenuItem(item);
        switch (item) {
            case 'rename-filter':
                setErr(null);
                setAdding(false);
                setMenuOpen(false);
                setNameOpen(true);
                break;
            case 'delete-filter':
                setMenuOpen(false);
                await send('filter-delete', id);
                onClearFilters();
                break;
            case 'update-filter':
                setErr(null);
                setAdding(false);
                setMenuOpen(false);
                originalSavedFilter.current = {
                    conditions,
                    conditionsOp,
                    id: filterId?.id,
                    name: filterId?.name ?? '',
                    status: 'saved',
                };
                const response = await sendCatch('filter-update', {
                    state: originalSavedFilter.current,
                    filters: [...savedFilters],
                });
                if (response.error) {
                    setErr(response.error.message);
                    setNameOpen(true);
                    return;
                }
                onReloadSavedFilter(originalSavedFilter.current, 'update');
                break;
            case 'save-filter':
                setErr(null);
                setAdding(true);
                setMenuOpen(false);
                setNameOpen(true);
                break;
            case 'reload-filter':
                setMenuOpen(false);
                if (originalSavedFilter.current) {
                    originalSavedFilter.current = {
                        ...originalSavedFilter.current,
                        status: 'saved',
                    };
                    onReloadSavedFilter(originalSavedFilter.current, 'reload');
                }
                break;
            case 'clear-filter':
                setMenuOpen(false);
                onClearFilters();
                break;
            default:
        }
    };
    async function onAddUpdate() {
        if (adding) {
            const newSavedFilter = {
                conditions,
                conditionsOp,
                name,
                status: 'saved',
            };
            const response = await sendCatch('filter-create', {
                state: newSavedFilter,
                filters: [...savedFilters],
            });
            if (response.error) {
                setErr(response.error.message);
                setNameOpen(true);
                return;
            }
            setNameOpen(false);
            onReloadSavedFilter({
                ...newSavedFilter,
                id: response.data,
            });
            return;
        }
        const updatedFilter = {
            conditions: filterId?.conditions,
            conditionsOp: filterId?.conditionsOp,
            id: filterId?.id,
            name,
        };
        const response = await sendCatch('filter-update', {
            state: updatedFilter,
            filters: [...savedFilters],
        });
        if (response.error) {
            setErr(response.error.message);
            setNameOpen(true);
            return;
        }
        setNameOpen(false);
        onReloadSavedFilter(updatedFilter);
    }
    return (_jsxs(View, { children: [conditions.length > 0 && (_jsxs(Button, { ref: triggerRef, variant: "bare", style: { marginTop: 10 }, onPress: () => {
                    setMenuOpen(true);
                }, children: [_jsxs(Text, { style: {
                            maxWidth: 150,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            flexShrink: 0,
                        }, children: [!filterId?.id ? t('Unsaved filter') : filterId?.name, "\u00A0"] }), filterId?.id && filterId?.status !== 'saved' && (_jsxs(Text, { children: [_jsx(Trans, { children: "(modified)" }), "\u00A0"] })), _jsx(SvgExpandArrow, { width: 8, height: 8, style: { marginRight: 5 } })] })), _jsx(Popover, { triggerRef: triggerRef, isOpen: menuOpen, onOpenChange: () => setMenuOpen(false), style: { width: 200 }, children: _jsx(FilterMenu, { filterId: filterId, onFilterMenuSelect: onFilterMenuSelect }) }), _jsx(Popover, { triggerRef: triggerRef, isOpen: nameOpen, onOpenChange: () => setNameOpen(false), style: { width: 325 }, children: _jsx(NameFilter, { menuItem: menuItem, name: name, setName: setName, adding: adding, onAddUpdate: onAddUpdate, err: err }) })] }));
}
