export function sequential(fn) {
    const sequenceState = {
        running: null,
        queue: [],
    };
    function pump() {
        const next = sequenceState.queue.shift();
        if (next !== undefined) {
            run(next.args, next.resolve, next.reject);
        }
        else {
            sequenceState.running = null;
        }
    }
    function run(args, resolve, reject) {
        sequenceState.running = fn.apply(null, args).then((val) => {
            pump();
            resolve(val);
        }, (err) => {
            pump();
            reject(err);
        });
    }
    return ((...args) => {
        if (!sequenceState.running) {
            return new Promise((resolve, reject) => {
                return run(args, resolve, reject);
            });
        }
        else {
            return new Promise((resolve, reject) => {
                sequenceState.queue.push({ resolve, reject, args });
            });
        }
    });
}
export function once(fn) {
    let promise = null;
    return (...args) => {
        if (!promise) {
            promise = fn.apply(null, args).finally(() => {
                promise = null;
            });
            return promise;
        }
        return promise;
    };
}
