"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMutator = void 0;
exports.mutator = mutator;
exports.isMutating = isMutating;
exports.runHandler = runHandler;
exports.enableGlobalMutations = enableGlobalMutations;
exports.disableGlobalMutations = disableGlobalMutations;
exports.withMutatorContext = withMutatorContext;
exports.getMutatorContext = getMutatorContext;
// @ts-strict-ignore
const exceptions_1 = require("../platform/exceptions");
const async_1 = require("../shared/async");
const runningMethods = new Set();
let currentContext = null;
const mutatingMethods = new WeakMap();
let globalMutationsEnabled = false;
let _latestHandlerNames = [];
function mutator(handler) {
    mutatingMethods.set(handler, true);
    return handler;
}
function isMutating(handler) {
    return mutatingMethods.has(handler);
}
async function flushRunningMethods() {
    // Give the client some time to invoke new requests
    await wait(200);
    while (runningMethods.size > 0) {
        // Wait for all of them
        await Promise.all([...runningMethods.values()]);
        // We give clients more time to make other requests. This lets them continue
        // to do an async workflow
        await wait(100);
    }
}
function wait(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
async function runHandler(handler, args, { undoTag, name } = {}) {
    // For debug reasons, track the latest handlers that have been
    // called
    _latestHandlerNames.push(name);
    if (_latestHandlerNames.length > 5) {
        _latestHandlerNames = _latestHandlerNames.slice(-5);
    }
    if (mutatingMethods.has(handler)) {
        return (0, exports.runMutator)(() => handler(args), { undoTag });
    }
    // When closing a file, it clears out all global state for the file. That
    // means any async workflows currently executed would be cut off. We handle
    // this by letting all async workflows finish executing before closing the
    // file
    if (name === 'close-budget') {
        await flushRunningMethods();
    }
    const promise = handler(args);
    runningMethods.add(promise);
    promise.then(() => {
        runningMethods.delete(promise);
    });
    return promise;
}
// These are useful for tests. Only use them in tests.
function enableGlobalMutations() {
    if (process.env.NODE_ENV === 'test') {
        globalMutationsEnabled = true;
    }
}
function disableGlobalMutations() {
    if (process.env.NODE_ENV === 'test') {
        globalMutationsEnabled = false;
    }
}
function _runMutator(func, initialContext = {}) {
    currentContext = initialContext;
    return func().finally(() => {
        currentContext = null;
    });
}
// Type cast needed as TS looses types over nested generic returns
exports.runMutator = (0, async_1.sequential)(_runMutator);
function withMutatorContext(context, func) {
    if (currentContext == null && !globalMutationsEnabled) {
        (0, exceptions_1.captureBreadcrumb)('Recent methods: ' + _latestHandlerNames.join(', '));
        (0, exceptions_1.captureException)(new Error('withMutatorContext: mutator not running'));
        // See comment below. This is not an error right now, but it will
        // be in the future.
        return func();
    }
    const prevContext = currentContext;
    currentContext = { ...currentContext, ...context };
    return func().finally(() => {
        currentContext = prevContext;
    });
}
function getMutatorContext() {
    if (currentContext == null) {
        (0, exceptions_1.captureBreadcrumb)({
            category: 'server',
            message: 'Recent methods: ' + _latestHandlerNames.join(', '),
        });
        // captureException(new Error('getMutatorContext: mutator not running'));
        // For now, this is a non-fatal error. It will be in the future,
        // but this is relatively non-critical (undo just won't work) so
        // return an empty context. When we have more confidence that
        // everything is running inside a mutator, throw an error.
        return {};
    }
    if (currentContext == null && globalMutationsEnabled) {
        return {};
    }
    return currentContext;
}
