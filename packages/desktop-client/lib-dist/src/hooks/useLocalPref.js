import { useLocalStorage } from 'usehooks-ts';
import { useMetadataPref } from './useMetadataPref';
/**
 * Local preferences are scoped to a specific budget file.
 */
export function useLocalPref(prefName) {
    const [budgetId] = useMetadataPref('id');
    return useLocalStorage(`${budgetId}-${prefName}`, undefined, {
        deserializer: JSON.parse,
        serializer: JSON.stringify,
    });
}
