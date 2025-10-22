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
exports.SavedFilterMenuButton = SavedFilterMenuButton;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v0_1 = require("@actual-app/components/icons/v0");
var popover_1 = require("@actual-app/components/popover");
var text_1 = require("@actual-app/components/text");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var FilterMenu_1 = require("./FilterMenu");
var NameFilter_1 = require("./NameFilter");
function SavedFilterMenuButton(_a) {
    var _this = this;
    var _b;
    var conditions = _a.conditions, conditionsOp = _a.conditionsOp, filterId = _a.filterId, onClearFilters = _a.onClearFilters, onReloadSavedFilter = _a.onReloadSavedFilter, savedFilters = _a.savedFilters;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _c = (0, react_1.useState)(false), nameOpen = _c[0], setNameOpen = _c[1];
    var _d = (0, react_1.useState)(false), adding = _d[0], setAdding = _d[1];
    var _e = (0, react_1.useState)(false), menuOpen = _e[0], setMenuOpen = _e[1];
    var triggerRef = (0, react_1.useRef)(null);
    var _f = (0, react_1.useState)(null), err = _f[0], setErr = _f[1];
    var _g = (0, react_1.useState)(''), menuItem = _g[0], setMenuItem = _g[1];
    var _h = (0, react_1.useState)((_b = filterId === null || filterId === void 0 ? void 0 : filterId.name) !== null && _b !== void 0 ? _b : ''), name = _h[0], setName = _h[1];
    var id = filterId === null || filterId === void 0 ? void 0 : filterId.id;
    var originalSavedFilter = (0, react_1.useRef)(null);
    var onFilterMenuSelect = function (item) { return __awaiter(_this, void 0, void 0, function () {
        var _a, response;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setMenuItem(item);
                    _a = item;
                    switch (_a) {
                        case 'rename-filter': return [3 /*break*/, 1];
                        case 'delete-filter': return [3 /*break*/, 2];
                        case 'update-filter': return [3 /*break*/, 4];
                        case 'save-filter': return [3 /*break*/, 6];
                        case 'reload-filter': return [3 /*break*/, 7];
                        case 'clear-filter': return [3 /*break*/, 8];
                    }
                    return [3 /*break*/, 9];
                case 1:
                    setErr(null);
                    setAdding(false);
                    setMenuOpen(false);
                    setNameOpen(true);
                    return [3 /*break*/, 9];
                case 2:
                    setMenuOpen(false);
                    return [4 /*yield*/, (0, fetch_1.send)('filter-delete', id)];
                case 3:
                    _c.sent();
                    onClearFilters();
                    return [3 /*break*/, 9];
                case 4:
                    setErr(null);
                    setAdding(false);
                    setMenuOpen(false);
                    originalSavedFilter.current = {
                        conditions: conditions,
                        conditionsOp: conditionsOp,
                        id: filterId === null || filterId === void 0 ? void 0 : filterId.id,
                        name: (_b = filterId === null || filterId === void 0 ? void 0 : filterId.name) !== null && _b !== void 0 ? _b : '',
                        status: 'saved',
                    };
                    return [4 /*yield*/, (0, fetch_1.sendCatch)('filter-update', {
                            state: originalSavedFilter.current,
                            filters: __spreadArray([], savedFilters, true),
                        })];
                case 5:
                    response = _c.sent();
                    if (response.error) {
                        setErr(response.error.message);
                        setNameOpen(true);
                        return [2 /*return*/];
                    }
                    onReloadSavedFilter(originalSavedFilter.current, 'update');
                    return [3 /*break*/, 9];
                case 6:
                    setErr(null);
                    setAdding(true);
                    setMenuOpen(false);
                    setNameOpen(true);
                    return [3 /*break*/, 9];
                case 7:
                    setMenuOpen(false);
                    if (originalSavedFilter.current) {
                        originalSavedFilter.current = __assign(__assign({}, originalSavedFilter.current), { status: 'saved' });
                        onReloadSavedFilter(originalSavedFilter.current, 'reload');
                    }
                    return [3 /*break*/, 9];
                case 8:
                    setMenuOpen(false);
                    onClearFilters();
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    function onAddUpdate() {
        return __awaiter(this, void 0, void 0, function () {
            var newSavedFilter, response_1, updatedFilter, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!adding) return [3 /*break*/, 2];
                        newSavedFilter = {
                            conditions: conditions,
                            conditionsOp: conditionsOp,
                            name: name,
                            status: 'saved',
                        };
                        return [4 /*yield*/, (0, fetch_1.sendCatch)('filter-create', {
                                state: newSavedFilter,
                                filters: __spreadArray([], savedFilters, true),
                            })];
                    case 1:
                        response_1 = _a.sent();
                        if (response_1.error) {
                            setErr(response_1.error.message);
                            setNameOpen(true);
                            return [2 /*return*/];
                        }
                        setNameOpen(false);
                        onReloadSavedFilter(__assign(__assign({}, newSavedFilter), { id: response_1.data }));
                        return [2 /*return*/];
                    case 2:
                        updatedFilter = {
                            conditions: filterId === null || filterId === void 0 ? void 0 : filterId.conditions,
                            conditionsOp: filterId === null || filterId === void 0 ? void 0 : filterId.conditionsOp,
                            id: filterId === null || filterId === void 0 ? void 0 : filterId.id,
                            name: name,
                        };
                        return [4 /*yield*/, (0, fetch_1.sendCatch)('filter-update', {
                                state: updatedFilter,
                                filters: __spreadArray([], savedFilters, true),
                            })];
                    case 3:
                        response = _a.sent();
                        if (response.error) {
                            setErr(response.error.message);
                            setNameOpen(true);
                            return [2 /*return*/];
                        }
                        setNameOpen(false);
                        onReloadSavedFilter(updatedFilter);
                        return [2 /*return*/];
                }
            });
        });
    }
    return (<view_1.View>
      {conditions.length > 0 && (<button_1.Button ref={triggerRef} variant="bare" style={{ marginTop: 10 }} onPress={function () {
                setMenuOpen(true);
            }}>
          <text_1.Text style={{
                maxWidth: 150,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                flexShrink: 0,
            }}>
            {!(filterId === null || filterId === void 0 ? void 0 : filterId.id) ? t('Unsaved filter') : filterId === null || filterId === void 0 ? void 0 : filterId.name}&nbsp;
          </text_1.Text>
          {(filterId === null || filterId === void 0 ? void 0 : filterId.id) && (filterId === null || filterId === void 0 ? void 0 : filterId.status) !== 'saved' && (<text_1.Text>
              <react_i18next_1.Trans>(modified)</react_i18next_1.Trans>&nbsp;
            </text_1.Text>)}
          <v0_1.SvgExpandArrow width={8} height={8} style={{ marginRight: 5 }}/>
        </button_1.Button>)}

      <popover_1.Popover triggerRef={triggerRef} isOpen={menuOpen} onOpenChange={function () { return setMenuOpen(false); }} style={{ width: 200 }}>
        <FilterMenu_1.FilterMenu filterId={filterId} onFilterMenuSelect={onFilterMenuSelect}/>
      </popover_1.Popover>

      <popover_1.Popover triggerRef={triggerRef} isOpen={nameOpen} onOpenChange={function () { return setNameOpen(false); }} style={{ width: 325 }}>
        <NameFilter_1.NameFilter menuItem={menuItem} name={name} setName={setName} adding={adding} onAddUpdate={onAddUpdate} err={err}/>
      </popover_1.Popover>
    </view_1.View>);
}
