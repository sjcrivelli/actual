import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Block } from '@actual-app/components/block';
import { Button } from '@actual-app/components/button';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { send, listen } from 'loot-core/platform/client/fetch';
import { loadBackup, makeBackup, } from '@desktop-client/budgetfiles/budgetfilesSlice';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { Row, Cell } from '@desktop-client/components/table';
import { useMetadataPref } from '@desktop-client/hooks/useMetadataPref';
import { useDispatch } from '@desktop-client/redux';
function BackupTable({ backups, onSelect }) {
    const { t } = useTranslation();
    return (_jsx(View, { style: { flex: 1, maxHeight: 200, overflow: 'auto' }, children: backups.map((backup, idx) => (_jsx(Row, { collapsed: idx !== 0, onClick: () => onSelect(backup.id), style: { cursor: 'pointer' }, children: _jsx(Cell, { width: "flex", value: backup.date ? backup.date : t('Revert to Latest'), valueStyle: { paddingLeft: 20 } }) }, backup.id))) }));
}
export function LoadBackupModal({ budgetId, watchUpdates, backupDisabled, }) {
    const dispatch = useDispatch();
    const [backups, setBackups] = useState([]);
    const [prefsBudgetId] = useMetadataPref('id');
    const budgetIdToLoad = budgetId ?? prefsBudgetId;
    useEffect(() => {
        if (budgetIdToLoad) {
            send('backups-get', { id: budgetIdToLoad }).then(setBackups);
        }
    }, [budgetIdToLoad]);
    useEffect(() => {
        if (watchUpdates) {
            return listen('backups-updated', setBackups);
        }
    }, [watchUpdates]);
    const latestBackup = backups.find(backup => 'isLatest' in backup ? backup.isLatest : false);
    const previousBackups = backups.filter(backup => !('isLatest' in backup ? backup.isLatest : false));
    const { t } = useTranslation();
    return (_jsx(Modal, { name: "load-backup", containerProps: { style: { maxWidth: '30vw' } }, children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Load Backup'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { style: { marginBottom: 30 }, children: [_jsx(View, { style: {
                                margin: 20,
                                marginTop: 0,
                                marginBottom: 15,
                                lineHeight: 1.5,
                            }, children: latestBackup ? (_jsxs(Block, { children: [_jsxs(Block, { style: { marginBottom: 10 }, children: [_jsx(Text, { style: { fontWeight: 600 }, children: _jsx(Trans, { children: "You are currently working from a backup." }) }), ' ', _jsx(Trans, { children: "You can load a different backup or revert to the original version below." })] }), _jsx(Button, { variant: "primary", onPress: () => {
                                            if (budgetIdToLoad && latestBackup.id) {
                                                dispatch(loadBackup({
                                                    budgetId: budgetIdToLoad,
                                                    backupId: latestBackup.id,
                                                }));
                                            }
                                        }, children: _jsx(Trans, { children: "Revert to original version" }) })] })) : (_jsxs(View, { style: { alignItems: 'flex-start' }, children: [_jsxs(Block, { style: { marginBottom: 10 }, children: [_jsx(Trans, { children: "Select a backup to load. After loading a backup, you will have a chance to revert to the current version in this screen." }), ' ', _jsx(Text, { style: { fontWeight: 600 }, children: _jsx(Trans, { children: "If you use a backup, you will have to set up all your devices to sync from the new budget." }) })] }), _jsx(Button, { variant: "primary", isDisabled: backupDisabled, onPress: () => dispatch(makeBackup()), children: _jsx(Trans, { children: "Back up now" }) })] })) }), previousBackups.length === 0 ? (_jsx(Block, { style: { color: theme.tableTextLight, marginLeft: 20 }, children: _jsx(Trans, { children: "No backups available" }) })) : (_jsx(BackupTable, { backups: previousBackups, onSelect: id => {
                                if (budgetIdToLoad && id) {
                                    dispatch(loadBackup({ budgetId: budgetIdToLoad, backupId: id }));
                                }
                            } }))] })] })) }));
}
