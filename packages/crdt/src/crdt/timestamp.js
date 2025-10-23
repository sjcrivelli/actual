"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timestamp = void 0;
exports.setClock = setClock;
exports.getClock = getClock;
exports.makeClock = makeClock;
exports.serializeClock = serializeClock;
exports.deserializeClock = deserializeClock;
exports.makeClientId = makeClientId;
const murmurhash_1 = __importDefault(require("murmurhash"));
const uuid_1 = require("uuid");
// A mutable global clock
let clock;
function setClock(clock_) {
    clock = clock_;
}
function getClock() {
    return clock;
}
function makeClock(timestamp, merkle = {}) {
    return { timestamp: MutableTimestamp.from(timestamp), merkle };
}
function serializeClock(clock) {
    return JSON.stringify({
        timestamp: clock.timestamp.toString(),
        merkle: clock.merkle,
    });
}
function deserializeClock(clock) {
    let data;
    try {
        data = JSON.parse(clock);
    }
    catch (e) {
        data = {
            timestamp: '1970-01-01T00:00:00.000Z-0000-' + makeClientId(),
            merkle: {},
        };
    }
    const ts = Timestamp.parse(data.timestamp);
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
const config = {
    // Allow 5 minutes of clock drift
    maxDrift: 5 * 60 * 1000,
};
const MAX_COUNTER = parseInt('0xFFFF');
const MAX_NODE_LENGTH = 16;
/**
 * timestamp instance class
 */
class Timestamp {
    _state;
    constructor(millis, counter, node) {
        this._state = {
            millis,
            counter,
            node,
        };
    }
    valueOf() {
        return this.toString();
    }
    toString() {
        return [
            new Date(this.millis()).toISOString(),
            ('0000' + this.counter().toString(16).toUpperCase()).slice(-4),
            ('0000000000000000' + this.node()).slice(-16),
        ].join('-');
    }
    millis() {
        return this._state.millis;
    }
    counter() {
        return this._state.counter;
    }
    node() {
        return this._state.node;
    }
    hash() {
        return murmurhash_1.default.v3(this.toString());
    }
    // Timestamp generator initialization
    // * sets the node ID to an arbitrary value
    // * useful for mocking/unit testing
    static init(options = {}) {
        if (options.maxDrift) {
            config.maxDrift = options.maxDrift;
        }
        setClock(makeClock(new Timestamp(0, 0, options.node
            ? ('0000000000000000' + options.node).toString().slice(-16)
            : '')));
    }
    /**
     * maximum timestamp
     */
    static max = Timestamp.parse('9999-12-31T23:59:59.999Z-FFFF-FFFFFFFFFFFFFFFF');
    /**
     * timestamp parsing
     * converts a fixed-length string timestamp to the structured value
     */
    static parse(timestamp) {
        if (timestamp instanceof Timestamp) {
            return timestamp;
        }
        if (typeof timestamp === 'string') {
            const parts = timestamp.split('-');
            if (parts && parts.length === 5) {
                const millis = Date.parse(parts.slice(0, 3).join('-')).valueOf();
                const counter = parseInt(parts[3], 16);
                const node = parts[4];
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
    }
    /**
     * Timestamp send. Generates a unique, monotonic timestamp suitable
     * for transmission to another system in string format
     */
    static send() {
        if (!clock) {
            return null;
        }
        // retrieve the local wall time
        const phys = Date.now();
        // unpack the clock.timestamp logical time and counter
        const lOld = clock.timestamp.millis();
        const cOld = clock.timestamp.counter();
        // calculate the next logical time and counter
        // * ensure that the logical time never goes backward
        // * increment the counter if phys time does not advance
        const lNew = Math.max(lOld, phys);
        const cNew = lOld === lNew ? cOld + 1 : 0;
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
    }
    // Timestamp receive. Parses and merges a timestamp from a remote
    // system with the local timeglobal uniqueness and monotonicity are
    // preserved
    static recv(msg) {
        if (!clock) {
            return null;
        }
        // retrieve the local wall time
        const phys = Date.now();
        // unpack the message wall time/counter
        const lMsg = msg.millis();
        const cMsg = msg.counter();
        // assert the node id and remote clock drift
        // if (msg.node() === clock.timestamp.node()) {
        //   throw new Timestamp.DuplicateNodeError(clock.timestamp.node());
        // }
        if (lMsg - phys > config.maxDrift) {
            throw new Timestamp.ClockDriftError();
        }
        // unpack the clock.timestamp logical time and counter
        const lOld = clock.timestamp.millis();
        const cOld = clock.timestamp.counter();
        // calculate the next logical time and counter
        // . ensure that the logical time never goes backward
        // . if all logical clocks are equal, increment the max counter
        // . if max = old > message, increment local counter
        // . if max = messsage > old, increment message counter
        // . otherwise, clocks are monotonic, reset counter
        const lNew = Math.max(Math.max(lOld, phys), lMsg);
        const cNew = lNew === lOld && lNew === lMsg
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
    }
    /**
     * zero/minimum timestamp
     */
    static zero = Timestamp.parse('1970-01-01T00:00:00.000Z-0000-0000000000000000');
    static since = (isoString) => isoString + '-0000-0000000000000000';
    /**
     * error classes
     */
    static DuplicateNodeError = class DuplicateNodeError extends Error {
        constructor(node) {
            super('duplicate node identifier ' + node);
            this.name = 'DuplicateNodeError';
        }
    };
    static ClockDriftError = class ClockDriftError extends Error {
        constructor(...args) {
            super(['maximum clock drift exceeded'].concat(args).join(' '));
            this.name = 'ClockDriftError';
        }
    };
    static OverflowError = class OverflowError extends Error {
        constructor() {
            super('timestamp counter overflow');
            this.name = 'OverflowError';
        }
    };
    static InvalidError = class InvalidError extends Error {
        constructor(...args) {
            super(['timestamp is not valid'].concat(args.map(String)).join(' '));
            this.name = 'InvalidError';
        }
    };
}
exports.Timestamp = Timestamp;
class MutableTimestamp extends Timestamp {
    static from(timestamp) {
        return new MutableTimestamp(timestamp.millis(), timestamp.counter(), timestamp.node());
    }
    setMillis(n) {
        this._state.millis = n;
    }
    setCounter(n) {
        this._state.counter = n;
    }
    setNode(n) {
        this._state.node = n;
    }
}
