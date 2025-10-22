"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequential = sequential;
exports.once = once;
function sequential(fn) {
    var sequenceState = {
        running: null,
        queue: [],
    };
    function pump() {
        var next = sequenceState.queue.shift();
        if (next !== undefined) {
            run(next.args, next.resolve, next.reject);
        }
        else {
            sequenceState.running = null;
        }
    }
    function run(args, resolve, reject) {
        sequenceState.running = fn.apply(null, args).then(function (val) {
            pump();
            resolve(val);
        }, function (err) {
            pump();
            reject(err);
        });
    }
    return (function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!sequenceState.running) {
            return new Promise(function (resolve, reject) {
                return run(args, resolve, reject);
            });
        }
        else {
            return new Promise(function (resolve, reject) {
                sequenceState.queue.push({ resolve: resolve, reject: reject, args: args });
            });
        }
    });
}
function once(fn) {
    var promise = null;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!promise) {
            promise = fn.apply(null, args).finally(function () {
                promise = null;
            });
            return promise;
        }
        return promise;
    };
}
