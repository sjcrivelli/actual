import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgClose } from '@actual-app/components/icons/v1';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { Link } from './common/Link';
import { setAppState, updateApp } from '@desktop-client/app/appSlice';
import { useSelector, useDispatch } from '@desktop-client/redux';
export function UpdateNotification() {
    const { t } = useTranslation();
    const updateInfo = useSelector(state => state.app.updateInfo);
    const showUpdateNotification = useSelector(state => state.app.showUpdateNotification);
    const dispatch = useDispatch();
    const onRestart = () => {
        dispatch(updateApp());
    };
    if (updateInfo && showUpdateNotification) {
        const notes = updateInfo.releaseNotes;
        return (_jsxs(View, { style: {
                position: 'absolute',
                bottom: 0,
                right: 0,
                margin: '15px 17px',
                backgroundColor: theme.pageTextPositive,
                color: theme.tableBackground,
                padding: '7px 10px',
                borderRadius: 4,
                zIndex: 10000,
                maxWidth: 450,
            }, children: [_jsxs(View, { style: { flexDirection: 'row', alignItems: 'center' }, children: [_jsx(View, { style: { marginRight: 10, fontWeight: 700 }, children: _jsx(Text, { children: _jsxs(Trans, { children: ["App updated to ", { version: updateInfo.version }] }) }) }), _jsx(View, { style: { flex: 1 } }), _jsx(View, { style: { marginTop: -1 }, children: _jsxs(Text, { children: [_jsx(Link, { variant: "text", onClick: onRestart, style: {
                                            color: theme.buttonPrimaryText,
                                            textDecoration: 'underline',
                                        }, children: _jsx(Trans, { children: "Restart" }) }), ' ', "(", _jsx(Link, { variant: "text", style: {
                                            color: theme.buttonPrimaryText,
                                            textDecoration: 'underline',
                                        }, onClick: () => window.Actual.openURLInBrowser('https://actualbudget.org/docs/releases'), children: _jsx(Trans, { children: "notes" }) }), ")", _jsx(Button, { variant: "bare", "aria-label": t('Close'), style: { display: 'inline', padding: '1px 7px 2px 7px' }, onPress: () => {
                                            // Set a flag to never show an update notification again for this session
                                            dispatch(setAppState({
                                                updateInfo: null,
                                                showUpdateNotification: false,
                                            }));
                                        }, children: _jsx(SvgClose, { width: 9, style: { color: theme.buttonPrimaryText } }) })] }) })] }), notes && (_jsx(View, { style: { marginTop: 10, fontWeight: 500 }, children: notes }))] }));
    }
    return null;
}
