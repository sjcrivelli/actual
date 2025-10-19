import { useCallback } from 'react';
import { saveSyncedPrefs } from '@desktop-client/prefs/prefsSlice';
import { useSelector, useDispatch } from '@desktop-client/redux';
/** @deprecated: please use `useSyncedPref` (singular) */
export function useSyncedPrefs() {
    const dispatch = useDispatch();
    const setPrefs = useCallback(newValue => {
        dispatch(saveSyncedPrefs({ prefs: newValue }));
    }, [dispatch]);
    const prefs = useSelector(state => state.prefs.synced);
    return [prefs, setPrefs];
}
