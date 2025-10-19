import { useCallback } from 'react';
import { savePrefs } from '@desktop-client/prefs/prefsSlice';
import { useSelector, useDispatch } from '@desktop-client/redux';
export function useMetadataPref(prefName) {
    const dispatch = useDispatch();
    const setLocalPref = useCallback(value => {
        dispatch(savePrefs({ prefs: { [prefName]: value } }));
    }, [prefName, dispatch]);
    const localPref = useSelector(state => state.prefs.local?.[prefName]);
    return [localPref, setLocalPref];
}
