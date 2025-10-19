import { useCallback } from 'react';
import { popModal } from '@desktop-client/modals/modalsSlice';
import { useSelector, useDispatch } from '@desktop-client/redux';
export function useModalState() {
    const modalStack = useSelector(state => state.modals.modalStack);
    const isHidden = useSelector(state => state.modals.isHidden);
    const dispatch = useDispatch();
    const popModalCallback = useCallback(() => {
        dispatch(popModal());
    }, [dispatch]);
    const lastModal = modalStack[modalStack.length - 1];
    const isActive = useCallback((name) => {
        if (!lastModal || name === lastModal.name) {
            return true;
        }
        return false;
    }, [lastModal]);
    return {
        onClose: popModalCallback,
        modalStack,
        activeModal: lastModal?.name,
        isActive,
        isHidden,
    };
}
