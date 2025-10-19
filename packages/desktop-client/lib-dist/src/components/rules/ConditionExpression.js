import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { mapField, friendlyOp } from 'loot-core/shared/rules';
import { Value } from './Value';
const valueStyle = {
    color: theme.pillTextHighlighted,
};
export function ConditionExpression({ field, op, value, options, prefix, style, inline, }) {
    return (_jsxs(View, { style: {
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
        }, children: [prefix && _jsxs(Text, { children: [prefix, " "] }), _jsx(Text, { style: valueStyle, children: mapField(field, options) }), ' ', _jsx(Text, { children: friendlyOp(op) }), ' ', !['onbudget', 'offbudget'].includes(op?.toLocaleLowerCase()) && (_jsx(Value, { style: valueStyle, value: value, field: field, inline: inline }))] }));
}
