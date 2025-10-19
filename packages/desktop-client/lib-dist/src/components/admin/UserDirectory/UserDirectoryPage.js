import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { View } from '@actual-app/components/view';
import { UserDirectory } from './UserDirectory';
import { Page } from '@desktop-client/components/Page';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
export function UserDirectoryPage({ bottomContent, }) {
    const { t } = useTranslation();
    return (_jsxs(Page, { header: t('User Directory'), style: {
            borderRadius: '5px',
            marginBottom: '25px',
        }, children: [_jsx(UserDirectory, { isModal: false }), _jsx(View, { style: {
                    flexGrow: 1,
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                    marginBottom: 15,
                }, children: bottomContent })] }));
}
export function BackToFileListButton() {
    const navigate = useNavigate();
    return (_jsx(Button, { style: { maxWidth: '200px' }, onPress: () => navigate('/'), children: _jsx(Trans, { children: "Back to file list" }) }));
}
