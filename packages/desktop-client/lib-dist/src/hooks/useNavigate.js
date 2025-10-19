import { useCallback } from 'react';
import { useLocation, 
// eslint-disable-next-line no-restricted-imports
useNavigate as useNavigateReactRouter, } from 'react-router';
export function useNavigate() {
    const location = useLocation();
    const navigate = useNavigateReactRouter();
    return useCallback((to, options = {}) => {
        if (typeof to === 'number') {
            navigate(to);
        }
        else {
            const optionsWithPrevLocation = {
                replace: options.replace || isSamePath(to, location) ? true : undefined,
                ...options,
                state: {
                    ...options?.state,
                    previousLocation: location,
                },
            };
            const { previousLocation, ...previousOriginalState } = location.state || {};
            if (previousLocation == null ||
                !isSamePath(to, previousLocation) ||
                JSON.stringify(options?.state || {}) !==
                    JSON.stringify(previousOriginalState)) {
                navigate(to, optionsWithPrevLocation);
            }
            else {
                // `to` is the same as the previous location. Just go back.
                navigate(-1);
            }
        }
    }, [navigate, location]);
}
function isSamePath(to, location) {
    return to === location.pathname + location.search + location.hash;
}
