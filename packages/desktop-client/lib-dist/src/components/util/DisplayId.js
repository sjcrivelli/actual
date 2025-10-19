import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Text } from '@actual-app/components/text';
import { TextOneLine } from '@actual-app/components/text-one-line';
import { theme } from '@actual-app/components/theme';
import { useAccount } from '@desktop-client/hooks/useAccount';
import { usePayee } from '@desktop-client/hooks/usePayee';
export function DisplayId({ type, id, noneColor = theme.pageTextSubdued, }) {
    return type === 'accounts' ? (_jsx(AccountDisplayId, { id: id, noneColor: noneColor })) : (_jsx(PayeeDisplayId, { id: id, noneColor: noneColor }));
}
function AccountDisplayId({ id, noneColor }) {
    const { t } = useTranslation();
    const account = useAccount(id);
    return (_jsx(Text, { style: account == null ? { color: noneColor } : null, title: account ? account.name : t('None'), children: account ? account.name : t('None') }));
}
function PayeeDisplayId({ id, noneColor }) {
    const { t } = useTranslation();
    const payee = usePayee(id);
    return (_jsx(TextOneLine, { style: payee == null ? { color: noneColor } : null, title: payee ? payee.name : t('None'), children: payee ? payee.name : t('None') }));
}
