import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Block } from '@actual-app/components/block';
import { AnimatedLoading } from '@actual-app/components/icons/AnimatedLoading';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import promiseRetry from 'promise-retry';
import { LazyLoadFailedError } from 'loot-core/shared/errors';
export function LoadComponent(props) {
    // need to set `key` so the component is reloaded when the name changes
    // otherwise the old component will be rendered while the new one is being loaded
    return _jsx(LoadComponentInner, { ...props }, props.name);
}
function LoadComponentInner({ name, message, importer, }) {
    const [Component, setComponent] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        let isUnmounted = false;
        setError(null);
        setComponent(null);
        // Load the module; if it fails - retry with exponential backoff
        promiseRetry(retry => importer()
            .then(module => {
            // Handle possibly being unmounted while retrying.
            if (!isUnmounted) {
                setComponent(() => module[name]);
            }
        })
            .catch(retry), {
            retries: 5,
        }).catch(e => {
            if (!isUnmounted) {
                setError(e);
            }
        });
        return () => {
            isUnmounted = true;
        };
    }, [name, importer]);
    if (error) {
        throw new LazyLoadFailedError(name, error);
    }
    if (!Component) {
        return (_jsxs(View, { style: {
                flex: 1,
                gap: 20,
                justifyContent: 'center',
                alignItems: 'center',
                ...styles.delayedFadeIn,
            }, children: [message && (_jsx(Block, { style: { marginBottom: 20, fontSize: 18 }, children: message })), _jsx(AnimatedLoading, { width: 25, color: theme.pageTextDark })] }));
    }
    return _jsx(Component, {});
}
