import { createSlice } from '@reduxjs/toolkit';
import { send } from '../../../loot-core/src/platform/client/fetch';
import { parseNumberFormat, setNumberFormat } from '../../../loot-core/src/shared/util';
import { resetApp } from '../app/appSlice';
import { setI18NextLanguage } from '../i18n';
import { closeModal } from '../modals/modalsSlice';
import { createAppAsyncThunk } from '../redux';
const sliceName = 'prefs';
const initialState = {
    local: {},
    global: {},
    synced: {},
};
export const loadPrefs = createAppAsyncThunk(`${sliceName}/loadPrefs`, async (_, { dispatch, getState }) => {
    const prefs = await send('load-prefs');
    // Remove any modal state if switching between budgets
    const currentPrefs = getState().prefs.local;
    if (prefs && prefs.id && !currentPrefs) {
        dispatch(closeModal());
    }
    const [globalPrefs, syncedPrefs] = await Promise.all([
        send('load-global-prefs'),
        send('preferences/get'),
    ]);
    dispatch(setPrefs({ local: prefs, global: globalPrefs, synced: syncedPrefs }));
    // Certain loot-core utils depend on state outside of the React tree, update them
    setNumberFormat(parseNumberFormat({
        format: syncedPrefs.numberFormat,
        hideFraction: syncedPrefs.hideFraction,
    }));
    // We need to load translations before the app renders
    setI18NextLanguage(globalPrefs.language ?? '');
    return prefs;
});
export const savePrefs = createAppAsyncThunk(`${sliceName}/savePrefs`, async ({ prefs }, { dispatch }) => {
    await send('save-prefs', prefs);
    dispatch(mergeLocalPrefs(prefs));
});
export const loadGlobalPrefs = createAppAsyncThunk(`${sliceName}/loadGlobalPrefs`, async (_, { dispatch, getState }) => {
    const globalPrefs = await send('load-global-prefs');
    dispatch(setPrefs({
        local: getState().prefs.local,
        global: globalPrefs,
        synced: getState().prefs.synced,
    }));
    return globalPrefs;
});
export const saveGlobalPrefs = createAppAsyncThunk(`${sliceName}/saveGlobalPrefs`, async ({ prefs, onSaveGlobalPrefs }, { dispatch }) => {
    await send('save-global-prefs', prefs);
    dispatch(mergeGlobalPrefs(prefs));
    onSaveGlobalPrefs?.();
});
export const saveSyncedPrefs = createAppAsyncThunk(`${sliceName}/saveSyncedPrefs`, async ({ prefs, isGlobal }, { dispatch }) => {
    await Promise.all(Object.entries(prefs).map(([prefName, value]) => send('preferences/save', {
        id: prefName,
        value,
        isGlobal,
    })));
    dispatch(mergeSyncedPrefs(prefs));
});
const prefsSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        setPrefs(state, action) {
            state.local = action.payload.local;
            state.global = action.payload.global;
            state.synced = action.payload.synced;
        },
        mergeLocalPrefs(state, action) {
            state.local = { ...state.local, ...action.payload };
        },
        mergeGlobalPrefs(state, action) {
            state.global = { ...state.global, ...action.payload };
        },
        mergeSyncedPrefs(state, action) {
            state.synced = { ...state.synced, ...action.payload };
        },
    },
    extraReducers: builder => {
        builder.addCase(resetApp, state => ({
            ...initialState,
            global: state.global || initialState.global,
        }));
    },
});
export const { name, reducer, getInitialState } = prefsSlice;
export const actions = {
    ...prefsSlice.actions,
    loadPrefs,
    savePrefs,
    loadGlobalPrefs,
    saveGlobalPrefs,
    saveSyncedPrefs,
};
export const { mergeGlobalPrefs, mergeLocalPrefs, mergeSyncedPrefs, setPrefs } = actions;
