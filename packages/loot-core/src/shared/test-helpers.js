"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tracer = void 0;
exports.resetTracer = resetTracer;
exports.execTracer = execTracer;
exports.tracer = null;
function timeout(promise, n) {
    var resolve;
    var timeoutPromise = new Promise(function (_) { return (resolve = _); });
    var timer = setTimeout(function () { return resolve("timeout(".concat(n, ")")); }, n);
    return Promise.race([
        promise.then(function (res) {
            clearTimeout(timer);
            return res;
        }),
        timeoutPromise,
    ]);
}
function resetTracer() {
    exports.tracer = execTracer();
}
function execTracer() {
    var queue = [];
    var hasStarted = false;
    var waitingFor = null;
    var ended = false;
    var log = false;
    return {
        event: function (name, data) {
            if (!hasStarted) {
                return;
            }
            else if (log) {
                console.log("--- event(".concat(name, ", ").concat(JSON.stringify(data), ") ---"));
            }
            if (ended) {
                throw new Error("Tracer received event but didn\u2019t expect it: ".concat(name, " with data: ").concat(JSON.stringify(data)));
            }
            else if (waitingFor) {
                if (waitingFor.name !== name) {
                    waitingFor.reject(new Error("Event traced \u201C".concat(name, "\u201D but expected \u201C").concat(waitingFor.name, "\u201D")));
                }
                else {
                    waitingFor.resolve(data);
                }
                waitingFor = null;
            }
            else {
                queue.push({ name: name, data: data });
            }
        },
        wait: function (name) {
            if (waitingFor) {
                throw new Error("Already waiting for ".concat(waitingFor.name, ", cannot wait for multiple events"));
            }
            return new Promise(function (resolve, reject) {
                waitingFor = { resolve: resolve, reject: reject, name: name };
            });
        },
        expectWait: function (name, data) {
            if (!hasStarted) {
                throw new Error("Expected \u201C".concat(name, "\u201D but tracer hasn\u2019t started yet"));
            }
            else if (log) {
                console.log("--- expectWait(".concat(name, ") ---"));
            }
            var promise = this.wait(name);
            if (data === undefined) {
                // We want to ignore the result
                return expect(timeout(promise.then(function () { return true; }), 1000)).resolves.toEqual(true);
            }
            if (typeof data === 'function') {
                return expect(timeout(promise, 1000))
                    .resolves.toBeTruthy()
                    .then(function () { return promise; })
                    .then(function (res) { return data(res); });
            }
            else {
                // We use this form because it tracks the right location in the
                // test when it fails. It's annoying to always write this in the
                // test though, so this provides a clean API. The right line
                // number in the test will show up in the stack.
                return expect(timeout(promise, 1000)).resolves.toEqual(data);
            }
        },
        expectNow: function (name, data) {
            if (!hasStarted) {
                throw new Error("Expected \u201C".concat(name, "\u201D but tracer hasn\u2019t started yet"));
            }
            else if (log) {
                console.log("--- expectNow(".concat(name, ") ---"));
            }
            var entry = queue.shift();
            if (!entry) {
                throw new Error("Expected event \u201C".concat(name, "\u201D but none found - has it happened yet?"));
            }
            else if (entry.name === name) {
                if (typeof data === 'function') {
                    data(entry.data);
                }
                else {
                    expect(entry.data).toEqual(data);
                }
            }
            else {
                throw new Error("Event traced \u201C".concat(queue[0].name, "\u201D but expected \u201C").concat(name, "\u201D"));
            }
        },
        expect: function (name, data) {
            if (queue.length === 0) {
                return this.expectWait(name, data);
            }
            return this.expectNow(name, data);
        },
        start: function () {
            hasStarted = true;
        },
        end: function () {
            if (hasStarted && queue.length !== 0) {
                var str = queue.map(function (x) { return JSON.stringify(x); });
                throw new Error('Event tracer ended with existing events: ' + str.join('\n\n'));
            }
            ended = true;
        },
    };
}
