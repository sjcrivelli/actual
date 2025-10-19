import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
export function SyncRefresh({ onSync, children }) {
    const [syncing, setSyncing] = useState(false);
    async function onSync_() {
        setSyncing(true);
        await onSync();
        setSyncing(false);
    }
    return _jsx(_Fragment, { children: children({ refreshing: syncing, onRefresh: onSync_ }) });
}
