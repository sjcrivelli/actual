"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timestamp = void 0;
exports.setClock = setClock;
exports.getClock = getClock;
exports.makeClock = makeClock;
exports.serializeClock = serializeClock;
exports.deserializeClock = deserializeClock;
exports.makeClientId = makeClientId;
var murmurhash_1 = require("murmurhash");
var uuid_1 = require("uuid");
// A mutable global clock
var clock;
function setClock(clock_) {
    clock = clock_;
}
function getClock() {
    return clock;
}
function makeClock(timestamp, merkle) {
    if (merkle === void 0) { merkle = {}; }
    return { timestamp: MutableTimestamp.from(timestamp), merkle: merkle };
}
function serializeClock(clock) {
    return JSON.stringify({
        timestamp: clock.timestamp.toString(),
        merkle: clock.merkle,
    });
}
function deserializeClock(clock) {
    var data;
    try {
        data = JSON.parse(clock);
    }
    catch (e) {
        data = {
            timestamp: '1970-01-01T00:00:00.000Z-0000-' + makeClientId(),
            merkle: {},
        };
    }
    var ts = Timestamp.parse(data.timestamp);
    if (!ts) {
        throw new Timestamp.InvalidError(data.timestamp);
    }
    return {
        timestamp: MutableTimestamp.from(ts),
        merkle: data.merkle,
    };
}
function makeClientId() {
    return (0, uuid_1.v4)().replace(/-/g, '').slice(-16);
}
var config = {
    // Allow 5 minutes of clock drift
    maxDrift: 5 * 60 * 1000,
};
var MAX_COUNTER = parseInt('0xFFFF');
var MAX_NODE_LENGTH = 16;
/**
 * timestamp instance class
 */
var Timestamp = /** @class */ (function () {
    function Timestamp(millis, counter, node) {
        this._state = {
            millis: millis,
            counter: counter,
            node: node,
        };
    }
    Timestamp.prototype.valueOf = function () {
        return this.toString();
    };
    Timestamp.prototype.toString = function () {
        return [
            new Date(this.millis()).toISOString(),
            ('0000' + this.counter().toString(16).toUpperCase()).slice(-4),
            ('0000000000000000' + this.node()).slice(-16),
        ].join('-');
    };
    Timestamp.prototype.millis = function () {
        return this._state.millis;
    };
    Timestamp.prototype.counter = function () {
        return this._state.counter;
    };
    Timestamp.prototype.node = function () {
        return this._state.node;
    };
    Timestamp.prototype.hash = function () {
        return murmurhash_1.default.v3(this.toString());
    };
    // Timestamp generator initialization
    // * sets the node ID to an arbitrary value
    // * useful for mocking/unit testing
    Timestamp.init = function (options) {
        if (options === void 0) { options = {}; }
        if (options.maxDrift) {
            config.maxDrift = options.maxDrift;
        }
        setClock(makeClock(new Timestamp(0, 0, options.node
            ? ('0000000000000000' + options.node).toString().slice(-16)
            : '')));
    };
    /**
     * timestamp parsing
     * converts a fixed-length string timestamp to the structured value
     */
    Timestamp.parse = function (timestamp) {
        if (timestamp instanceof Timestamp) {
            return timestamp;
        }
        if (typeof timestamp === 'string') {
            var parts = timestamp.split('-');
            if (parts && parts.length === 5) {
                var millis = Date.parse(parts.slice(0, 3).join('-')).valueOf();
                var counter = parseInt(parts[3], 16);
                var node = parts[4];
                if (!isNaN(millis) &&
                    millis >= 0 &&
                    !isNaN(counter) &&
                    counter <= MAX_COUNTER &&
                    typeof node === 'string' &&
                    node.length <= MAX_NODE_LENGTH) {
                    return new Timestamp(millis, counter, node);
                }
            }
        }
        return null;
    };
    /**
     * Timestamp send. Generates a unique, monotonic timestamp suitable
     * for transmission to another system in string format
     */
    Timestamp.send = function () {
        if (!clock) {
            return null;
        }
        // retrieve the local wall time
        var phys = Date.now();
        // unpack the clock.timestamp logical time and counter
        var lOld = clock.timestamp.millis();
        var cOld = clock.timestamp.counter();
        // calculate the next logical time and counter
        // * ensure that the logical time never goes backward
        // * increment the counter if phys time does not advance
        var lNew = Math.max(lOld, phys);
        var cNew = lOld === lNew ? cOld + 1 : 0;
        // check the result for drift and counter overflow
        if (lNew - phys > config.maxDrift) {
            throw new Timestamp.ClockDriftError(lNew, phys, config.maxDrift);
        }
        if (cNew > MAX_COUNTER) {
            throw new Timestamp.OverflowError();
        }
        // repack the logical time/counter
        clock.timestamp.setMillis(lNew);
        clock.timestamp.setCounter(cNew);
        return new Timestamp(clock.timestamp.millis(), clock.timestamp.counter(), clock.timestamp.node());
    };
    // Timestamp receive. Parses and merges a timestamp from a remote
    // system with the local timeglobal uniqueness and monotonicity are
    // preserved
    Timestamp.recv = function (msg) {
        if (!clock) {
            return null;
        }
        // retrieve the local wall time
        var phys = Date.now();
        // unpack the message wall time/counter
        var lMsg = msg.millis();
        var cMsg = msg.counter();
        // assert the node id and remote clock drift
        // if (msg.node() === clock.timestamp.node()) {
        //   throw new Timestamp.DuplicateNodeError(clock.timestamp.node());
        // }
        if (lMsg - phys > config.maxDrift) {
            throw new Timestamp.ClockDriftError();
        }
        // unpack the clock.timestamp logical time and counter
        var lOld = clock.timestamp.millis();
        var cOld = clock.timestamp.counter();
        // calculate the next logical time and counter
        // . ensure that the logical time never goes backward
        // . if all logical clocks are equal, increment the max counter
        // . if max = old > message, increment local counter
        // . if max = messsage > old, increment message counter
        // . otherwise, clocks are monotonic, reset counter
        var lNew = Math.max(Math.max(lOld, phys), lMsg);
        var cNew = lNew === lOld && lNew === lMsg
            ? Math.max(cOld, cMsg) + 1
            : lNew === lOld
                ? cOld + 1
                : lNew === lMsg
                    ? cMsg + 1
                    : 0;
        // check the result for drift and counter overflow
        if (lNew - phys > config.maxDrift) {
            throw new Timestamp.ClockDriftError();
        }
        if (cNew > MAX_COUNTER) {
            throw new Timestamp.OverflowError();
        }
        // repack the logical time/counter
        clock.timestamp.setMillis(lNew);
        clock.timestamp.setCounter(cNew);
        return new Timestamp(clock.timestamp.millis(), clock.timestamp.counter(), clock.timestamp.node());
    };
    /**
     * maximum timestamp
     */
    Timestamp.max = Timestamp.parse('9999-12-31T23:59:59.999Z-FFFF-FFFFFFFFFFFFFFFF');
    /**
     * zero/minimum timestamp
     */
    Timestamp.zero = Timestamp.parse('1970-01-01T00:00:00.000Z-0000-0000000000000000');
    Timestamp.since = function (isoString) { return isoString + '-0000-0000000000000000'; };
    /**
     * error classes
     */
    Timestamp.DuplicateNodeError = /** @class */ (function (_super) {
        __extends(DuplicateNodeError, _super);
        function DuplicateNodeError(node) {
            var _this = _super.call(this, 'duplicate node identifier ' + node) || this;
            _this.name = 'DuplicateNodeError';
            return _this;
        }
        return DuplicateNodeError;
    }(Error));
    Timestamp.ClockDriftError = /** @class */ (function (_super) {
        __extends(ClockDriftError, _super);
        function ClockDriftError() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.call(this, ['maximum clock drift exceeded'].concat(args).join(' ')) || this;
            _this.name = 'ClockDriftError';
            return _this;
        }
        return ClockDriftError;
    }(Error));
    Timestamp.OverflowError = /** @class */ (function (_super) {
        __extends(OverflowError, _super);
        function OverflowError() {
            var _this = _super.call(this, 'timestamp counter overflow') || this;
            _this.name = 'OverflowError';
            return _this;
        }
        return OverflowError;
    }(Error));
    Timestamp.InvalidError = /** @class */ (function (_super) {
        __extends(InvalidError, _super);
        function InvalidError() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.call(this, ['timestamp is not valid'].concat(args.map(String)).join(' ')) || this;
            _this.name = 'InvalidError';
            return _this;
        }
        return InvalidError;
    }(Error));
    return Timestamp;
}());
exports.Timestamp = Timestamp;
var MutableTimestamp = /** @class */ (function (_super) {
    __extends(MutableTimestamp, _super);
    function MutableTimestamp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MutableTimestamp.from = function (timestamp) {
        return new MutableTimestamp(timestamp.millis(), timestamp.counter(), timestamp.node());
    };
    MutableTimestamp.prototype.setMillis = function (n) {
        this._state.millis = n;
    };
    MutableTimestamp.prototype.setCounter = function (n) {
        this._state.counter = n;
    };
    MutableTimestamp.prototype.setNode = function (n) {
        this._state.node = n;
    };
    return MutableTimestamp;
}(Timestamp));
