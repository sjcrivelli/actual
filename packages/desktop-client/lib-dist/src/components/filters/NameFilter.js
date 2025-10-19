import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRef, useEffect } from 'react';
import { Form } from 'react-aria-components';
import { useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { Input } from '@actual-app/components/input';
import { Stack } from '@actual-app/components/stack';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { FormField, FormLabel } from '@desktop-client/components/forms';
export function NameFilter({ menuItem, name, setName, adding, onAddUpdate, err, }) {
    const { t } = useTranslation();
    const inputRef = useRef(null);
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);
    return (_jsxs(_Fragment, { children: [menuItem !== 'update-filter' && (_jsx(Form, { onSubmit: e => {
                    e.preventDefault();
                    onAddUpdate();
                }, children: _jsxs(Stack, { direction: "row", justify: "flex-end", align: "center", style: { padding: 10 }, children: [_jsxs(FormField, { style: { flex: 1 }, children: [_jsx(FormLabel, { title: t('Filter name'), htmlFor: "name-field", style: { userSelect: 'none' } }), _jsx(Input, { id: "name-field", ref: inputRef, defaultValue: name || '', onChangeValue: setName })] }), _jsx(Button, { variant: "primary", type: "submit", style: { marginTop: 18 }, children: adding ? t('Add') : t('Update') })] }) })), err && (_jsx(Stack, { direction: "row", align: "center", style: { padding: 10 }, children: _jsx(Text, { style: { color: theme.errorText }, children: err }) }))] }));
}
