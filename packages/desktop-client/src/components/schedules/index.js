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
exports.Schedules = Schedules;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var query_1 = require("loot-core/shared/query");
var SchedulesTable_1 = require("./SchedulesTable");
var Search_1 = require("@desktop-client/components/common/Search");
var Page_1 = require("@desktop-client/components/Page");
var useSchedules_1 = require("@desktop-client/hooks/useSchedules");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
function Schedules() {
    var _this = this;
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var _a = (0, react_1.useState)(''), filter = _a[0], setFilter = _a[1];
    var onEdit = (0, react_1.useCallback)(function (id) {
        dispatch((0, modalsSlice_1.pushModal)({ modal: { name: 'schedule-edit', options: { id: id } } }));
    }, [dispatch]);
    var onAdd = (0, react_1.useCallback)(function () {
        dispatch((0, modalsSlice_1.pushModal)({ modal: { name: 'schedule-edit', options: {} } }));
    }, [dispatch]);
    var onDiscover = (0, react_1.useCallback)(function () {
        dispatch((0, modalsSlice_1.pushModal)({ modal: { name: 'schedules-discover' } }));
    }, [dispatch]);
    var onChangeUpcomingLength = (0, react_1.useCallback)(function () {
        dispatch((0, modalsSlice_1.pushModal)({ modal: { name: 'schedules-upcoming-length' } }));
    }, [dispatch]);
    var onAction = (0, react_1.useCallback)(function (name, id) { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = name;
                    switch (_a) {
                        case 'post-transaction': return [3 /*break*/, 1];
                        case 'post-transaction-today': return [3 /*break*/, 3];
                        case 'skip': return [3 /*break*/, 5];
                        case 'complete': return [3 /*break*/, 7];
                        case 'restart': return [3 /*break*/, 9];
                        case 'delete': return [3 /*break*/, 11];
                    }
                    return [3 /*break*/, 13];
                case 1: return [4 /*yield*/, (0, fetch_1.send)('schedule/post-transaction', { id: id })];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 3: return [4 /*yield*/, (0, fetch_1.send)('schedule/post-transaction', { id: id, today: true })];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 5: return [4 /*yield*/, (0, fetch_1.send)('schedule/skip-next-date', { id: id })];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 7: return [4 /*yield*/, (0, fetch_1.send)('schedule/update', {
                        schedule: { id: id, completed: true },
                    })];
                case 8:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 9: return [4 /*yield*/, (0, fetch_1.send)('schedule/update', {
                        schedule: { id: id, completed: false },
                        resetNextDate: true,
                    })];
                case 10:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 11: return [4 /*yield*/, (0, fetch_1.send)('schedule/delete', { id: id })];
                case 12:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 13: throw new Error("Unknown action: ".concat(name));
                case 14: return [2 /*return*/];
            }
        });
    }); }, []);
    var schedulesQuery = (0, react_1.useMemo)(function () { return (0, query_1.q)('schedules').select('*'); }, []);
    var _b = (0, useSchedules_1.useSchedules)({ query: schedulesQuery }), isSchedulesLoading = _b.isLoading, schedules = _b.schedules, statuses = _b.statuses;
    return (<Page_1.Page header={t('Schedules')}>
      <view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: '0 0 15px',
        }}>
        <view_1.View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
        }}>
          <Search_1.Search placeholder={t('Filter schedules…')} value={filter} onChange={setFilter}/>
        </view_1.View>
      </view_1.View>

      <SchedulesTable_1.SchedulesTable isLoading={isSchedulesLoading} schedules={schedules} filter={filter} statuses={statuses} allowCompleted={true} onSelect={onEdit} onAction={onAction} style={{ backgroundColor: theme_1.theme.tableBackground }}/>

      <view_1.View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: '20px 0',
            flexShrink: 0,
        }}>
        <view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: '1em',
        }}>
          <button_1.Button onPress={onDiscover}>
            <react_i18next_1.Trans>Find schedules</react_i18next_1.Trans>
          </button_1.Button>
          <button_1.Button onPress={onChangeUpcomingLength}>
            <react_i18next_1.Trans>Change upcoming length</react_i18next_1.Trans>
          </button_1.Button>
        </view_1.View>
        <button_1.Button variant="primary" onPress={onAdd}>
          <react_i18next_1.Trans>Add new schedule</react_i18next_1.Trans>
        </button_1.Button>
      </view_1.View>
    </Page_1.Page>);
}
