import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { addNotification, } from '@desktop-client/notifications/notificationsSlice';
import { useDispatch } from '@desktop-client/redux';
import { redo, undo } from '@desktop-client/undo';
const timeout = 10000;
export function useUndo() {
    const dispatch = useDispatch();
    const { isNarrowWidth } = useResponsive();
    const { t } = useTranslation();
    const showUndoNotification = useCallback((notification) => {
        if (!isNarrowWidth) {
            return;
        }
        dispatch(addNotification({
            notification: {
                type: 'message',
                timeout,
                button: {
                    title: t('Undo'),
                    action: undo,
                },
                ...notification,
            },
        }));
    }, [dispatch, isNarrowWidth, t]);
    const showRedoNotification = useCallback((notification) => {
        if (!isNarrowWidth) {
            return;
        }
        dispatch(addNotification({
            notification: {
                type: 'message',
                timeout,
                button: {
                    title: t('Redo'),
                    action: redo,
                },
                ...notification,
            },
        }));
    }, [dispatch, isNarrowWidth, t]);
    return {
        undo,
        redo,
        showUndoNotification,
        showRedoNotification,
    };
}
