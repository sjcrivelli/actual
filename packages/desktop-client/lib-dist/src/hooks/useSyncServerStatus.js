import { useServerURL } from '@desktop-client/components/ServerContext';
import { useSelector } from '@desktop-client/redux';
export function useSyncServerStatus() {
    const serverUrl = useServerURL();
    const userData = useSelector(state => state.user.data);
    if (!serverUrl) {
        return 'no-server';
    }
    return !userData || userData?.offline ? 'offline' : 'online';
}
