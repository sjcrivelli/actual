import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-strict-ignore
import { useEffect, useState, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { AnimatedLoading } from '@actual-app/components/icons/AnimatedLoading';
import { Paragraph } from '@actual-app/components/paragraph';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { sendCatch } from 'loot-core/platform/client/fetch';
import { Error, Warning } from '@desktop-client/components/alerts';
import { Autocomplete } from '@desktop-client/components/autocomplete/Autocomplete';
import { Link } from '@desktop-client/components/common/Link';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { FormField, FormLabel } from '@desktop-client/components/forms';
import { COUNTRY_OPTIONS } from '@desktop-client/components/util/countries';
import { useGoCardlessStatus } from '@desktop-client/hooks/useGoCardlessStatus';
import { pushModal, } from '@desktop-client/modals/modalsSlice';
import { useDispatch } from '@desktop-client/redux';
function useAvailableBanks(country) {
    const [banks, setBanks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    useEffect(() => {
        async function fetch() {
            setIsError(false);
            if (!country) {
                setBanks([]);
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            const { data, error } = await sendCatch('gocardless-get-banks', country);
            if (error || !Array.isArray(data)) {
                setIsError(true);
                setBanks([]);
            }
            else {
                setBanks(data);
            }
            setIsLoading(false);
        }
        fetch();
    }, [setBanks, setIsLoading, country]);
    return {
        data: banks,
        isLoading,
        isError,
    };
}
function renderError(error, t) {
    return (_jsx(Error, { style: { alignSelf: 'center', marginBottom: 10 }, children: error.code === 'timeout'
            ? t('Timed out. Please try again.')
            : t('An error occurred while linking your account, sorry! The potential issue could be: {{ message }}', { message: error.message }) }));
}
export function GoCardlessExternalMsgModal({ onMoveExternal, onSuccess, onClose, }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waiting, setWaiting] = useState(null);
    const [success, setSuccess] = useState(false);
    const [institutionId, setInstitutionId] = useState();
    const [country, setCountry] = useState();
    const [error, setError] = useState(null);
    const [isGoCardlessSetupComplete, setIsGoCardlessSetupComplete] = useState(null);
    const data = useRef(null);
    const { data: bankOptions, isLoading: isBankOptionsLoading, isError: isBankOptionError, } = useAvailableBanks(country);
    const { configuredGoCardless: isConfigured, isLoading: isConfigurationLoading, } = useGoCardlessStatus();
    async function onJump() {
        setError(null);
        setWaiting('browser');
        const res = await onMoveExternal({ institutionId });
        if ('error' in res) {
            setError({
                code: res.error,
                message: 'message' in res ? res.message : undefined,
            });
            setWaiting(null);
            return;
        }
        data.current = res.data;
        setWaiting(null);
        setSuccess(true);
    }
    async function onContinue() {
        setWaiting('accounts');
        await onSuccess(data.current);
        setWaiting(null);
    }
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
    const renderLinkButton = () => {
        return (_jsxs(View, { style: { gap: 10 }, children: [_jsxs(FormField, { children: [_jsx(FormLabel, { title: t('Choose your country:'), htmlFor: "country-field" }), _jsx(Autocomplete, { strict: true, highlightFirst: true, suggestions: COUNTRY_OPTIONS, onSelect: setCountry, value: country, inputProps: {
                                id: 'country-field',
                                placeholder: t('(please select)'),
                            } })] }), isBankOptionError ? (_jsx(Error, { children: _jsxs(Trans, { children: ["Failed loading available banks: GoCardless access credentials might be misconfigured. Please", ' ', _jsx(Link, { variant: "text", onClick: onGoCardlessInit, style: { color: theme.formLabelText, display: 'inline' }, children: "set them up" }), ' ', "again."] }) })) : (country &&
                    (isBankOptionsLoading ? (t('Loading banks...')) : (_jsxs(FormField, { children: [_jsx(FormLabel, { title: t('Choose your bank:'), htmlFor: "bank-field" }), _jsx(Autocomplete, { focused: true, strict: true, highlightFirst: true, suggestions: bankOptions, onSelect: setInstitutionId, value: institutionId, inputProps: {
                                    id: 'bank-field',
                                    placeholder: t('(please select)'),
                                } })] })))), _jsx(Warning, { children: _jsxs(Trans, { children: ["By enabling bank sync, you will be granting GoCardless (a third party service) read-only access to your entire account\u2019s transaction history. This service is not affiliated with Actual in any way. Make sure you\u2019ve read and understand GoCardless\u2019s", ' ', _jsx(Link, { variant: "external", to: "https://gocardless.com/privacy/", linkColor: "purple", children: "Privacy Policy" }), ' ', "before proceeding."] }) }), _jsx(View, { style: { flexDirection: 'row', gap: 10, alignItems: 'center' }, children: _jsxs(Button, { variant: "primary", autoFocus: true, style: {
                            padding: '10px 0',
                            fontSize: 15,
                            fontWeight: 600,
                            flexGrow: 1,
                        }, onPress: onJump, isDisabled: !institutionId || !country, children: [_jsx(Trans, { children: "Link bank in browser" }), " \u2192"] }) })] }));
    };
    return (_jsx(Modal, { name: "gocardless-external-msg", onClose: onClose, containerProps: { style: { width: '30vw' } }, children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Link Your Bank'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { children: [_jsx(Paragraph, { style: { fontSize: 15 }, children: _jsx(Trans, { children: "To link your bank account, you will be redirected to a new page where GoCardless will ask to connect to your bank. GoCardless will not be able to withdraw funds from your accounts." }) }), error && renderError(error, t), waiting || isConfigurationLoading ? (_jsxs(View, { style: { alignItems: 'center', marginTop: 15 }, children: [_jsx(AnimatedLoading, { color: theme.pageTextDark, style: { width: 20, height: 20 } }), _jsx(View, { style: { marginTop: 10, color: theme.pageText }, children: isConfigurationLoading
                                        ? t('Checking GoCardless configuration...')
                                        : waiting === 'browser'
                                            ? t('Waiting on GoCardless...')
                                            : waiting === 'accounts'
                                                ? t('Loading accounts...')
                                                : null }), waiting === 'browser' && (_jsxs(Link, { variant: "text", onClick: onJump, style: { marginTop: 10 }, children: ["(", _jsx(Trans, { children: "Account linking not opening in a new tab? Click here" }), ")"] }))] })) : success ? (_jsxs(Button, { variant: "primary", autoFocus: true, style: {
                                padding: '10px 0',
                                fontSize: 15,
                                fontWeight: 600,
                                marginTop: 10,
                            }, onPress: onContinue, children: [_jsx(Trans, { children: "Success! Click to continue" }), " \u2192"] })) : isConfigured || isGoCardlessSetupComplete ? (renderLinkButton()) : (_jsxs(_Fragment, { children: [_jsx(Paragraph, { style: { color: theme.errorText }, children: _jsx(Trans, { children: "GoCardless integration has not yet been configured." }) }), _jsx(Button, { variant: "primary", onPress: onGoCardlessInit, children: _jsx(Trans, { children: "Configure GoCardless integration" }) })] }))] })] })) }));
}
