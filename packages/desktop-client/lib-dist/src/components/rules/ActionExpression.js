import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { mapField, friendlyOp, getAllocationMethods, } from 'loot-core/shared/rules';
import { ScheduleValue } from './ScheduleValue';
import { Value } from './Value';
const valueStyle = {
    color: theme.pillTextHighlighted,
};
export function ActionExpression({ style, ...props }) {
    return (_jsx(View, { style: {
            display: 'block',
            maxWidth: '100%',
            color: theme.pillText,
            backgroundColor: theme.pillBackgroundLight,
            borderRadius: 4,
            padding: '3px 5px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            ...style,
        }, children: props.op === 'set' ? (_jsx(SetActionExpression, { ...props })) : props.op === 'set-split-amount' ? (_jsx(SetSplitAmountActionExpression, { ...props })) : props.op === 'link-schedule' ? (_jsx(LinkScheduleActionExpression, { ...props })) : props.op === 'prepend-notes' ? (_jsx(PrependNoteActionExpression, { ...props })) : props.op === 'append-notes' ? (_jsx(AppendNoteActionExpression, { ...props })) : props.op === 'delete-transaction' ? (_jsx(DeleteTransactionActionExpression, { ...props })) : null }));
}
function SetActionExpression({ op, field, value, options, }) {
    const { t } = useTranslation();
    return (_jsxs(_Fragment, { children: [_jsx(Text, { children: friendlyOp(op) }), ' ', _jsx(Text, { style: valueStyle, children: mapField(field, options) }), ' ', _jsx(Text, { children: t('to ') }), options?.template ? (_jsxs(_Fragment, { children: [_jsx(Text, { children: t('template ') }), _jsx(Text, { style: valueStyle, children: options.template })] })) : (_jsx(Value, { style: valueStyle, value: value, field: field }))] }));
}
function SetSplitAmountActionExpression({ op, value, options, }) {
    const method = options?.method;
    if (!method) {
        return null;
    }
    return (_jsxs(_Fragment, { children: [_jsx(Text, { children: friendlyOp(op) }), ' ', _jsx(Text, { style: valueStyle, children: getAllocationMethods()[method] }), method !== 'remainder' && ': ', method === 'fixed-amount' && (_jsx(Value, { style: valueStyle, value: value, field: "amount" })), method === 'fixed-percent' && _jsxs(Text, { style: valueStyle, children: [value, "%"] })] }));
}
function LinkScheduleActionExpression({ op, value, }) {
    return (_jsxs(_Fragment, { children: [_jsx(Text, { children: friendlyOp(op) }), " ", _jsx(ScheduleValue, { value: value })] }));
}
function PrependNoteActionExpression({ op, value, }) {
    return (_jsxs(_Fragment, { children: [_jsx(Text, { children: friendlyOp(op) }), ' ', _jsx(Value, { style: valueStyle, value: value, field: "notes" })] }));
}
function AppendNoteActionExpression({ op, value }) {
    return (_jsxs(_Fragment, { children: [_jsx(Text, { children: friendlyOp(op) }), ' ', _jsx(Value, { style: valueStyle, value: value, field: "notes" })] }));
}
function DeleteTransactionActionExpression({ op, }) {
    return _jsx(Text, { children: friendlyOp(op) });
}
