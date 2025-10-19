import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgAdd } from '@actual-app/components/icons/v1';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
export function AddTransactionButton({ to = '/transactions/new', accountId, categoryId, }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (_jsx(Button, { variant: "bare", "aria-label": t('Add transaction'), style: { margin: 10 }, onPress: () => {
            navigate(to, { state: { accountId, categoryId } });
        }, children: _jsx(SvgAdd, { width: 20, height: 20 }) }));
}
