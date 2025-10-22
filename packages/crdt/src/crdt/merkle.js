"use strict";
// TODO: Ok, several problems:
//
// * If nothing matches between two merkle trees, we should fallback
// * to the last window instead the front one (use 0 instead of the
// * key)
//
// * Need to check to make sure if account exists when handling
// * transaction changes in syncing
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptyTrie = emptyTrie;
exports.getKeys = getKeys;
exports.keyToTimestamp = keyToTimestamp;
exports.insert = insert;
exports.build = build;
exports.diff = diff;
exports.prune = prune;
exports.debug = debug;
function emptyTrie() {
    return { hash: 0 };
}
function isNumberTrieNodeKey(input) {
    return ['0', '1', '2'].includes(input);
}
function getKeys(trie) {
    return Object.keys(trie).filter(isNumberTrieNodeKey);
}
function keyToTimestamp(key) {
    // 16 is the length of the base 3 value of the current time in
    // minutes. Ensure it's padded to create the full value
    var fullkey = key + '0'.repeat(16 - key.length);
    // Parse the base 3 representation
    return parseInt(fullkey, 3) * 1000 * 60;
}
/**
 * Mutates `trie` to insert a node at `timestamp`
 */
function insert(trie, timestamp) {
    var hash = timestamp.hash();
    var key = Number(Math.floor(timestamp.millis() / 1000 / 60)).toString(3);
    trie = Object.assign({}, trie, { hash: (trie.hash || 0) ^ hash });
    return insertKey(trie, key, hash);
}
function insertKey(trie, key, hash) {
    var _a;
    if (key.length === 0) {
        return trie;
    }
    var c = key[0];
    var t = isNumberTrieNodeKey(c) ? trie[c] : undefined;
    var n = t || {};
    return Object.assign({}, trie, (_a = {},
        _a[c] = Object.assign({}, n, insertKey(n, key.slice(1), hash), {
            hash: (n.hash || 0) ^ hash,
        }),
        _a));
}
function build(timestamps) {
    var trie = emptyTrie();
    for (var _i = 0, timestamps_1 = timestamps; _i < timestamps_1.length; _i++) {
        var timestamp = timestamps_1[_i];
        insert(trie, timestamp);
    }
    return trie;
}
function diff(trie1, trie2) {
    if (trie1.hash === trie2.hash) {
        return null;
    }
    var node1 = trie1;
    var node2 = trie2;
    var k = '';
    // This loop will eventually stop when it traverses down to find
    // where the hashes differ, or otherwise when there are no leaves
    // left (this shouldn't happen, if that's the case the hash check at
    // the top of this function should pass)
    while (1) {
        var keyset = new Set(__spreadArray(__spreadArray([], getKeys(node1), true), getKeys(node2), true));
        var keys = __spreadArray([], keyset.values(), true);
        keys.sort();
        var diffkey = null;
        // Traverse down the trie through keys that aren't the same. We
        // traverse down the keys in order. Stop in two cases: either one
        // of the nodes doesn't have the key, or a different key isn't
        // found. For the former case, we have to that because pruning is
        // lossy. We don't know if we've pruned off a changed key so we
        // can't traverse down anymore. For the latter case, it means two
        // things: either we've hit the bottom of the tree, or the changed
        // key has been pruned off. In the latter case we have a "partial"
        // key and will fill the rest with 0s. Note that if multiple older
        // messages were added into one trie, it's possible we will
        // generate a time that only encompasses *some* of the those
        // messages. Pruning is lossy, and we traverse down the left-most
        // changed time that we know of, because of pruning it might take
        // multiple passes to sync up a trie.
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var next1 = node1[key];
            var next2 = node2[key];
            if (!next1 || !next2) {
                break;
            }
            if (next1.hash !== next2.hash) {
                diffkey = key;
                break;
            }
        }
        if (!diffkey) {
            return keyToTimestamp(k);
        }
        k += diffkey;
        node1 = node1[diffkey] || emptyTrie();
        node2 = node2[diffkey] || emptyTrie();
    }
    // eslint-disable-next-line no-unreachable
    return null;
}
function prune(trie, n) {
    if (n === void 0) { n = 2; }
    // Do nothing if empty
    if (!trie.hash) {
        return trie;
    }
    var keys = getKeys(trie);
    keys.sort();
    var next = { hash: trie.hash };
    // Prune child nodes.
    for (var _i = 0, _a = keys.slice(-n); _i < _a.length; _i++) {
        var k = _a[_i];
        var node = trie[k];
        if (!node) {
            throw new Error("TrieNode for key ".concat(k, " could not be found"));
        }
        next[k] = prune(node, n);
    }
    return next;
}
function debug(trie, k, indent) {
    if (k === void 0) { k = ''; }
    if (indent === void 0) { indent = 0; }
    var str = ' '.repeat(indent) +
        (k !== '' ? "k: ".concat(k, " ") : '') +
        "hash: ".concat(trie.hash || '(empty)', "\n");
    return (str +
        getKeys(trie)
            .map(function (key) {
            var node = trie[key];
            if (!node)
                return '';
            return debug(node, key, indent + 2);
        })
            .join(''));
}
