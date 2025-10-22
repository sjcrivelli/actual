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
exports.ScheduleLink = ScheduleLink;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v0_1 = require("@actual-app/components/icons/v0");
var initial_focus_1 = require("@actual-app/components/initial-focus");
var text_1 = require("@actual-app/components/text");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var query_1 = require("loot-core/shared/query");
var SchedulesTable_1 = require("./SchedulesTable");
var Modal_1 = require("@desktop-client/components/common/Modal");
var Search_1 = require("@desktop-client/components/common/Search");
var useSchedules_1 = require("@desktop-client/hooks/useSchedules");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
function ScheduleLink(_a) {
    var ids = _a.transactionIds, getTransaction = _a.getTransaction, accountName = _a.accountName, onScheduleLinked = _a.onScheduleLinked;
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var _b = (0, react_1.useState)(accountName || ''), filter = _b[0], setFilter = _b[1];
    var schedulesQuery = (0, react_1.useMemo)(function () { return (0, query_1.q)('schedules').filter({ completed: false }).select('*'); }, []);
    var _c = (0, useSchedules_1.useSchedules)({ query: schedulesQuery }), isSchedulesLoading = _c.isLoading, schedules = _c.schedules, statuses = _c.statuses;
    var searchInput = (0, react_1.useRef)(null);
    function onSelect(scheduleId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!((ids === null || ids === void 0 ? void 0 : ids.length) > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, fetch_1.send)('transactions-batch-update', {
                                updated: ids.map(function (id) { return ({ id: id, schedule: scheduleId }); }),
                            })];
                    case 1:
                        _a.sent();
                        onScheduleLinked === null || onScheduleLinked === void 0 ? void 0 : onScheduleLinked(schedules.find(function (s) { return s.id === scheduleId; }));
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    }
    function onCreate() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                dispatch((0, modalsSlice_1.pushModal)({
                    modal: {
                        name: 'schedule-edit',
                        options: {
                            id: null,
                            transaction: getTransaction(ids[0]),
                        },
                    },
                }));
                return [2 /*return*/];
            });
        });
    }
    return (<Modal_1.Modal name="schedule-link" containerProps={{
            style: {
                width: 800,
            },
        }}>
      {function (_a) {
            var _b;
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Link schedule')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View style={{
                    flexDirection: 'row',
                    gap: 4,
                    marginBottom: 20,
                    alignItems: 'center',
                }}>
            <text_1.Text>
              {t('Choose the schedule these {{ count }} transactions belong to:', { count: (_b = ids === null || ids === void 0 ? void 0 : ids.length) !== null && _b !== void 0 ? _b : 0 })}
            </text_1.Text>
            <initial_focus_1.InitialFocus>
              <Search_1.Search inputRef={searchInput} isInModal width={300} placeholder={t('Filter schedules…')} value={filter} onChange={setFilter}/>
            </initial_focus_1.InitialFocus>
            {ids.length === 1 && (<button_1.Button variant="primary" style={{ marginLeft: 15, padding: '4px 10px' }} onPress={function () {
                        close();
                        onCreate();
                    }}>
                <v0_1.SvgAdd style={{ width: '20', padding: '3' }}/>
                <react_i18next_1.Trans>Create New</react_i18next_1.Trans>
              </button_1.Button>)}
          </view_1.View>

          <view_1.View style={{
                    flex: "1 1 ".concat((SchedulesTable_1.ROW_HEIGHT - 1) * (Math.max(schedules.length, 1) + 1), "px"),
                    marginTop: 15,
                    maxHeight: '50vh',
                }}>
            <SchedulesTable_1.SchedulesTable isLoading={isSchedulesLoading} allowCompleted={false} filter={filter} minimal={true} onAction={function () { }} onSelect={function (id) {
                    onSelect(id);
                    close();
                }} schedules={schedules} statuses={statuses} style={null}/>
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
