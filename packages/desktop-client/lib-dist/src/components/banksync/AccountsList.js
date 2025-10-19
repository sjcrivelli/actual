import { jsx as _jsx } from "react/jsx-runtime";
import { View } from '@actual-app/components/view';
import { AccountRow } from './AccountRow';
import { useLocale } from '@desktop-client/hooks/useLocale';
export function AccountsList({ accounts, hoveredAccount, onHover, onAction, }) {
    const locale = useLocale();
    if (accounts.length === 0) {
        return null;
    }
    return (_jsx(View, { style: {
            minHeight: 'initial',
        }, children: accounts.map(account => {
            const hovered = hoveredAccount === account.id;
            return (_jsx(AccountRow, { account: account, hovered: hovered, onHover: onHover, onAction: onAction, locale: locale }, account.id));
        }) }));
}
