import { createSlice } from '@reduxjs/toolkit';
import { t } from 'i18next';
import { v4 as uuidv4 } from 'uuid';
import { resetApp } from '@desktop-client/app/appSlice';
const sliceName = 'notifications';
const initialState = {
    notifications: [],
    inset: {},
};
const notificationsSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        addNotification(state, action) {
            const notification = {
                ...action.payload.notification,
                id: action.payload.notification.id || uuidv4(),
            };
            if (state.notifications.find(n => n.id === notification.id)) {
                return;
            }
            state.notifications = [...state.notifications, notification];
        },
        addGenericErrorNotification(state) {
            const notification = {
                id: uuidv4(),
                type: 'error',
                message: t('Something internally went wrong. You may want to restart the app if anything looks wrong. ' +
                    'Please report this as a new issue on GitHub.'),
            };
            state.notifications = [...state.notifications, notification];
        },
        removeNotification(state, action) {
            state.notifications = state.notifications.filter(notif => notif.id !== action.payload.id);
        },
        setNotificationInset(state, action) {
            state.inset = action.payload?.inset ? action.payload.inset : {};
        },
    },
    extraReducers: builder => {
        builder.addCase(resetApp, () => initialState);
    },
});
export const { name, reducer, getInitialState } = notificationsSlice;
export const actions = {
    ...notificationsSlice.actions,
};
export const { addGenericErrorNotification, addNotification, removeNotification, setNotificationInset, } = actions;
