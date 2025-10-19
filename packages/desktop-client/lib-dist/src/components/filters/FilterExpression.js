import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgDelete } from '@actual-app/components/icons/v0';
import { Popover } from '@actual-app/components/popover';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { mapField, friendlyOp } from 'loot-core/shared/rules';
import { FilterEditor } from './FiltersMenu';
import { subfieldFromFilter } from './subfieldFromFilter';
import { Value } from '@desktop-client/components/rules/Value';
let isDatepickerClick = false;
export function FilterExpression({ field: originalField, customName, op, value, options, style, onChange, onDelete, }) {
    const { t } = useTranslation();
    const [editing, setEditing] = useState(false);
    const triggerRef = useRef(null);
    const field = subfieldFromFilter({ field: originalField, value });
    return (_jsxs(View, { style: {
            backgroundColor: theme.pillBackground,
            borderRadius: 4,
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 10,
            marginTop: 10,
            ...style,
        }, children: [_jsx(Button, { ref: triggerRef, variant: "bare", isDisabled: customName != null, onPress: () => setEditing(true), style: {
                    maxWidth: 'calc(100% - 26px)',
                    whiteSpace: 'nowrap',
                    display: 'block',
                }, children: _jsx("div", { style: {
                        paddingBlock: 1,
                        paddingLeft: 5,
                        paddingRight: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }, children: customName ? (_jsx(Text, { style: { color: theme.pageTextPositive }, children: customName })) : (_jsxs(_Fragment, { children: [_jsx(Text, { style: { color: theme.pageTextPositive }, children: mapField(field, options) }), ' ', _jsx(Text, { children: friendlyOp(op, null) }), ' ', !['onbudget', 'offbudget'].includes(op?.toLocaleLowerCase()) && (_jsx(Value, { value: value, field: field, inline: true, valueIsRaw: op === 'contains' ||
                                    op === 'matches' ||
                                    op === 'doesNotContain' ||
                                    op === 'hasTags' }))] })) }) }), _jsx(Button, { variant: "bare", onPress: onDelete, "aria-label": t('Delete filter'), children: _jsx(SvgDelete, { style: {
                        width: 8,
                        height: 8,
                        margin: 4,
                    } }) }), _jsx(Popover, { triggerRef: triggerRef, placement: "bottom start", isOpen: editing, onOpenChange: () => setEditing(false), shouldCloseOnInteractOutside: element => {
                    // Datepicker selections for some reason register 2x clicks
                    // We want to keep the popover open after selecting a date.
                    // So we ignore the "close" event on selection + the subsequent event.
                    if (element instanceof HTMLElement && element.dataset.pikaYear) {
                        isDatepickerClick = true;
                        return false;
                    }
                    if (isDatepickerClick) {
                        isDatepickerClick = false;
                        return false;
                    }
                    return true;
                }, style: { width: 275, padding: 15, color: theme.menuItemText }, "data-testid": "filters-menu-tooltip", children: _jsx(FilterEditor, { field: originalField, op: op, value: value, options: options, onSave: onChange, onClose: () => setEditing(false) }) })] }));
}
