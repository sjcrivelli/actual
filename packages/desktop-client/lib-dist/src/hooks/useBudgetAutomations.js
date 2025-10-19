import { useEffect, useState } from 'react';
import { send } from 'loot-core/platform/client/fetch';
export function useBudgetAutomations({ categoryId, onLoaded, }) {
    const [automations, setAutomations] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let mounted = true;
        async function fetchAutomations() {
            setLoading(true);
            // Always import notes first; the query will automatically ignore UI-based categories.
            await send('budget/store-note-templates');
            const result = await send('budget/get-category-automations', categoryId);
            if (mounted) {
                setAutomations(result);
                onLoaded(result);
                setLoading(false);
            }
        }
        fetchAutomations();
        return () => {
            mounted = false;
        };
    }, [categoryId, onLoaded]);
    return { automations, loading };
}
