// @ts-strict-ignore
import { useEffect, useState } from 'react';
import { send } from 'loot-core/platform/client/fetch';
export function useSendPlatformRequest(name, args, options) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    useEffect(() => {
        async function run() {
            setIsLoading(true);
            setData(await send(name, args, options));
            setIsLoading(false);
        }
        run();
    }, [name, args, options]);
    return {
        data,
        isLoading,
    };
}
