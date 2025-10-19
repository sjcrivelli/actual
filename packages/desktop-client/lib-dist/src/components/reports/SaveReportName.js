import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Form } from 'react-aria-components';
import { useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { Input } from '@actual-app/components/input';
import { Stack } from '@actual-app/components/stack';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { FormField, FormLabel } from '@desktop-client/components/forms';
export function SaveReportName({ menuItem, name, setName, inputRef, onAddUpdate, err, report, }) {
    const { t } = useTranslation();
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);
    return (_jsxs(_Fragment, { children: [menuItem !== 'update-report' && (_jsx(Form, { onSubmit: e => {
                    e.preventDefault();
                    onAddUpdate({
                        menuChoice: menuItem ?? undefined,
                        reportData: report ?? undefined,
                    });
                }, children: _jsxs(Stack, { direction: "row", justify: "flex-end", align: "center", style: { padding: 15 }, children: [_jsxs(FormField, { style: { flex: 1 }, children: [_jsx(FormLabel, { title: t('Report Name'), htmlFor: "name-field", style: { userSelect: 'none' } }), _jsx(Input, { value: name, id: "name-field", ref: inputRef, onChangeValue: setName, style: { marginTop: 10 } })] }), _jsx(Button, { variant: "primary", type: "submit", style: { marginTop: 30 }, children: menuItem === 'save-report' ? t('Add') : t('Update') })] }) })), err !== '' ? (_jsx(Stack, { direction: "row", align: "center", style: { padding: 10 }, children: _jsx(Text, { style: { color: theme.errorText }, children: err }) })) : (_jsx(View, {}))] }));
}
