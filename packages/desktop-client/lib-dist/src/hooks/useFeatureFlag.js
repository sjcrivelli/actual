import { useSyncedPref } from './useSyncedPref';
const DEFAULT_FEATURE_FLAG_STATE = {
    goalTemplatesEnabled: false,
    goalTemplatesUIEnabled: false,
    actionTemplating: false,
    currency: false,
    plugins: false,
};
export function useFeatureFlag(name) {
    const [value] = useSyncedPref(`flags.${name}`);
    return value === undefined
        ? DEFAULT_FEATURE_FLAG_STATE[name] || false
        : String(value) === 'true';
}
