export const getCustomTick = (value, isPrivacyModeEnabled) => {
    if (isPrivacyModeEnabled) {
        return '...';
    }
    else {
        return value;
    }
};
