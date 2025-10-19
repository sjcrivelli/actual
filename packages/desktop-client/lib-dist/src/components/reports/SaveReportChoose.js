import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRef, useEffect, useState } from 'react';
import { Form } from 'react-aria-components';
import { Trans } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { Stack } from '@actual-app/components/stack';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { GenericInput } from '@desktop-client/components/util/GenericInput';
export function SaveReportChoose({ onApply }) {
    const inputRef = useRef(null);
    const [err, setErr] = useState('');
    const [value, setValue] = useState('');
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);
    return (_jsxs(_Fragment, { children: [_jsxs(Form, { onSubmit: e => {
                    e.preventDefault();
                    if (!value) {
                        setErr('Invalid report entered');
                        return;
                    }
                    onApply(value);
                }, children: [_jsxs(View, { style: { flexDirection: 'row', align: 'center' }, children: [_jsx(Text, { style: { userSelect: 'none', flex: 1 }, children: _jsx(Trans, { children: "Choose Report" }) }), _jsx(View, { style: { flex: 1 } })] }), _jsx(GenericInput, { ref: inputRef, field: "report", subfield: null, type: "saved", value: value, multi: false, style: { marginTop: 10 }, onChange: (v) => setValue(v) }), _jsxs(Stack, { direction: "row", justify: "flex-end", align: "center", style: { marginTop: 15 }, children: [_jsx(View, { style: { flex: 1 } }), _jsx(Button, { variant: "primary", type: "submit", children: _jsx(Trans, { children: "Apply" }) })] })] }), err !== '' ? (_jsx(Stack, { direction: "row", align: "center", style: { padding: 10 }, children: _jsx(Text, { style: { color: theme.errorText }, children: err }) })) : (_jsx(View, {}))] }));
}
