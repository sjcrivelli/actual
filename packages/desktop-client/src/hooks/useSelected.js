import * as undo from "@desktop-client/undo";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.useSelected = useSelected;
exports.useSelectedDispatch = useSelectedDispatch;
exports.useSelectedItems = useSelectedItems;
exports.SelectedProvider = SelectedProvider;
exports.SelectedProviderWithItems = SelectedProviderWithItems;
// @ts-strict-ignore
var react_1 = require("react");
var fetch_1 = require("loot-core/platform/client/fetch");
function iterateRange(range, func) {
    var from = Math.min(range.start, range.end);
    var to = Math.max(range.start, range.end);
    for (var i = from; i <= to; i++) {
        func(i);
    }
}
function useSelected(name, items, initialSelectedIds, selectAllFilter) {
    var _a = (0, react_1.useReducer)(function (state, action) {
        switch (action.type) {
            case 'select': {
                var selectedRange_1 = state.selectedRange;
                var selectedItems_1 = new Set(state.selectedItems);
                var id_1 = action.id, isRangeSelect = action.isRangeSelect;
                if (isRangeSelect && selectedRange_1) {
                    var idx = items.findIndex(function (p) { return p.id === id_1; });
                    var startIdx = items.findIndex(function (p) { return p.id === selectedRange_1.start; });
                    var endIdx = items.findIndex(function (p) { return p.id === selectedRange_1.end; });
                    var range = void 0;
                    var deleteUntil = void 0;
                    if (endIdx === -1) {
                        range = { start: startIdx, end: idx };
                    }
                    else if (endIdx < startIdx) {
                        if (idx <= startIdx) {
                            range = { start: startIdx, end: idx };
                            if (idx > endIdx) {
                                deleteUntil = { start: idx - 1, end: endIdx };
                            }
                        }
                        else {
                            // Switching directions
                            range = { start: endIdx, end: idx };
                        }
                    }
                    else {
                        if (idx >= startIdx) {
                            range = { start: startIdx, end: idx };
                            if (idx < endIdx) {
                                deleteUntil = { start: idx + 1, end: endIdx };
                            }
                        }
                        else {
                            // Switching directions
                            range = { start: endIdx, end: idx };
                        }
                    }
                    iterateRange(range, function (i) { return selectedItems_1.add(items[i].id); });
                    if (deleteUntil) {
                        iterateRange(deleteUntil, function (i) { return selectedItems_1.delete(items[i].id); });
                    }
                    return __assign(__assign({}, state), { selectedItems: selectedItems_1, selectedRange: {
                            start: items[range.start].id,
                            end: items[range.end].id,
                        } });
                }
                else {
                    var range = null;
                    if (!selectedItems_1.delete(id_1)) {
                        selectedItems_1.add(id_1);
                        range = { start: id_1, end: null };
                    }
                    return __assign(__assign({}, state), { selectedItems: selectedItems_1, selectedRange: range });
                }
            }
            case 'select-none':
                return __assign(__assign({}, state), { selectedItems: new Set() });
            case 'select-all':
                var selectedItems = [];
                if (action.ids && items && selectAllFilter) {
                    var idsToInclude_1 = new Set(items.filter(selectAllFilter).map(function (item) { return item.id; }));
                    selectedItems = action.ids.filter(function (id) { return idsToInclude_1.has(id); });
                }
                else if (items && selectAllFilter) {
                    selectedItems = items.filter(selectAllFilter).map(function (item) { return item.id; });
                }
                else {
                    selectedItems = action.ids || items.map(function (item) { return item.id; });
                }
                return __assign(__assign({}, state), { selectedItems: new Set(selectedItems), selectedRange: action.ids && action.ids.length === 1
                        ? { start: action.ids[0], end: null }
                        : null });
            default:
                throw new Error('Unexpected action: ' + JSON.stringify(action));
        }
    }, null, function () { return ({
        selectedItems: new Set(initialSelectedIds || []),
        selectedRange: initialSelectedIds && initialSelectedIds.length === 1
            ? { start: initialSelectedIds[0], end: null }
            : null,
    }); }), state = _a[0], dispatch = _a[1];
    var prevItems = (0, react_1.useRef)(items);
    (0, react_1.useEffect)(function () {
        if (state.selectedItems.size > 0) {
            // We need to make sure there are no ids in the selection that
            // aren't valid anymore. This happens if the item has been
            // deleted or otherwise removed from the current view. We do
            // this by cross-referencing the current selection with the
            // available item ids
            //
            // This effect may run multiple times while items is updated, we
            // need to make sure that we don't remove selected ids until the
            // items array *actually* changes. A component may render with
            // new `items` arrays that are the same, just fresh instances, but
            // we need to wait until the actual array changes. This solves
            // the case where undo-ing adds back items, but we remove the
            // selected item too early (because the component rerenders
            // multiple times)
            var ids_1 = new Set(items.map(function (item) { return item.id; }));
            var isSame = prevItems.current.length === items.length &&
                prevItems.current.every(function (item) { return ids_1.has(item.id); });
            if (!isSame) {
                var selected = __spreadArray([], state.selectedItems, true);
                var filtered = selected.filter(function (id) { return ids_1.has(id); });
                // If the selected items has changed, update the selection
                if (selected.length !== filtered.length) {
                    dispatch({ type: 'select-all', ids: filtered });
                }
            }
        }
        prevItems.current = items;
    }, [items, state.selectedItems]);
    (0, react_1.useEffect)(function () {
        var prevState = undo.getUndoState('selectedItems');
        undo.setUndoState('selectedItems', { name: name, items: state.selectedItems });
        return function () { return undo.setUndoState('selectedItems', prevState); };
    }, [name, state.selectedItems]);
    (0, react_1.useEffect)(function () {
        function onUndo(_a) {
            var _b;
            var messages = _a.messages, undoTag = _a.undoTag;
            var tagged = undo.getTaggedState(undoTag);
            var deletedIds = new Set(messages
                .filter(function (msg) { return msg.column === 'tombstone' && msg.value === 1; })
                .map(function (msg) { return msg.row; }));
            if (((_b = tagged === null || tagged === void 0 ? void 0 : tagged.selectedItems) === null || _b === void 0 ? void 0 : _b.name) === name) {
                dispatch({
                    type: 'select-all',
                    // Coerce the Set into an array
                    ids: __spreadArray([], tagged.selectedItems.items, true).filter(function (id) { return !deletedIds.has(id); }),
                });
            }
        }
        var lastUndoEvent = undo.getUndoState('undoEvent');
        if (lastUndoEvent) {
            onUndo(lastUndoEvent);
        }
        return (0, fetch_1.listen)('undo-event', onUndo);
    }, [name]);
    return {
        items: state.selectedItems,
        dispatch: dispatch,
    };
}
var SelectedDispatch = (0, react_1.createContext)(null);
var SelectedItems = (0, react_1.createContext)(null);
function useSelectedDispatch() {
    return (0, react_1.useContext)(SelectedDispatch);
}
function useSelectedItems() {
    return (0, react_1.useContext)(SelectedItems);
}
function SelectedProvider(_a) {
    var _this = this;
    var instance = _a.instance, fetchAllIds = _a.fetchAllIds, children = _a.children;
    var instanceItems = instance.items, instanceDispatch = instance.dispatch;
    var latestItems = (0, react_1.useRef)(instanceItems);
    latestItems.current = instanceItems;
    var dispatch = (0, react_1.useCallback)(function (action) { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(action.type === 'select-all')) return [3 /*break*/, 4];
                    if (!(latestItems.current && latestItems.current.size > 0)) return [3 /*break*/, 1];
                    return [2 /*return*/, instanceDispatch({
                            type: 'select-none',
                            isRangeSelect: action.isRangeSelect,
                        })];
                case 1:
                    if (!fetchAllIds) return [3 /*break*/, 3];
                    _a = instanceDispatch;
                    _b = {
                        type: 'select-all'
                    };
                    return [4 /*yield*/, fetchAllIds()];
                case 2: return [2 /*return*/, _a.apply(void 0, [(_b.ids = _c.sent(),
                            _b.isRangeSelect = action.isRangeSelect,
                            _b)])];
                case 3: return [2 /*return*/, instanceDispatch({
                        type: 'select-all',
                        isRangeSelect: action.isRangeSelect,
                    })];
                case 4: return [2 /*return*/, instanceDispatch(action)];
            }
        });
    }); }, [instanceDispatch, fetchAllIds]);
    return (<SelectedItems.Provider value={instance.items}>
      <SelectedDispatch.Provider value={dispatch}>
        {children}
      </SelectedDispatch.Provider>
    </SelectedItems.Provider>);
}
// This can be helpful in class components if you cannot use the
// custom hook
function SelectedProviderWithItems(_a) {
    var name = _a.name, items = _a.items, _b = _a.initialSelectedIds, initialSelectedIds = _b === void 0 ? [] : _b, fetchAllIds = _a.fetchAllIds, registerDispatch = _a.registerDispatch, selectAllFilter = _a.selectAllFilter, children = _a.children;
    var selected = useSelected(name, items, initialSelectedIds, selectAllFilter);
    (0, react_1.useEffect)(function () {
        registerDispatch === null || registerDispatch === void 0 ? void 0 : registerDispatch(selected.dispatch);
    }, [registerDispatch, selected.dispatch]);
    return (<SelectedProvider instance={selected} fetchAllIds={fetchAllIds}>
      {children}
    </SelectedProvider>);
}
