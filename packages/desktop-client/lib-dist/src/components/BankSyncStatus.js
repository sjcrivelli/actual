import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Trans } from 'react-i18next';
import { useTransition, animated } from 'react-spring';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { AnimatedRefresh } from './AnimatedRefresh';
import { useSelector } from '@desktop-client/redux';
export function BankSyncStatus() {
    const accountsSyncing = useSelector(state => state.account.accountsSyncing);
    const accountsSyncingCount = accountsSyncing.length;
    const count = accountsSyncingCount;
    const transitions = useTransition(accountsSyncingCount > 0 ? 'syncing' : null, {
        from: { opacity: 0, transform: 'translateY(-100px)' },
        enter: { opacity: 1, transform: 'translateY(0)' },
        leave: { opacity: 0, transform: 'translateY(-100px)' },
    });
    return (_jsx(View, { style: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            marginTop: 5,
            alignItems: 'center',
            zIndex: 501,
        }, children: transitions((style, item) => item && (_jsx(animated.div, { style: style, children: _jsxs(View, { style: {
                    borderRadius: 4,
                    backgroundColor: theme.pillBackgroundSelected,
                    color: theme.pillTextSelected,
                    padding: '5px 13px',
                    flexDirection: 'row',
                    alignItems: 'center',
                    ...styles.shadow,
                }, children: [_jsx(AnimatedRefresh, { animating: true, iconStyle: { color: theme.pillTextSelected } }), _jsx(Text, { style: { marginLeft: 5 }, children: _jsxs(Trans, { count: accountsSyncingCount, children: ["Syncing... ", { count }, " accounts remaining"] }) })] }) }, item))) }));
}
