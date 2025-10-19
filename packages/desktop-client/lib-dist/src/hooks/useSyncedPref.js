import { useCallback } from 'react';
import { saveSyncedPrefs } from '@desktop-client/prefs/prefsSlice';
import { useSelector, useDispatch } from '@desktop-client/redux';
export function useSyncedPref(prefName, options) {
    const dispatch = useDispatch();
    const setPref = useCallback(value => {
        dispatch(saveSyncedPrefs({
            prefs: { [prefName]: value },
            isGlobal: options?.isGlobal,
        }));
    }, [prefName, dispatch, options?.isGlobal]);
    const pref = useSelector(state => state.prefs.synced[prefName]);
    return [pref, setPref];
}
