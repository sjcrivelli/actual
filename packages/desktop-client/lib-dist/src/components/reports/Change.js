import { jsxs as _jsxs } from "react/jsx-runtime";
import { Block } from '@actual-app/components/block';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { useFormat } from '@desktop-client/hooks/useFormat';
export function Change({ amount, style, }) {
    const format = useFormat();
    return (_jsxs(Block, { style: {
            ...styles.smallText,
            color: amount < 0 ? theme.errorText : theme.noticeTextLight,
            ...style,
        }, children: [amount >= 0 ? '+' : '', format(amount, 'financial')] }));
}
