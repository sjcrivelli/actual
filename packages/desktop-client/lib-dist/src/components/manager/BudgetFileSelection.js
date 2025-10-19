import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback, } from 'react';
import { GridList, GridListItem } from 'react-aria-components';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { AnimatedLoading } from '@actual-app/components/icons/AnimatedLoading';
import { SvgCloudCheck, SvgCloudDownload, SvgCog, SvgDotsHorizontalTriple, SvgFileDouble, SvgUser, SvgUserGroup, } from '@actual-app/components/icons/v1';
import { SvgCloudUnknown, SvgKey, SvgRefreshArrow, } from '@actual-app/components/icons/v2';
import { Menu } from '@actual-app/components/menu';
import { Popover } from '@actual-app/components/popover';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { tokens } from '@actual-app/components/tokens';
import { Tooltip } from '@actual-app/components/tooltip';
import { View } from '@actual-app/components/view';
import { css } from '@emotion/css';
import { isElectron, isNonProductionEnvironment, } from 'loot-core/shared/environment';
import { closeAndDownloadBudget, closeAndLoadBudget, createBudget, downloadBudget, loadAllFiles, loadBudget, } from '@desktop-client/budgetfiles/budgetfilesSlice';
import { useMultiuserEnabled } from '@desktop-client/components/ServerContext';
import { useInitialMount } from '@desktop-client/hooks/useInitialMount';
import { useMetadataPref } from '@desktop-client/hooks/useMetadataPref';
import { useSyncServerStatus } from '@desktop-client/hooks/useSyncServerStatus';
import { pushModal } from '@desktop-client/modals/modalsSlice';
import { useSelector, useDispatch } from '@desktop-client/redux';
import { getUserData } from '@desktop-client/users/usersSlice';
function getFileDescription(file, t) {
    if (file.state === 'unknown') {
        return t('This is a cloud-based file but its state is unknown because you ' +
            'are offline.');
    }
    if (file.encryptKeyId) {
        if (file.hasKey) {
            return t('This file is encrypted and you have key to access it.');
        }
        return t('This file is encrypted and you do not have the key for it.');
    }
    return null;
}
function isLocalFile(file) {
    return file.state === 'local';
}
function BudgetFileMenu({ onDelete, onClose, onDuplicate, }) {
    function onMenuSelect(type) {
        onClose();
        switch (type) {
            case 'delete':
                onDelete();
                break;
            case 'duplicate':
                if (onDuplicate)
                    onDuplicate();
                break;
            default:
        }
    }
    const { t } = useTranslation();
    const items = [
        ...(onDuplicate ? [{ name: 'duplicate', text: t('Duplicate') }] : []),
        { name: 'delete', text: t('Delete') },
    ];
    return _jsx(Menu, { onMenuSelect: onMenuSelect, items: items });
}
function BudgetFileMenuButton({ onDelete, onDuplicate, }) {
    const { t } = useTranslation();
    const triggerRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    return (_jsxs(View, { children: [_jsx(Button, { ref: triggerRef, variant: "bare", "aria-label": t('Menu'), onPress: () => {
                    setMenuOpen(true);
                }, children: _jsx(SvgDotsHorizontalTriple, { style: { width: 16, height: 16 } }) }), _jsx(Popover, { triggerRef: triggerRef, isOpen: menuOpen, onOpenChange: () => setMenuOpen(false), children: _jsx(BudgetFileMenu, { onDelete: onDelete, onClose: () => setMenuOpen(false), onDuplicate: onDuplicate }) })] }));
}
function BudgetFileState({ file, currentUserId }) {
    const { t } = useTranslation();
    const multiuserEnabled = useMultiuserEnabled();
    let Icon;
    let status;
    let color;
    let ownerName = null;
    const getOwnerDisplayName = useCallback(() => {
        if ('usersWithAccess' in file) {
            const userFound = file.usersWithAccess?.find(f => f.owner);
            if (userFound?.userName === '') {
                return 'Server';
            }
            return userFound?.displayName ?? userFound?.userName ?? t('Unassigned');
        }
        return t('Unknown');
    }, [file, t]);
    switch (file.state) {
        case 'unknown':
            Icon = SvgCloudUnknown;
            status = t('Network unavailable');
            color = theme.buttonNormalDisabledText;
            ownerName = t('Unknown');
            break;
        case 'remote':
            Icon = SvgCloudDownload;
            status = t('Available for download');
            ownerName = getOwnerDisplayName();
            break;
        case 'local':
            Icon = SvgFileDouble;
            status = t('Local');
            ownerName = t('You');
            break;
        case 'broken':
            ownerName = 'unknown';
            Icon = SvgFileDouble;
            status = t('Local');
            ownerName = t('You');
            break;
        default:
            Icon = SvgCloudCheck;
            status = t('Syncing');
            ownerName = getOwnerDisplayName();
            break;
    }
    const showOwnerContent = multiuserEnabled && file.owner !== currentUserId;
    return (_jsxs(View, { style: { width: '100%' }, children: [_jsxs(View, { style: {
                    color,
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginTop: 8,
                }, children: [_jsx(Icon, { style: {
                            width: 18,
                            height: 18,
                            color: 'currentColor',
                        } }), _jsx(Text, { style: { marginLeft: 5 }, children: status })] }), _jsx(View, { style: { paddingTop: 10, flexDirection: 'row', width: '100%' }, children: showOwnerContent && (_jsxs(View, { style: { flexDirection: 'row' }, children: [_jsx(Text, { style: {
                                ...styles.altMenuHeaderText,
                                ...styles.verySmallText,
                                color: theme.pageTextLight,
                            }, children: _jsx(Trans, { children: "Owner:" }) }), _jsx(Text, { style: {
                                ...styles.verySmallText,
                                color: theme.pageTextLight,
                                paddingLeft: 10,
                            }, children: ownerName })] })) })] }));
}
function BudgetFileListItem({ quickSwitchMode, onSelect, onDelete, onDuplicate, currentUserId, ...props }) {
    const { t } = useTranslation();
    const multiuserEnabled = useMultiuserEnabled();
    const selecting = useRef(false);
    async function _onSelect(file) {
        // Never allow selecting the file while uploading/downloading, and
        // make sure to never allow duplicate clicks
        if (!selecting.current) {
            selecting.current = true;
            await onSelect(file);
            selecting.current = false;
        }
    }
    const { value: file } = props;
    if (!file) {
        return null;
    }
    return (_jsx(GridListItem, { textValue: file.name, onAction: () => _onSelect(file), ...props, children: _jsxs(View, { className: css({
                ...styles.shadow,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: '5px 10px',
                padding: 15,
                cursor: 'pointer',
                borderRadius: 6,
                backgroundColor: theme.buttonNormalBackground,
                '&:hover': {
                    backgroundColor: theme.buttonNormalBackgroundHover,
                },
            }), children: [_jsxs(View, { title: getFileDescription(file, t) || '', style: { alignItems: 'flex-start', width: '100%' }, children: [_jsxs(View, { style: { flexDirection: 'row', width: '100%' }, children: [_jsx(Text, { style: { fontSize: 16, fontWeight: 700 }, children: file.name }), multiuserEnabled && 'cloudFileId' in file && (_jsx(UserAccessForFile, { fileId: file.cloudFileId, currentUserId: currentUserId }))] }), _jsx(BudgetFileState, { file: file, currentUserId: currentUserId })] }), _jsxs(View, { style: {
                        flex: '0 0 auto',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }, children: [file.encryptKeyId && (_jsx(SvgKey, { style: {
                                width: 13,
                                height: 13,
                                marginRight: 8,
                                color: file.hasKey
                                    ? theme.formLabelText
                                    : theme.buttonNormalDisabledText,
                            } })), !quickSwitchMode && (_jsx(BudgetFileMenuButton, { onDelete: () => onDelete(file), onDuplicate: 'id' in file ? () => onDuplicate(file) : undefined }))] })] }) }));
}
function BudgetFileList({ files, quickSwitchMode, onSelect, onDelete, onDuplicate, currentUserId, }) {
    const { t } = useTranslation();
    return (_jsx(GridList, { "aria-label": t('Budget files'), items: files, style: {
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
        }, renderEmptyState: () => (_jsx(Text, { style: {
                ...styles.mediumText,
                textAlign: 'center',
                color: theme.pageTextSubdued,
            }, children: _jsx(Trans, { children: "No budget files" }) })), children: file => {
            const id = isLocalFile(file) ? file.id : file.cloudFileId;
            return (_jsx(BudgetFileListItem, { id: id, value: file, currentUserId: currentUserId, quickSwitchMode: quickSwitchMode, onSelect: onSelect, onDelete: onDelete, onDuplicate: onDuplicate }, id));
        } }));
}
function RefreshButton({ style, onRefresh }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    async function _onRefresh() {
        setLoading(true);
        await onRefresh();
        setLoading(false);
    }
    const Icon = loading ? AnimatedLoading : SvgRefreshArrow;
    return (_jsx(Button, { variant: "bare", "aria-label": t('Refresh'), style: { padding: 10, ...style }, onPress: _onRefresh, children: _jsx(Icon, { style: { width: 18, height: 18 } }) }));
}
function SettingsButton({ onOpenSettings }) {
    const { t } = useTranslation();
    return (_jsx(View, { children: _jsx(Button, { variant: "bare", "aria-label": t('Settings'), onPress: () => {
                onOpenSettings();
            }, style: { padding: 10 }, children: _jsx(SvgCog, { style: { width: 18, height: 18 } }) }) }));
}
function BudgetFileSelectionHeader({ quickSwitchMode, onRefresh, onOpenSettings, }) {
    return (_jsxs(View, { style: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 20,
        }, children: [_jsx(Text, { style: {
                    ...styles.veryLargeText,
                }, children: _jsx(Trans, { children: "Files" }) }), !quickSwitchMode && (_jsxs(View, { style: {
                    flexDirection: 'row',
                    gap: '0.2rem',
                }, children: [onRefresh && _jsx(RefreshButton, { onRefresh: onRefresh }), isElectron() && _jsx(SettingsButton, { onOpenSettings: onOpenSettings })] }))] }));
}
export function BudgetFileSelection({ showHeader = true, quickSwitchMode = false, }) {
    const dispatch = useDispatch();
    const allFiles = useSelector(state => state.budgetfiles.allFiles || []);
    const multiuserEnabled = useMultiuserEnabled();
    const [id] = useMetadataPref('id');
    const [currentUserId, setCurrentUserId] = useState('');
    const userData = useSelector(state => state.user.data);
    const serverStatus = useSyncServerStatus();
    const fetchUsers = useCallback(async () => {
        try {
            setCurrentUserId(userData?.userId ?? '');
        }
        catch (error) {
            console.error('Failed to fetch users:', error);
        }
    }, [userData?.userId]);
    useEffect(() => {
        if (multiuserEnabled && !userData?.offline) {
            fetchUsers();
        }
    }, [multiuserEnabled, userData?.offline, fetchUsers]);
    // Remote files do not have the 'id' field
    function isNonRemoteFile(file) {
        return file.state !== 'remote';
    }
    // Filter out the open file
    const files = id
        ? allFiles.filter(file => !isNonRemoteFile(file) || file.id !== id)
        : allFiles;
    const [creating, setCreating] = useState(false);
    const { isNarrowWidth } = useResponsive();
    const narrowButtonStyle = isNarrowWidth
        ? {
            height: styles.mobileMinHeight,
        }
        : {};
    const onCreate = ({ testMode = false } = {}) => {
        if (!creating) {
            setCreating(true);
            dispatch(createBudget({ testMode }));
        }
    };
    const refresh = () => {
        dispatch(getUserData());
        dispatch(loadAllFiles());
    };
    const initialMount = useInitialMount();
    if (initialMount && quickSwitchMode) {
        refresh();
    }
    const onSelect = async (file) => {
        const isRemoteFile = file.state === 'remote';
        if (!id) {
            if (isRemoteFile) {
                await dispatch(downloadBudget({ cloudFileId: file.cloudFileId }));
            }
            else {
                await dispatch(loadBudget({ id: file.id }));
            }
        }
        else if (!isRemoteFile && file.id !== id) {
            await dispatch(closeAndLoadBudget({ fileId: file.id }));
        }
        else if (isRemoteFile) {
            await dispatch(closeAndDownloadBudget({ cloudFileId: file.cloudFileId }));
        }
    };
    return (_jsxs(View, { style: {
            maxHeight: '100%',
            flex: 1,
            justifyContent: 'center',
            ...(quickSwitchMode
                ? {
                    marginTop: 20,
                    width: '100vw',
                }
                : { marginBottom: 20 }),
            [`@media (min-width: ${tokens.breakpoint_small})`]: {
                maxWidth: tokens.breakpoint_small,
                width: '100%',
            },
        }, children: [showHeader && (_jsx(BudgetFileSelectionHeader, { quickSwitchMode: quickSwitchMode, onRefresh: serverStatus === 'online' ? refresh : undefined, onOpenSettings: () => dispatch(pushModal({ modal: { name: 'files-settings' } })) })), _jsx(BudgetFileList, { files: files, currentUserId: currentUserId, quickSwitchMode: quickSwitchMode, onSelect: onSelect, onDelete: (file) => dispatch(pushModal({ modal: { name: 'delete-budget', options: { file } } })), onDuplicate: (file) => {
                    if (file && 'id' in file) {
                        dispatch(pushModal({
                            modal: {
                                name: 'duplicate-budget',
                                options: { file, managePage: true },
                            },
                        }));
                    }
                    else {
                        console.error('Attempted to duplicate a cloud file - only local files are supported. Cloud file:', file);
                    }
                } }), !quickSwitchMode && (_jsxs(View, { style: {
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'stretch',
                    margin: 10,
                    minHeight: 39,
                }, children: [_jsx(Button, { variant: "bare", style: {
                            ...narrowButtonStyle,
                            marginLeft: 10,
                            color: theme.pageTextLight,
                        }, onPress: () => {
                            dispatch(pushModal({ modal: { name: 'import' } }));
                        }, children: _jsx(Trans, { children: "Import file" }) }), _jsx(Button, { variant: "primary", onPress: () => onCreate(), style: {
                            ...narrowButtonStyle,
                            marginLeft: 10,
                        }, children: _jsx(Trans, { children: "Create new file" }) }), isNonProductionEnvironment() && (_jsx(Button, { variant: "primary", onPress: () => onCreate({ testMode: true }), style: {
                            ...narrowButtonStyle,
                            marginLeft: 10,
                        }, children: _jsx(Trans, { children: "Create test file" }) }))] }))] }));
}
function UserAccessForFile({ fileId, currentUserId }) {
    const { t } = useTranslation();
    const allFiles = useSelector(state => state.budgetfiles.allFiles || []);
    const remoteFiles = allFiles.filter(f => f.state === 'remote' || f.state === 'synced' || f.state === 'detached');
    const currentFile = remoteFiles.find(f => f.cloudFileId === fileId);
    const multiuserEnabled = useMultiuserEnabled();
    let usersAccess = currentFile?.usersWithAccess ?? [];
    usersAccess = usersAccess?.filter(user => user.userName !== '') ?? [];
    const sortedUsersAccess = [...usersAccess].sort((a, b) => {
        const textA = a.userId === currentUserId ? t('You') : (a.displayName ?? a.userName);
        const textB = b.userId === currentUserId ? t('You') : (b.displayName ?? b.userName);
        return textA.localeCompare(textB);
    });
    return (_jsx(View, { children: multiuserEnabled &&
            usersAccess.length > 0 &&
            !(sortedUsersAccess.length === 1 && sortedUsersAccess[0].owner) && (_jsx(View, { style: {
                marginLeft: '5px',
                alignSelf: 'center',
            }, children: _jsx(Tooltip, { content: _jsxs(View, { style: {
                        margin: 5,
                    }, children: [_jsx(Text, { style: {
                                ...styles.altMenuHeaderText,
                                ...styles.verySmallText,
                                color: theme.pageTextLight,
                            }, children: "File shared with:" }), _jsx(View, { style: {
                                padding: 0,
                            }, children: sortedUsersAccess.map(user => (_jsxs(View, { style: { flexDirection: 'row' }, children: [_jsx(SvgUser, { style: {
                                            width: 10,
                                            height: 10,
                                            opacity: 0.7,
                                            marginTop: 3,
                                            marginRight: 5,
                                        } }), _jsx(View, { style: {
                                            ...styles.verySmallText,
                                            color: theme.pageTextLight,
                                            margin: 0,
                                            listStylePosition: 'inside',
                                        }, children: user.userId === currentUserId
                                            ? t('You')
                                            : (user.displayName ?? user.userName) })] }, user.userId))) })] }), placement: "bottom end", children: _jsx(SvgUserGroup, { style: {
                        width: 15,
                        height: 15,
                        alignSelf: 'flex-end',
                        opacity: 0.7,
                    } }) }) })) }));
}
