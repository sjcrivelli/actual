import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from 'react';
import { Trans } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { Tooltip } from '@actual-app/components/tooltip';
import { format as formatDate } from 'date-fns';
import { tsToRelativeTime } from 'loot-core/shared/util';
import { Row, Cell } from '@desktop-client/components/table';
export const AccountRow = memo(({ account, hovered, onHover, onAction, locale }) => {
    const backgroundFocus = hovered;
    const lastSyncString = tsToRelativeTime(account.last_sync, locale, {
        capitalize: true,
    });
    const lastSyncDateTime = formatDate(new Date(parseInt(account.last_sync ?? '0', 10)), 'MMM d, yyyy, HH:mm:ss', { locale });
    const potentiallyTruncatedAccountName = account.name.length > 30
        ? account.name.slice(0, 30) + '...'
        : account.name;
    return (_jsxs(Row, { height: "auto", style: {
            fontSize: 13,
            backgroundColor: backgroundFocus
                ? theme.tableRowBackgroundHover
                : theme.tableBackground,
        }, collapsed: true, onMouseEnter: () => onHover && onHover(account.id), onMouseLeave: () => onHover && onHover(null), children: [_jsx(Cell, { name: "accountName", width: 250, plain: true, style: { color: theme.tableText, padding: '10px' }, children: potentiallyTruncatedAccountName }), _jsx(Cell, { name: "bankName", width: "flex", plain: true, style: { color: theme.tableText, padding: '10px' }, children: account.bankName }), account.account_sync_source ? (_jsx(Tooltip, { placement: "bottom start", content: lastSyncDateTime, style: {
                    ...styles.tooltip,
                }, children: _jsx(Cell, { name: "lastSync", width: 200, plain: true, style: {
                        color: theme.tableText,
                        padding: '11px',
                        textDecoration: 'underline',
                        textDecorationStyle: 'dashed',
                        textDecorationColor: theme.pageTextSubdued,
                        textUnderlineOffset: '4px',
                    }, children: lastSyncString }) })) : (''), account.account_sync_source ? (_jsx(Cell, { name: "edit", plain: true, style: { paddingRight: '10px' }, children: _jsx(Button, { onPress: () => onAction(account, 'edit'), children: _jsx(Trans, { children: "Edit" }) }) })) : (_jsx(Cell, { name: "link", plain: true, style: { paddingRight: '10px' }, children: _jsx(Button, { onPress: () => onAction(account, 'link'), children: _jsx(Trans, { children: "Link account" }) }) }))] }));
});
AccountRow.displayName = 'AccountRow';
