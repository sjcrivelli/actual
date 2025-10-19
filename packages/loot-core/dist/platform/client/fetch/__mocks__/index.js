"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listen = exports.sendCatch = exports.send = exports.serverPush = exports.clearServer = exports.initServer = void 0;
let listeners = new Map();
let serverHandler = null;
const initServer = handlers => {
    serverHandler = msg => {
        const { name, args, catchErrors } = msg;
        if (handlers[name]) {
            return Promise.resolve().then(() => {
                const promise = handlers[name](args);
                if (catchErrors) {
                    return promise.then(data => ({ data }), err => ({ error: { message: err.message } }));
                }
                return promise;
            });
        }
    };
};
exports.initServer = initServer;
const clearServer = async () => {
    serverHandler = null;
    listeners = new Map();
};
exports.clearServer = clearServer;
const serverPush = (name, args) => {
    Promise.resolve().then(() => {
        const listens = listeners.get(name);
        if (listens) {
            listens.forEach(listener => {
                listener(args);
            });
        }
    });
};
exports.serverPush = serverPush;
const send = async (name, args, { catchErrors = false } = {}) => {
    if (serverHandler) {
        return serverHandler({ name, args, catchErrors });
    }
    else {
        throw new Error('`send` called with no mock server installed');
    }
};
exports.send = send;
const sendCatch = (name, args) => {
    return (0, exports.send)(name, args, { catchErrors: true });
};
exports.sendCatch = sendCatch;
const listen = (name, cb) => {
    if (!listeners.get(name)) {
        listeners.set(name, []);
    }
    listeners.get(name).push(cb);
    return () => {
        const arr = listeners.get(name);
        listeners.set(name, arr.filter(cb_ => cb_ !== cb));
    };
};
exports.listen = listen;
