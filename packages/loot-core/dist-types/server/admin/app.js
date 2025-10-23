"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// @ts-strict-ignore
const asyncStorage = __importStar(require("../../platform/server/asyncStorage"));
const app_1 = require("../app");
const post_1 = require("../post");
const server_config_1 = require("../server-config");
// Expose functions to the client
exports.app = (0, app_1.createApp)();
exports.app.method('users-get', getUsers);
exports.app.method('user-delete-all', deleteAllUsers);
exports.app.method('user-add', addUser);
exports.app.method('user-update', updateUser);
exports.app.method('access-add', addAccess);
exports.app.method('access-delete-all', deleteAllAccess);
exports.app.method('access-get-available-users', accessGetAvailableUsers);
exports.app.method('transfer-ownership', transferOwnership);
exports.app.method('owner-created', ownerCreated);
async function getUsers() {
    const userToken = await asyncStorage.getItem('user-token');
    if (userToken) {
        const res = await (0, post_1.get)((0, server_config_1.getServer)().BASE_SERVER + '/admin/users/', {
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
            const res = await (0, post_1.del)((0, server_config_1.getServer)().BASE_SERVER + '/admin/users', {
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
            const res = await (0, post_1.post)((0, server_config_1.getServer)().BASE_SERVER + '/admin/users/', user, {
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
            const res = await (0, post_1.patch)((0, server_config_1.getServer)().BASE_SERVER + '/admin/users/', user, {
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
            await (0, post_1.post)((0, server_config_1.getServer)().BASE_SERVER + '/admin/access/', access, {
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
            const res = await (0, post_1.del)((0, server_config_1.getServer)().BASE_SERVER + `/admin/access?fileId=${fileId}`, {
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
        const res = await (0, post_1.get)(`${(0, server_config_1.getServer)().BASE_SERVER + '/admin/access/users'}?fileId=${fileId}`, {
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
            await (0, post_1.post)((0, server_config_1.getServer)().BASE_SERVER + '/admin/access/transfer-ownership/', { fileId, newUserId }, {
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
    const res = await (0, post_1.get)((0, server_config_1.getServer)().BASE_SERVER + '/admin/owner-created/');
    if (res) {
        return JSON.parse(res);
    }
    return null;
}
//# sourceMappingURL=app.js.map