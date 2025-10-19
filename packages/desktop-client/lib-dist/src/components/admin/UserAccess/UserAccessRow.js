import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-strict-ignore
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { send } from 'loot-core/platform/client/fetch';
import { getUserAccessErrors } from 'loot-core/shared/errors';
import { Checkbox } from '@desktop-client/components/forms';
import { Row, Cell } from '@desktop-client/components/table';
import { useMetadataPref } from '@desktop-client/hooks/useMetadataPref';
import { addNotification } from '@desktop-client/notifications/notificationsSlice';
import { useDispatch } from '@desktop-client/redux';
import { signOut } from '@desktop-client/users/usersSlice';
export const UserAccessRow = memo(({ access, hovered, onHover }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const backgroundFocus = hovered;
    const [marked, setMarked] = useState(access.owner === 1 || access.haveAccess === 1);
    const [cloudFileId] = useMetadataPref('cloudFileId');
    const handleAccessToggle = async () => {
        const newValue = !marked;
        if (newValue) {
            const { error } = await send('access-add', {
                fileId: cloudFileId,
                userId: access.userId,
            });
            if (error) {
                handleError(error);
            }
        }
        else {
            const result = await send('access-delete-all', {
                fileId: cloudFileId,
                ids: [access.userId],
            });
            if ('someDeletionsFailed' in result && result.someDeletionsFailed) {
                dispatch(addNotification({
                    notification: {
                        type: 'error',
                        title: t('Access Revocation Incomplete'),
                        message: t('Some access permissions were not revoked successfully.'),
                        sticky: true,
                    },
                }));
            }
        }
        setMarked(newValue);
    };
    const handleError = (error) => {
        if (error === 'token-expired') {
            dispatch(addNotification({
                notification: {
                    type: 'error',
                    id: 'login-expired',
                    title: t('Login expired'),
                    sticky: true,
                    message: getUserAccessErrors(error),
                    button: {
                        title: t('Go to login'),
                        action: () => {
                            dispatch(signOut());
                        },
                    },
                },
            }));
        }
        else {
            dispatch(addNotification({
                notification: {
                    type: 'error',
                    title: t('Something happened while editing access'),
                    sticky: true,
                    message: getUserAccessErrors(error),
                },
            }));
        }
    };
    return (_jsxs(Row, { height: "auto", style: {
            fontSize: 13,
            backgroundColor: backgroundFocus
                ? theme.tableRowBackgroundHover
                : theme.tableBackground,
        }, collapsed: true, onMouseEnter: () => onHover && onHover(access.userId), onMouseLeave: () => onHover && onHover(null), children: [_jsx(Cell, { width: 100, plain: true, style: { padding: '0 15px', paddingLeft: 5, alignItems: 'center' }, children: _jsx(Checkbox, { defaultChecked: marked, disabled: access.owner === 1, onClick: handleAccessToggle }) }), _jsx(Cell, { name: "displayName", width: "flex", plain: true, style: { color: theme.tableText }, children: _jsx(View, { style: {
                        alignSelf: 'flex-start',
                        padding: '3px 5px',
                    }, children: _jsx("span", { children: access.displayName ?? access.userName }) }) }), _jsx(Cell, { name: "displayName", width: 100, plain: true, style: { color: theme.tableText }, children: _jsx(View, { style: { padding: '0 15px', paddingLeft: 5, alignItems: 'center' }, children: _jsx(Checkbox, { checked: access.owner === 1, disabled: access.owner === 1 }) }) })] }));
});
UserAccessRow.displayName = 'UserRow';
