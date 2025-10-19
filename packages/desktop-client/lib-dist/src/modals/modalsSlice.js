// @ts-strict
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { resetApp, setAppState } from '@desktop-client/app/appSlice';
import { createAppAsyncThunk } from '@desktop-client/redux';
import { signOut } from '@desktop-client/users/usersSlice';
const initialState = {
    activeModal: 'NONE',
    isOpen: false,
};
// ---------------------------------------------------------
// Async actions
// ---------------------------------------------------------
// Example async modal handler (if needed for side effects)
export const openSelectLinkedAccountsModal = createAppAsyncThunk('modals/openSelectLinkedAccountsModal', async (props, { dispatch }) => {
    dispatch(modalsSlice.actions.openModal({
        modal: 'SELECT_LINKED_ACCOUNTS',
        props,
    }));
});
export const closeModalAndResetApp = createAsyncThunk('modals/closeAndReset', async (_, { dispatch }) => {
    dispatch(modalsSlice.actions.closeModal());
    await dispatch(resetApp());
});
export const closeModalAndSignOut = createAsyncThunk('modals/closeAndSignOut', async (_, { dispatch }) => {
    dispatch(modalsSlice.actions.closeModal());
    await dispatch(signOut());
});
// ---------------------------------------------------------
// Slice
// ---------------------------------------------------------
export const modalsSlice = createSlice({
    name: 'modals',
    initialState,
    reducers: {
        openModal: (state, action) => {
            state.activeModal = action.payload.modal;
            state.modalProps = action.payload.props;
            state.isOpen = true;
        },
        closeModal: state => {
            state.activeModal = 'NONE';
            state.modalProps = undefined;
            state.isOpen = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(resetApp.fulfilled, state => {
            state.activeModal = 'NONE';
            state.isOpen = false;
        })
            .addCase(setAppState, (state, action) => {
            // Example: respond to app state changes
            if (action.payload && 'error' in action.payload) {
                state.activeModal = 'ERROR';
                state.modalProps = { message: action.payload.error };
                state.isOpen = true;
            }
        });
    },
});
// ---------------------------------------------------------
// Exports
// ---------------------------------------------------------
export const { openModal, closeModal } = modalsSlice.actions;
export const selectModalState = (state) => state.modals;
export const selectActiveModal = (state) => state.modals.activeModal;
export const selectIsModalOpen = (state) => state.modals.isOpen;
export const selectModalProps = (state) => state.modals.modalProps;
export default modalsSlice.reducer;
