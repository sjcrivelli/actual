import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-strict-ignore
import { useState, useEffect, useCallback, useMemo, } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgLockOpen } from '@actual-app/components/icons/v1';
import { SvgLockClosed } from '@actual-app/components/icons/v2';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { send } from 'loot-core/platform/client/fetch';
import * as undo from 'loot-core/platform/client/undo';
import { UserAccessHeader } from './UserAccessHeader';
import { UserAccessRow } from './UserAccessRow';
import { InfiniteScrollWrapper } from '@desktop-client/components/common/InfiniteScrollWrapper';
import { Link } from '@desktop-client/components/common/Link';
import { Search } from '@desktop-client/components/common/Search';
import { useMetadataPref } from '@desktop-client/hooks/useMetadataPref';
import { pushModal } from '@desktop-client/modals/modalsSlice';
import { addNotification } from '@desktop-client/notifications/notificationsSlice';
import { useDispatch } from '@desktop-client/redux';
function UserAccessContent({ isModal, setLoading, }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [allAccess, setAllAccess] = useState([]);
    const [page, setPage] = useState(0);
    const [filter, setFilter] = useState('');
    const [cloudFileId] = useMetadataPref('cloudFileId');
    const filteredAccesses = useMemo(() => (filter === ''
        ? allAccess
        : allAccess.filter(access => access?.displayName
            .toLowerCase()
            .includes(filter.toLowerCase()) ?? false)).slice(0, 100 + page * 50), [allAccess, filter, page]);
    const [hoveredUserAccess, setHoveredUserAccess] = useState(null);
    const onSearchChange = useCallback((value) => {
        setFilter(value);
        setPage(0);
    }, [setFilter]);
    const loadAccess = useCallback(async () => {
        setLoading(true);
        const data = await send('access-get-available-users', cloudFileId);
        const sortUsers = (a, b) => {
            if ((a.owner ?? 0) !== (b.owner ?? 0)) {
                return (b.owner ?? 0) - (a.owner ?? 0);
            }
            return (a.displayName ?? '').localeCompare(b.displayName ?? '');
        };
        if ('error' in data) {
            dispatch(addNotification({
                notification: {
                    type: 'error',
                    id: 'error',
                    title: t('Error getting available users'),
                    sticky: true,
                    message: data.error,
                },
            }));
            return [];
        }
        const loadedAccess = data
            .map(user => ({
            ...user,
            displayName: user.displayName || user.userName,
        }))
            .sort(sortUsers);
        setAllAccess(loadedAccess);
        return loadedAccess;
    }, [cloudFileId, dispatch, setLoading, t]);
    const loadOwner = useCallback(async () => {
        const file = (await send('get-user-file-info', cloudFileId)) ?? {
            usersWithAccess: [],
        };
        const owner = file?.usersWithAccess.filter(user => user.owner);
        if (owner.length > 0) {
            return owner[0];
        }
        return null;
    }, [cloudFileId]);
    useEffect(() => {
        async function loadData() {
            try {
                await loadAccess();
            }
            catch (error) {
                console.error('Error loading user access data:', error);
            }
            finally {
                setLoading(false);
            }
        }
        loadData();
        return () => {
            undo.setUndoState('openModal', null);
        };
    }, [setLoading, loadAccess, loadOwner]);
    function loadMore() {
        setPage(page => page + 1);
    }
    const onHover = useCallback(id => {
        setHoveredUserAccess(id);
    }, []);
    return (_jsxs(View, { children: [_jsxs(View, { style: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: isModal ? '0 13px 15px' : '0 0 15px',
                    flexShrink: 0,
                }, children: [_jsx(View, { style: {
                            color: theme.pageTextLight,
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: '50%',
                        }, children: _jsxs(Text, { children: [_jsx(Trans, { children: "Determine which users can view and manage your budgets" }), ' ', _jsx(Link, { variant: "external", to: "https://actualbudget.org/docs/config/multi-user#user-access-management", linkColor: "muted", children: _jsx(Trans, { children: "Learn more" }) })] }) }), _jsx(View, { style: { flex: 1 } }), _jsx(Search, { placeholder: t('Filter users...'), value: filter, onChange: onSearchChange })] }), _jsxs(View, { style: { flex: 1 }, children: [_jsx(UserAccessHeader, {}), _jsx(InfiniteScrollWrapper, { loadMore: loadMore, children: _jsx(UserAccessList, { accesses: filteredAccesses, hoveredAccess: hoveredUserAccess, onHover: onHover }) })] }), _jsx(View, { style: {
                    paddingBlock: 15,
                    paddingInline: isModal ? 13 : 0,
                    borderTop: isModal && '1px solid ' + theme.pillBorder,
                    flexShrink: 0,
                } }), _jsx(View, { style: { flexDirection: 'row', justifyContent: 'flex-end' }, children: _jsx(LockToggle, { style: { width: 16, height: 16 }, onToggleSave: async () => {
                        await loadAccess();
                        setLoading(false);
                    } }) })] }));
}
export function UserAccess({ isModal, setLoading = () => { }, }) {
    return _jsx(UserAccessContent, { isModal: isModal, setLoading: setLoading });
}
function UserAccessList({ accesses, hoveredAccess, onHover, }) {
    if (accesses.length === 0) {
        return null;
    }
    return (_jsx(View, { children: accesses.map(access => {
            const hovered = hoveredAccess === access.userId;
            return (_jsx(UserAccessRow, { access: access, hovered: hovered, onHover: onHover }, access.userId));
        }) }));
}
function LockToggle({ style, onToggleSave }) {
    const [hover, setHover] = useState(false);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    return (_jsxs(Button, { onHoverStart: () => setHover(true), onHoverEnd: () => setHover(false), variant: "primary", "aria-label": t('Menu'), onPress: () => dispatch(pushModal({
            modal: {
                name: 'transfer-ownership',
                options: {
                    onSave: () => onToggleSave(),
                },
            },
        })), children: [hover && _jsx(SvgLockOpen, { style: { ...style, marginRight: 5 } }), !hover && _jsx(SvgLockClosed, { style: { ...style, marginRight: 5 } }), ' ', _jsx(Trans, { children: "Transfer ownership" })] }));
}
