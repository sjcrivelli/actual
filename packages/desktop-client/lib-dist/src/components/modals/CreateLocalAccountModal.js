import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-strict-ignore
import { useState } from 'react';
import { Form } from 'react-aria-components';
import { useTranslation, Trans } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { FormError } from '@actual-app/components/form-error';
import { InitialFocus } from '@actual-app/components/initial-focus';
import { InlineField } from '@actual-app/components/inline-field';
import { Input } from '@actual-app/components/input';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { toRelaxedNumber } from 'loot-core/shared/util';
import { createAccount } from '@desktop-client/accounts/accountsSlice';
import { Link } from '@desktop-client/components/common/Link';
import { Modal, ModalButtons, ModalCloseButton, ModalHeader, ModalTitle, } from '@desktop-client/components/common/Modal';
import { Checkbox } from '@desktop-client/components/forms';
import { validateAccountName } from '@desktop-client/components/util/accountValidation';
import { useAccounts } from '@desktop-client/hooks/useAccounts';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
import { closeModal } from '@desktop-client/modals/modalsSlice';
import { useDispatch } from '@desktop-client/redux';
export function CreateLocalAccountModal() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const accounts = useAccounts();
    const [name, setName] = useState('');
    const [offbudget, setOffbudget] = useState(false);
    const [balance, setBalance] = useState('0');
    const [nameError, setNameError] = useState(null);
    const [balanceError, setBalanceError] = useState(false);
    const validateBalance = balance => !isNaN(parseFloat(balance));
    const validateAndSetName = (name) => {
        const nameError = validateAccountName(name, '', accounts);
        if (nameError) {
            setNameError(nameError);
        }
        else {
            setName(name);
            setNameError(null);
        }
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        const nameError = validateAccountName(name, '', accounts);
        const balanceError = !validateBalance(balance);
        setBalanceError(balanceError);
        if (!nameError && !balanceError) {
            dispatch(closeModal());
            const id = await dispatch(createAccount({
                name,
                balance: toRelaxedNumber(balance),
                offBudget: offbudget,
            })).unwrap();
            navigate('/accounts/' + id);
        }
    };
    return (_jsx(Modal, { name: "add-local-account", children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: _jsx(ModalTitle, { title: t('Create Local Account'), shrinkOnOverflow: true }), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsx(View, { children: _jsxs(Form, { onSubmit: onSubmit, children: [_jsx(InlineField, { label: t('Name'), width: "100%", children: _jsx(InitialFocus, { children: _jsx(Input, { name: "name", value: name, onChangeValue: setName, onUpdate: value => {
                                            const name = value.trim();
                                            validateAndSetName(name);
                                        }, style: { flex: 1 } }) }) }), nameError && (_jsx(FormError, { style: { marginLeft: 75, color: theme.warningText }, children: nameError })), _jsx(View, { style: {
                                    width: '100%',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                }, children: _jsxs(View, { style: { flexDirection: 'column' }, children: [_jsxs(View, { style: {
                                                flexDirection: 'row',
                                                justifyContent: 'flex-end',
                                            }, children: [_jsx(Checkbox, { id: "offbudget", name: "offbudget", checked: offbudget, onChange: () => setOffbudget(!offbudget) }), _jsx("label", { htmlFor: "offbudget", style: {
                                                        userSelect: 'none',
                                                        verticalAlign: 'center',
                                                    }, children: _jsx(Trans, { children: "Off budget" }) })] }), _jsx("div", { style: {
                                                textAlign: 'right',
                                                fontSize: '0.7em',
                                                color: theme.pageTextLight,
                                                marginTop: 3,
                                            }, children: _jsx(Text, { children: _jsxs(Trans, { children: ["This cannot be changed later. See", ' ', _jsx(Link, { variant: "external", linkColor: "muted", to: "https://actualbudget.org/docs/accounts/#off-budget-accounts", children: "Accounts Overview" }), ' ', "for more information."] }) }) })] }) }), _jsx(InlineField, { label: t('Balance'), width: "100%", children: _jsx(Input, { name: "balance", inputMode: "decimal", value: balance, onChangeValue: setBalance, onUpdate: value => {
                                        const balance = value.trim();
                                        setBalance(balance);
                                        if (validateBalance(balance) && balanceError) {
                                            setBalanceError(false);
                                        }
                                    }, style: { flex: 1 } }) }), balanceError && (_jsx(FormError, { style: { marginLeft: 75 }, children: _jsx(Trans, { children: "Balance must be a number" }) })), _jsxs(ModalButtons, { children: [_jsx(Button, { onPress: close, children: _jsx(Trans, { children: "Back" }) }), _jsx(Button, { type: "submit", variant: "primary", style: { marginLeft: 10 }, children: _jsx(Trans, { children: "Create" }) })] })] }) })] })) }));
}
