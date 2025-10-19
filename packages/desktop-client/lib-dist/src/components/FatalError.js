import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Block } from '@actual-app/components/block';
import { Button } from '@actual-app/components/button';
import { Paragraph } from '@actual-app/components/paragraph';
import { Stack } from '@actual-app/components/stack';
import { Text } from '@actual-app/components/text';
import { View } from '@actual-app/components/view';
import { LazyLoadFailedError } from 'loot-core/shared/errors';
import { Link } from './common/Link';
import { Modal, ModalHeader } from './common/Modal';
import { Checkbox } from './forms';
import { useModalState } from '@desktop-client/hooks/useModalState';
function RenderSimple({ error }) {
    let msg;
    if ('IDBFailure' in error && error.IDBFailure) {
        // IndexedDB wasn't able to open the database
        msg = (_jsx(Text, { children: _jsx(Trans, { children: "Your browser doesn\u2019t support IndexedDB in this environment, a feature that Actual requires to run. This might happen if you are in private browsing mode. Please try a different browser or turn off private browsing." }) }));
    }
    else if ('SharedArrayBufferMissing' in error &&
        error.SharedArrayBufferMissing) {
        // SharedArrayBuffer isn't available
        msg = (_jsx(Text, { children: _jsxs(Trans, { children: ["Actual requires access to ", _jsx("code", { children: "SharedArrayBuffer" }), " in order to function properly. If you\u2019re seeing this error, either your browser does not support ", _jsx("code", { children: "SharedArrayBuffer" }), ", or your server is not sending the appropriate headers, or you are not using HTTPS. See", ' ', _jsx(Link, { variant: "external", linkColor: "muted", to: "https://actualbudget.org/docs/troubleshooting/shared-array-buffer", children: "our troubleshooting documentation" }), ' ', "to learn more. ", _jsx(SharedArrayBufferOverride, {})] }) }));
    }
    else {
        // This indicates the backend failed to initialize. Show the
        // user something at least so they aren't looking at a blank
        // screen
        msg = (_jsx(Text, { children: _jsx(Trans, { children: "There was a problem loading the app in this browser version." }) }));
    }
    return (_jsxs(Stack, { style: {
            paddingBottom: 15,
            lineHeight: '1.5em',
            fontSize: 15,
        }, children: [_jsx(Text, { children: msg }), _jsx(Text, { children: _jsxs(Trans, { children: ["Please get", ' ', _jsx(Link, { variant: "external", linkColor: "muted", to: "https://actualbudget.org/contact", children: "in touch" }), ' ', "for support"] }) })] }));
}
function RenderLazyLoadError() {
    return (_jsx(Stack, { style: {
            paddingBottom: 15,
            lineHeight: '1.5em',
            fontSize: 15,
        }, children: _jsx(Text, { children: _jsx(Trans, { children: "There was a problem loading one of the chunks of the application. Please reload the page and try again. If the issue persists - there might be an issue with either your internet connection and/or the server where the app is hosted." }) }) }));
}
function RenderUIError() {
    return (_jsxs(_Fragment, { children: [_jsx(Paragraph, { children: _jsx(Trans, { children: "There was an unrecoverable error in the UI. Sorry!" }) }), _jsx(Paragraph, { children: _jsxs(Trans, { children: ["If this error persists, please get", ' ', _jsx(Link, { variant: "external", to: "https://actualbudget.org/contact", children: "in touch" }), ' ', "so it can be investigated."] }) })] }));
}
function SharedArrayBufferOverride() {
    const [expanded, setExpanded] = useState(false);
    const [understand, setUnderstand] = useState(false);
    return expanded ? (_jsxs(_Fragment, { children: [_jsx(Paragraph, { style: { marginTop: 10 }, children: _jsxs(Trans, { children: ["Actual uses ", _jsx("code", { children: "SharedArrayBuffer" }), " to allow usage from multiple tabs at once and to ensure correct behavior when switching files. While it can run without access to", _jsx("code", { children: "SharedArrayBuffer" }), ", you may encounter data loss or notice multiple budget files being merged with each other."] }) }), _jsxs("label", { style: { display: 'flex', alignItems: 'center', marginBottom: 10 }, children: [_jsx(Checkbox, { checked: understand, onChange: () => setUnderstand(!understand) }), ' ', _jsx(Trans, { children: "I understand the risks, run Actual in the unsupported fallback mode" })] }), _jsx(Button, { isDisabled: !understand, onPress: () => {
                    window.localStorage.setItem('SharedArrayBufferOverride', 'true');
                    window.location.reload();
                }, children: _jsx(Trans, { children: "Open Actual" }) })] })) : (_jsx(Link, { variant: "text", onClick: () => setExpanded(true), style: { marginLeft: 5 }, children: _jsx(Trans, { children: "Advanced options" }) }));
}
export function FatalError({ error }) {
    const { t } = useTranslation();
    const { modalStack } = useModalState();
    const lastModal = modalStack[modalStack.length - 1];
    const [showError, setShowError] = useState(false);
    const showSimpleRender = 'type' in error && error.type === 'app-init-failure';
    const isLazyLoadError = error instanceof LazyLoadFailedError;
    return (_jsxs(Modal, { name: lastModal?.name ?? 'fatal-error', isDismissable: false, children: [_jsx(ModalHeader, { title: isLazyLoadError ? t('Loading Error') : t('Fatal Error') }), _jsxs(View, { style: {
                    maxWidth: 500,
                }, children: [isLazyLoadError ? (_jsx(RenderLazyLoadError, {})) : showSimpleRender ? (_jsx(RenderSimple, { error: error })) : (_jsx(RenderUIError, {})), _jsx(Paragraph, { children: _jsx(Button, { onPress: () => window.Actual.relaunch(), children: _jsx(Trans, { children: "Restart app" }) }) }), _jsxs(Paragraph, { isLast: true, style: { fontSize: 11 }, children: [_jsx(Link, { variant: "text", onClick: () => setShowError(state => !state), children: _jsx(Trans, { children: "Show Error" }) }), showError && (_jsx(Block, { style: {
                                    marginTop: 5,
                                    height: 100,
                                    overflow: 'auto',
                                }, children: error.stack }))] })] })] }));
}
