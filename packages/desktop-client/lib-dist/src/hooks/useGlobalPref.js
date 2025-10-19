import { useCallback } from 'react';
import { saveGlobalPrefs } from '@desktop-client/prefs/prefsSlice';
import { useSelector, useDispatch } from '@desktop-client/redux';
export function useGlobalPref(prefName, onSaveGlobalPrefs) {
    const dispatch = useDispatch();
    const setGlobalPref = useCallback(value => {
        dispatch(saveGlobalPrefs({
            prefs: {
                [prefName]: value,
            },
            onSaveGlobalPrefs,
        }));
    }, [prefName, dispatch, onSaveGlobalPrefs]);
    const globalPref = useSelector(state => state.prefs.global?.[prefName]);
    return [globalPref, setGlobalPref];
}
