// @ts-strict-ignore
import * as asyncStorage from '../../platform/server/asyncStorage';
import { createApp } from '../app';
import { del, get, patch, post } from '../post';
import { getServer } from '../server-config';
// Expose functions to the client
export const app = createApp();
app.method('users-get', getUsers);
app.method('user-delete-all', deleteAllUsers);
app.method('user-add', addUser);
app.method('user-update', updateUser);
app.method('access-add', addAccess);
app.method('access-delete-all', deleteAllAccess);
app.method('access-get-available-users', accessGetAvailableUsers);
app.method('transfer-ownership', transferOwnership);
app.method('owner-created', ownerCreated);
async function getUsers() {
    const userToken = await asyncStorage.getItem('user-token');
    if (userToken) {
        const res = await get(getServer().BASE_SERVER + '/admin/users/', {
            headers: {
                'X-ACTUAL-TOKEN': userToken,
            },
        });
        if (res) {
            try {
                const list = JSON.parse(res);
                return list;
            }
            catch (err) {
                return { error: 'Failed to parse response: ' + err.message };
            }
        }
    }
    return null;
}
async function deleteAllUsers(ids) {
    const userToken = await asyncStorage.getItem('user-token');
    if (userToken) {
        try {
            const res = await del(getServer().BASE_SERVER + '/admin/users', {
                ids,
            }, {
                'X-ACTUAL-TOKEN': userToken,
            });
            if (res) {
                return res;
            }
        }
        catch (err) {
            return { error: err.reason };
        }
    }
    return { someDeletionsFailed: true };
}
async function addUser(user) {
    const userToken = await asyncStorage.getItem('user-token');
    if (userToken) {
        try {
            const res = await post(getServer().BASE_SERVER + '/admin/users/', user, {
                'X-ACTUAL-TOKEN': userToken,
            });
            return res;
        }
        catch (err) {
            return { error: err.reason };
        }
    }
    return null;
}
async function updateUser(user) {
    const userToken = await asyncStorage.getItem('user-token');
    if (userToken) {
        try {
            const res = await patch(getServer().BASE_SERVER + '/admin/users/', user, {
                'X-ACTUAL-TOKEN': userToken,
            });
            return res;
        }
        catch (err) {
            return { error: err.reason };
        }
    }
    return null;
}
async function addAccess(access) {
    const userToken = await asyncStorage.getItem('user-token');
    if (userToken) {
        try {
            await post(getServer().BASE_SERVER + '/admin/access/', access, {
                'X-ACTUAL-TOKEN': userToken,
            });
            return {};
        }
        catch (err) {
            return { error: err.reason };
        }
    }
    return null;
}
async function deleteAllAccess({ fileId, ids, }) {
    const userToken = await asyncStorage.getItem('user-token');
    if (userToken) {
        try {
            const res = await del(getServer().BASE_SERVER + `/admin/access?fileId=${fileId}`, {
                token: userToken,
                ids,
            });
            if (res) {
                return res;
            }
        }
        catch (err) {
            return { error: err.reason };
        }
    }
    return { someDeletionsFailed: true };
}
async function accessGetAvailableUsers(fileId) {
    const userToken = await asyncStorage.getItem('user-token');
    if (userToken) {
        const res = await get(`${getServer().BASE_SERVER + '/admin/access/users'}?fileId=${fileId}`, {
            headers: {
                'X-ACTUAL-TOKEN': userToken,
            },
        });
        if (res) {
            try {
                return JSON.parse(res);
            }
            catch (err) {
                return { error: 'Failed to parse response: ' + err.message };
            }
        }
    }
    return [];
}
async function transferOwnership({ fileId, newUserId, }) {
    const userToken = await asyncStorage.getItem('user-token');
    if (userToken) {
        try {
            await post(getServer().BASE_SERVER + '/admin/access/transfer-ownership/', { fileId, newUserId }, {
                'X-ACTUAL-TOKEN': userToken,
            });
        }
        catch (err) {
            return { error: err.reason };
        }
    }
    return {};
}
async function ownerCreated() {
    const res = await get(getServer().BASE_SERVER + '/admin/owner-created/');
    if (res) {
        return JSON.parse(res);
    }
    return null;
}
