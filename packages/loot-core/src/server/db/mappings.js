"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadMappings = loadMappings;
exports.getMappings = getMappings;
exports.getMapping = getMapping;
// @ts-strict-ignore
var index_1 = require("../sync/index");
var db = require("./index");
// This file keeps all the mappings in memory so we can access it
// synchronously. This is primarily used in the rules system, but
// there may be other uses in the future. You don't need to worry
// about this generally; if you are querying transactions, ids are
// transparently mapped for you. But if you are building something
// that stores ids and later uses them, you need to remember to map
// the ids.
//
// IMPORTANT: `loadMappings` must be called first before other modules
// that listen for sync changes. This must be the first sync listener
// to run in case other listeners use this mapping table; otherwise
// they might see stale mappings.
var allMappings;
var unlistenSync;
function loadMappings() {
    return __awaiter(this, void 0, void 0, function () {
        var categories, payees;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.all('SELECT * FROM category_mapping')];
                case 1:
                    categories = (_a.sent()).map(function (r) { return [r.id, r.transferId]; });
                    return [4 /*yield*/, db.all('SELECT * FROM payee_mapping')];
                case 2:
                    payees = (_a.sent()).map(function (r) { return [r.id, r.targetId]; });
                    // All ids are unique, so we can just keep a global table of mappings
                    allMappings = new Map(categories.concat(payees));
                    if (unlistenSync) {
                        unlistenSync();
                    }
                    unlistenSync = (0, index_1.addSyncListener)(onApplySync);
                    return [2 /*return*/];
            }
        });
    });
}
function onApplySync(oldValues, newValues) {
    newValues.forEach(function (items, table) {
        if (table.indexOf('mapping') !== -1) {
            var field_1 = table === 'category_mapping' ? 'transferId' : 'targetId';
            items.forEach(function (newValue) {
                allMappings.set(newValue.id, newValue[field_1]);
            });
        }
    });
}
function getMappings() {
    return allMappings;
}
function getMapping(id) {
    return allMappings.get(id) || null;
}
