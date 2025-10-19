import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Block } from '@actual-app/components/block';
import { AnimatedLoading } from '@actual-app/components/icons/AnimatedLoading';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
export const LoadingIndicator = ({ message }) => {
    return (_jsxs(View, { style: {
            flex: 1,
            gap: 20,
            justifyContent: 'center',
            alignItems: 'center',
            ...styles.delayedFadeIn,
        }, children: [message && (_jsx(Block, { style: { marginBottom: 20, fontSize: 18 }, children: message })), _jsx(AnimatedLoading, { style: { width: 25, height: 25, color: theme.pageTextDark } })] }));
};
