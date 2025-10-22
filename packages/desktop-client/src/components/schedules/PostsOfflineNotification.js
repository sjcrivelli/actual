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
exports.PostsOfflineNotification = PostsOfflineNotification;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_router_1 = require("react-router");
var button_1 = require("@actual-app/components/button");
var paragraph_1 = require("@actual-app/components/paragraph");
var stack_1 = require("@actual-app/components/stack");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var fetch_1 = require("loot-core/platform/client/fetch");
var Modal_1 = require("@desktop-client/components/common/Modal");
var DisplayId_1 = require("@desktop-client/components/util/DisplayId");
var useFormatList_1 = require("@desktop-client/hooks/useFormatList");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
function PostsOfflineNotification() {
    var _a = (0, react_i18next_1.useTranslation)(), t = _a.t, i18n = _a.i18n;
    var location = (0, react_router_1.useLocation)();
    var dispatch = (0, redux_1.useDispatch)();
    var locationState = location.state;
    var payees = locationState && 'payees' in locationState
        ? locationState.payees
        : [];
    function onPost() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.send)('schedule/force-run-service')];
                    case 1:
                        _a.sent();
                        dispatch((0, modalsSlice_1.popModal)());
                        return [2 /*return*/];
                }
            });
        });
    }
    var payeesList = payees.map(function (id) { return (<text_1.Text key={id} style={{ color: theme_1.theme.pageTextPositive }}>
      <DisplayId_1.DisplayId id={id} type="payees"/>
    </text_1.Text>); });
    var payeeNamesList = (0, useFormatList_1.useFormatList)(payeesList, i18n.language);
    return (<Modal_1.Modal name="schedule-posts-offline-notification">
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Post transactions?')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <paragraph_1.Paragraph>
            <text_1.Text>
              {payees.length > 0 ? (<react_i18next_1.Trans count={payees.length}>
                  The payees <span>{payeeNamesList}</span> have schedules that
                  are due today.
                </react_i18next_1.Trans>) : (t('There are payees that have schedules that are due today.', {
                    count: payees.length,
                }))}{' '}
              <react_i18next_1.Trans>
                Usually we automatically post transactions for these, but you
                are offline or syncing failed. In order to avoid duplicate
                transactions, we let you choose whether or not to create
                transactions for these schedules.
              </react_i18next_1.Trans>
            </text_1.Text>
          </paragraph_1.Paragraph>
          <paragraph_1.Paragraph>
            <react_i18next_1.Trans>
              Be aware that other devices may have already created these
              transactions. If you have multiple devices, make sure you only do
              this on one device or you will have duplicate transactions.
            </react_i18next_1.Trans>
          </paragraph_1.Paragraph>
          <paragraph_1.Paragraph>
            <react_i18next_1.Trans>
              You can always manually post a transaction later for a due
              schedule by selecting the schedule and clicking “Post transaction
              today” in the action menu.
            </react_i18next_1.Trans>
          </paragraph_1.Paragraph>
          <stack_1.Stack direction="row" justify="flex-end" style={{ marginTop: 20 }} spacing={2}>
            <button_1.Button onPress={close}>
              <react_i18next_1.Trans>Decide later</react_i18next_1.Trans>
            </button_1.Button>
            <button_1.Button variant="primary" autoFocus onPress={function () {
                    onPost();
                    close();
                }}>
              <react_i18next_1.Trans>Post transactions</react_i18next_1.Trans>
            </button_1.Button>
          </stack_1.Stack>
        </>);
        }}
    </Modal_1.Modal>);
}
