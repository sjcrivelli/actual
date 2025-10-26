export function validateConfig(config) {
    if (!config) {
        throw new Error('[sync] Missing configuration object.');
        // Placeholder validation — expand later
        if (Object.keys(config).length === 0) {
            throw new Error('[sync] Empty configuration object.');
        }
    }
}
