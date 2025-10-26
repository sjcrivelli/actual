import * as fs from '../platform/server/fs';
import { logger } from '../platform/server/log';
let config = null;
function joinURL(base, ...paths) {
    const url = new URL(base);
    url.pathname = fs.join(url.pathname, ...paths);
    return url.toString();
}
export function isValidBaseURL(base) {
    try {
        return Boolean(new URL(base));
    }
    catch (error) {
        return false;
    }
}
export function setServer(url) {
    if (url == null) {
        config = null;
    }
    else {
        config = getServer(url);
    }
}
// `url` is optional; if not given it will provide the global config
export function getServer(url) {
    if (url) {
        try {
            return {
                BASE_SERVER: url,
                SYNC_SERVER: joinURL(url, '/sync'),
                SIGNUP_SERVER: joinURL(url, '/account'),
                GOCARDLESS_SERVER: joinURL(url, '/gocardless'),
                SIMPLEFIN_SERVER: joinURL(url, '/simplefin'),
                PLUGGYAI_SERVER: joinURL(url, '/pluggyai'),
            };
        }
        catch (error) {
            logger.warn('Unable to parse server URL - using the global config.', { config }, error);
            return config;
        }
    }
    return config;
}
