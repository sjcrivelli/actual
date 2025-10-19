import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { FieldSelect } from '@desktop-client/components/rules/RuleEditor';
export function ConditionsOpMenu({ conditionsOp, onChange, conditions, }) {
    return conditions.length > 1 ? (_jsxs(Text, { style: { color: theme.pageText, marginTop: 11, marginRight: 5 }, children: [_jsx(FieldSelect, { style: { display: 'inline-flex' }, fields: [
                    ['and', 'all'],
                    ['or', 'any'],
                ], value: conditionsOp, onChange: onChange }), "of:"] })) : (_jsx(View, {}));
}
