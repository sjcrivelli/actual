import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Dialog, DialogTrigger } from 'react-aria-components';
import { Trans, useTranslation } from 'react-i18next';
import { Button, ButtonWithLoading } from '@actual-app/components/button';
import { SvgDotsHorizontalTriple } from '@actual-app/components/icons/v1';
import { InitialFocus } from '@actual-app/components/initial-focus';
import { Menu } from '@actual-app/components/menu';
import { Paragraph } from '@actual-app/components/paragraph';
import { Popover } from '@actual-app/components/popover';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { send } from 'loot-core/platform/client/fetch';
import { useAuth } from '@desktop-client/auth/AuthProvider';
import { Permissions } from '@desktop-client/auth/types';
import { Warning } from '@desktop-client/components/alerts';
import { Link } from '@desktop-client/components/common/Link';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { useMultiuserEnabled } from '@desktop-client/components/ServerContext';
import { authorizeBank } from '@desktop-client/gocardless';
import { useGoCardlessStatus } from '@desktop-client/hooks/useGoCardlessStatus';
import { usePluggyAiStatus } from '@desktop-client/hooks/usePluggyAiStatus';
import { useSimpleFinStatus } from '@desktop-client/hooks/useSimpleFinStatus';
import { useSyncServerStatus } from '@desktop-client/hooks/useSyncServerStatus';
import { pushModal, } from '@desktop-client/modals/modalsSlice';
import { addNotification } from '@desktop-client/notifications/notificationsSlice';
import { useDispatch } from '@desktop-client/redux';
export function CreateAccountModal({ upgradingAccountId, }) {
    const { t } = useTranslation();
    const syncServerStatus = useSyncServerStatus();
    const dispatch = useDispatch();
    const [isGoCardlessSetupComplete, setIsGoCardlessSetupComplete] = useState(null);
    const [isSimpleFinSetupComplete, setIsSimpleFinSetupComplete] = useState(null);
    const [isPluggyAiSetupComplete, setIsPluggyAiSetupComplete] = useState(null);
    const { hasPermission } = useAuth();
    const multiuserEnabled = useMultiuserEnabled();
    const onConnectGoCardless = () => {
        if (!isGoCardlessSetupComplete) {
            onGoCardlessInit();
            return;
        }
        if (upgradingAccountId == null) {
            authorizeBank(dispatch);
        }
        else {
            authorizeBank(dispatch);
        }
    };
    const onConnectSimpleFin = async () => {
        if (!isSimpleFinSetupComplete) {
            onSimpleFinInit();
            return;
        }
        if (loadingSimpleFinAccounts) {
            return;
        }
        setLoadingSimpleFinAccounts(true);
        try {
            const results = await send('simplefin-accounts');
            if (results.error_code) {
                throw new Error(results.reason);
            }
            const newAccounts = [];
            for (const oldAccount of results.accounts ?? []) {
                const newAccount = {
                    account_id: oldAccount.id,
                    name: oldAccount.name,
                    institution: oldAccount.org.name,
                    orgDomain: oldAccount.org.domain,
                    orgId: oldAccount.org.id,
                    balance: oldAccount.balance,
                };
                newAccounts.push(newAccount);
            }
            dispatch(pushModal({
                modal: {
                    name: 'select-linked-accounts',
                    options: {
                        externalAccounts: newAccounts,
                        syncSource: 'simpleFin',
                    },
                },
            }));
        }
        catch (err) {
            console.error(err);
            dispatch(pushModal({
                modal: {
                    name: 'simplefin-init',
                    options: {
                        onSuccess: () => setIsSimpleFinSetupComplete(true),
                    },
                },
            }));
        }
        setLoadingSimpleFinAccounts(false);
    };
    const onConnectPluggyAi = async () => {
        if (!isPluggyAiSetupComplete) {
            onPluggyAiInit();
            return;
        }
        try {
            const results = await send('pluggyai-accounts');
            if (results.error_code) {
                throw new Error(results.reason);
            }
            else if ('error' in results) {
                throw new Error(results.error);
            }
            const newAccounts = [];
            for (const oldAccount of results.accounts) {
                const newAccount = {
                    account_id: oldAccount.id,
                    name: `${oldAccount.name.trim()} - ${oldAccount.type === 'BANK' ? oldAccount.taxNumber : oldAccount.owner}`,
                    institution: oldAccount.name,
                    orgDomain: null,
                    orgId: oldAccount.id,
                    balance: oldAccount.type === 'BANK'
                        ? oldAccount.bankData.automaticallyInvestedBalance +
                            oldAccount.bankData.closingBalance
                        : oldAccount.balance,
                };
                newAccounts.push(newAccount);
            }
            dispatch(pushModal({
                modal: {
                    name: 'select-linked-accounts',
                    options: {
                        externalAccounts: newAccounts,
                        syncSource: 'pluggyai',
                    },
                },
            }));
        }
        catch (err) {
            console.error(err);
            addNotification({
                notification: {
                    type: 'error',
                    title: t('Error when trying to contact Pluggy.ai'),
                    message: err.message,
                    timeout: 5000,
                },
            });
            dispatch(pushModal({
                modal: {
                    name: 'pluggyai-init',
                    options: {
                        onSuccess: () => setIsPluggyAiSetupComplete(true),
                    },
                },
            }));
        }
    };
    const onGoCardlessInit = () => {
        dispatch(pushModal({
            modal: {
                name: 'gocardless-init',
                options: {
                    onSuccess: () => setIsGoCardlessSetupComplete(true),
                },
            },
        }));
    };
    const onSimpleFinInit = () => {
        dispatch(pushModal({
            modal: {
                name: 'simplefin-init',
                options: {
                    onSuccess: () => setIsSimpleFinSetupComplete(true),
                },
            },
        }));
    };
    const onPluggyAiInit = () => {
        dispatch(pushModal({
            modal: {
                name: 'pluggyai-init',
                options: {
                    onSuccess: () => setIsPluggyAiSetupComplete(true),
                },
            },
        }));
    };
    const onGoCardlessReset = () => {
        send('secret-set', {
            name: 'gocardless_secretId',
            value: null,
        }).then(() => {
            send('secret-set', {
                name: 'gocardless_secretKey',
                value: null,
            }).then(() => {
                setIsGoCardlessSetupComplete(false);
            });
        });
    };
    const onSimpleFinReset = () => {
        send('secret-set', {
            name: 'simplefin_token',
            value: null,
        }).then(() => {
            send('secret-set', {
                name: 'simplefin_accessKey',
                value: null,
            }).then(() => {
                setIsSimpleFinSetupComplete(false);
            });
        });
    };
    const onPluggyAiReset = () => {
        send('secret-set', {
            name: 'pluggyai_clientId',
            value: null,
        }).then(() => {
            send('secret-set', {
                name: 'pluggyai_clientSecret',
                value: null,
            }).then(() => {
                send('secret-set', {
                    name: 'pluggyai_itemIds',
                    value: null,
                }).then(() => {
                    setIsPluggyAiSetupComplete(false);
                });
            });
        });
    };
    const onCreateLocalAccount = () => {
        dispatch(pushModal({ modal: { name: 'add-local-account' } }));
    };
    const { configuredGoCardless } = useGoCardlessStatus();
    useEffect(() => {
        setIsGoCardlessSetupComplete(configuredGoCardless);
    }, [configuredGoCardless]);
    const { configuredSimpleFin } = useSimpleFinStatus();
    useEffect(() => {
        setIsSimpleFinSetupComplete(configuredSimpleFin);
    }, [configuredSimpleFin]);
    const { configuredPluggyAi } = usePluggyAiStatus();
    useEffect(() => {
        setIsPluggyAiSetupComplete(configuredPluggyAi);
    }, [configuredPluggyAi]);
    let title = t('Add account');
    const [loadingSimpleFinAccounts, setLoadingSimpleFinAccounts] = useState(false);
    if (upgradingAccountId != null) {
        title = t('Link account');
    }
    const canSetSecrets = !multiuserEnabled || hasPermission(Permissions.ADMINISTRATOR);
    return (_jsx(Modal, { name: "add-account", children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: title, rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { style: { maxWidth: 500, gap: 30, color: theme.pageText }, children: [upgradingAccountId == null && (_jsxs(View, { style: { gap: 10 }, children: [_jsx(InitialFocus, { children: _jsx(Button, { variant: "primary", style: {
                                            padding: '10px 0',
                                            fontSize: 15,
                                            fontWeight: 600,
                                        }, onPress: onCreateLocalAccount, children: _jsx(Trans, { children: "Create a local account" }) }) }), _jsx(View, { style: { lineHeight: '1.4em', fontSize: 15 }, children: _jsx(Text, { children: _jsxs(Trans, { children: [_jsx("strong", { children: "Create a local account" }), " if you want to add transactions manually. You can also", ' ', _jsx(Link, { variant: "external", to: "https://actualbudget.org/docs/transactions/importing", linkColor: "muted", children: "import QIF/OFX/QFX files into a local account" }), "."] }) }) })] })), _jsx(View, { style: { gap: 10 }, children: syncServerStatus === 'online' ? (_jsxs(_Fragment, { children: [canSetSecrets && (_jsxs(_Fragment, { children: [_jsxs(View, { style: {
                                                    flexDirection: 'row',
                                                    gap: 10,
                                                    alignItems: 'center',
                                                }, children: [_jsx(ButtonWithLoading, { isDisabled: syncServerStatus !== 'online', style: {
                                                            padding: '10px 0',
                                                            fontSize: 15,
                                                            fontWeight: 600,
                                                            flex: 1,
                                                        }, onPress: onConnectGoCardless, children: isGoCardlessSetupComplete
                                                            ? t('Link bank account with GoCardless')
                                                            : t('Set up GoCardless for bank sync') }), isGoCardlessSetupComplete && (_jsxs(DialogTrigger, { children: [_jsx(Button, { variant: "bare", "aria-label": t('GoCardless menu'), children: _jsx(SvgDotsHorizontalTriple, { width: 15, height: 15, style: { transform: 'rotateZ(90deg)' } }) }), _jsx(Popover, { children: _jsx(Dialog, { children: _jsx(Menu, { onMenuSelect: item => {
                                                                            if (item === 'reconfigure') {
                                                                                onGoCardlessReset();
                                                                            }
                                                                        }, items: [
                                                                            {
                                                                                name: 'reconfigure',
                                                                                text: t('Reset GoCardless credentials'),
                                                                            },
                                                                        ] }) }) })] }))] }), _jsx(Text, { style: { lineHeight: '1.4em', fontSize: 15 }, children: _jsxs(Trans, { children: [_jsxs("strong", { children: ["Link a ", _jsx("em", { children: "European" }), " bank account"] }), ' ', "to automatically download transactions. GoCardless provides reliable, up-to-date information from hundreds of banks."] }) }), _jsxs(View, { style: {
                                                    flexDirection: 'row',
                                                    gap: 10,
                                                    marginTop: '18px',
                                                    alignItems: 'center',
                                                }, children: [_jsx(ButtonWithLoading, { isDisabled: syncServerStatus !== 'online', isLoading: loadingSimpleFinAccounts, style: {
                                                            padding: '10px 0',
                                                            fontSize: 15,
                                                            fontWeight: 600,
                                                            flex: 1,
                                                        }, onPress: onConnectSimpleFin, children: isSimpleFinSetupComplete
                                                            ? t('Link bank account with SimpleFIN')
                                                            : t('Set up SimpleFIN for bank sync') }), isSimpleFinSetupComplete && (_jsxs(DialogTrigger, { children: [_jsx(Button, { variant: "bare", "aria-label": t('SimpleFIN menu'), children: _jsx(SvgDotsHorizontalTriple, { width: 15, height: 15, style: { transform: 'rotateZ(90deg)' } }) }), _jsx(Popover, { children: _jsx(Dialog, { children: _jsx(Menu, { onMenuSelect: item => {
                                                                            if (item === 'reconfigure') {
                                                                                onSimpleFinReset();
                                                                            }
                                                                        }, items: [
                                                                            {
                                                                                name: 'reconfigure',
                                                                                text: t('Reset SimpleFIN credentials'),
                                                                            },
                                                                        ] }) }) })] }))] }), _jsx(Text, { style: { lineHeight: '1.4em', fontSize: 15 }, children: _jsxs(Trans, { children: [_jsxs("strong", { children: ["Link a ", _jsx("em", { children: "North American" }), " bank account"] }), ' ', "to automatically download transactions. SimpleFIN provides reliable, up-to-date information from hundreds of banks."] }) }), _jsxs(View, { style: {
                                                    flexDirection: 'row',
                                                    gap: 10,
                                                    alignItems: 'center',
                                                }, children: [_jsx(ButtonWithLoading, { isDisabled: syncServerStatus !== 'online', style: {
                                                            padding: '10px 0',
                                                            fontSize: 15,
                                                            fontWeight: 600,
                                                            flex: 1,
                                                        }, onPress: onConnectPluggyAi, children: isPluggyAiSetupComplete
                                                            ? t('Link bank account with Pluggy.ai')
                                                            : t('Set up Pluggy.ai for bank sync') }), isPluggyAiSetupComplete && (_jsxs(DialogTrigger, { children: [_jsx(Button, { variant: "bare", "aria-label": t('Pluggy.ai menu'), children: _jsx(SvgDotsHorizontalTriple, { width: 15, height: 15, style: { transform: 'rotateZ(90deg)' } }) }), _jsx(Popover, { children: _jsx(Dialog, { children: _jsx(Menu, { onMenuSelect: item => {
                                                                            if (item === 'reconfigure') {
                                                                                onPluggyAiReset();
                                                                            }
                                                                        }, items: [
                                                                            {
                                                                                name: 'reconfigure',
                                                                                text: t('Reset Pluggy.ai credentials'),
                                                                            },
                                                                        ] }) }) })] }))] }), _jsx(Text, { style: { lineHeight: '1.4em', fontSize: 15 }, children: _jsxs(Trans, { children: [_jsxs("strong", { children: ["Link a ", _jsx("em", { children: "Brazilian" }), " bank account"] }), ' ', "to automatically download transactions. Pluggy.ai provides reliable, up-to-date information from hundreds of banks."] }) })] })), (!isGoCardlessSetupComplete ||
                                        !isSimpleFinSetupComplete ||
                                        !isPluggyAiSetupComplete) &&
                                        !canSetSecrets && (_jsxs(Warning, { children: [_jsx(Trans, { children: "You don't have the required permissions to set up secrets. Please contact an Admin to configure" }), ' ', [
                                                isGoCardlessSetupComplete ? '' : 'GoCardless',
                                                isSimpleFinSetupComplete ? '' : 'SimpleFIN',
                                                isPluggyAiSetupComplete ? '' : 'Pluggy.ai',
                                            ]
                                                .filter(Boolean)
                                                .join(' or '), "."] }))] })) : (_jsxs(_Fragment, { children: [_jsx(Button, { isDisabled: true, style: {
                                            padding: '10px 0',
                                            fontSize: 15,
                                            fontWeight: 600,
                                        }, children: _jsx(Trans, { children: "Set up bank sync" }) }), _jsx(Paragraph, { style: { fontSize: 15 }, children: _jsxs(Trans, { children: ["Connect to an Actual server to set up", ' ', _jsx(Link, { variant: "external", to: "https://actualbudget.org/docs/advanced/bank-sync", linkColor: "muted", children: "automatic syncing" }), "."] }) })] })) })] })] })) }));
}
