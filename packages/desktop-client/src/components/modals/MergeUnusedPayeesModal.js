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
exports.MergeUnusedPayeesModal = MergeUnusedPayeesModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var paragraph_1 = require("@actual-app/components/paragraph");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var alerts_1 = require("@desktop-client/components/alerts");
var Modal_1 = require("@desktop-client/components/common/Modal");
var usePayees_1 = require("@desktop-client/hooks/usePayees");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
var highlightStyle = { color: theme_1.theme.pageTextPositive };
function MergeUnusedPayeesModal(_a) {
    var _this = this;
    var payeeIds = _a.payeeIds, targetPayeeId = _a.targetPayeeId;
    var allPayees = (0, usePayees_1.usePayees)();
    var modalStack = (0, redux_1.useSelector)(function (state) { return state.modals.modalStack; });
    var isEditingRule = !!modalStack.find(function (m) { return m.name === 'edit-rule'; });
    var dispatch = (0, redux_1.useDispatch)();
    var _b = (0, react_1.useState)(true), shouldCreateRule = _b[0], setShouldCreateRule = _b[1];
    var flashRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        // Flash the scrollbar
        if (flashRef.current) {
            var el = flashRef.current;
            var top_1 = el.scrollTop;
            el.scrollTop = top_1 + 1;
            el.scrollTop = top_1;
        }
    }, []);
    // We store the orphaned payees into state because when we merge it,
    // it will be deleted and this component will automatically
    // rerender. Is there a better pattern for live bindings?
    //
    // TODO: I think a custom `useSelector` hook that doesn't bind would
    // be nice
    var payees = (0, react_1.useState)(function () {
        return allPayees.filter(function (p) { return payeeIds.includes(p.id); });
    })[0];
    var onMerge = (0, react_1.useCallback)(function (targetPayee) { return __awaiter(_this, void 0, void 0, function () {
        var ruleId, id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, fetch_1.send)('payees-merge', {
                        targetId: targetPayee.id,
                        mergeIds: payees.map(function (payee) { return payee.id; }),
                    })];
                case 1:
                    _a.sent();
                    if (!(shouldCreateRule && !isEditingRule)) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, fetch_1.send)('rule-add-payee-rename', {
                            fromNames: payees.map(function (payee) { return payee.name; }),
                            to: targetPayee.id,
                        })];
                case 2:
                    id = _a.sent();
                    ruleId = id;
                    _a.label = 3;
                case 3: return [2 /*return*/, ruleId];
            }
        });
    }); }, [shouldCreateRule, isEditingRule, payees]);
    var onMergeAndCreateRule = (0, react_1.useCallback)(function (targetPayee) { return __awaiter(_this, void 0, void 0, function () {
        var ruleId, rule;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, onMerge(targetPayee)];
                case 1:
                    ruleId = _a.sent();
                    if (!ruleId) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, fetch_1.send)('rule-get', { id: ruleId })];
                case 2:
                    rule = _a.sent();
                    if (!rule) {
                        return [2 /*return*/];
                    }
                    dispatch((0, modalsSlice_1.replaceModal)({ modal: { name: 'edit-rule', options: { rule: rule } } }));
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); }, [onMerge, dispatch]);
    var targetPayee = allPayees.find(function (p) { return p.id === targetPayeeId; });
    if (!targetPayee) {
        return null;
    }
    return (<Modal_1.Modal name="merge-unused-payees">
      {function (_a) {
            var close = _a.state.close;
            return (<view_1.View style={{ padding: 20, maxWidth: 500 }}>
          <view_1.View>
            <paragraph_1.Paragraph style={{ marginBottom: 10, fontWeight: 500 }}>
              {payees.length === 1 ? (<react_i18next_1.Trans>
                  The payee{' '}
                  <text_1.Text style={highlightStyle}>
                    {{ previousPayee: payees[0].name }}
                  </text_1.Text>{' '}
                  is not used by transactions any more. Would you like to merge
                  it with{' '}
                  <text_1.Text style={highlightStyle}>
                    {{ payee: targetPayee.name }}
                  </text_1.Text>
                  ?
                </react_i18next_1.Trans>) : (<>
                  <react_i18next_1.Trans>
                    The following payees are not used by transactions any more.
                    Would you like to merge them with{' '}
                    <text_1.Text style={highlightStyle}>
                      {{ payee: targetPayee.name }}
                    </text_1.Text>
                    ?
                  </react_i18next_1.Trans>
                  <ul ref={flashRef} style={{
                        margin: 0,
                        marginTop: 10,
                        maxHeight: 140,
                        overflow: 'auto',
                    }}>
                    {payees.map(function (payee) { return (<li key={payee.id}>
                        <text_1.Text style={highlightStyle}>{payee.name}</text_1.Text>
                      </li>); })}
                  </ul>
                </>)}
            </paragraph_1.Paragraph>

            <alerts_1.Information>
              <react_i18next_1.Trans>
                Merging will remove the payee and transfer any existing rules to
                the new payee.
              </react_i18next_1.Trans>
              {!isEditingRule && (<>
                  {' '}
                  <react_i18next_1.Trans>
                    If checked below, a rule will be created to do this rename
                    while importing transactions.
                  </react_i18next_1.Trans>
                </>)}
            </alerts_1.Information>

            {!isEditingRule && (<label style={{
                        fontSize: 13,
                        marginTop: 10,
                        color: theme_1.theme.pageTextLight,
                        userSelect: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                <input type="checkbox" checked={shouldCreateRule} onChange={function (e) { return setShouldCreateRule(e.target.checked); }}/>
                <text_1.Text style={{ marginLeft: 3 }}>
                  <react_i18next_1.Trans count={payees.length}>
                    Automatically rename these payees in the future
                  </react_i18next_1.Trans>
                </text_1.Text>
              </label>)}

            <Modal_1.ModalButtons style={{ marginTop: 20 }} focusButton>
              <button_1.Button variant="primary" autoFocus style={{ marginRight: 10 }} onPress={function () {
                    onMerge(targetPayee);
                    close();
                }}>
                <react_i18next_1.Trans>Merge</react_i18next_1.Trans>
              </button_1.Button>
              {!isEditingRule && (<button_1.Button style={{ marginRight: 10 }} onPress={function () {
                        onMergeAndCreateRule(targetPayee);
                        close();
                    }}>
                  <react_i18next_1.Trans>Merge and edit rule</react_i18next_1.Trans>
                </button_1.Button>)}
              <button_1.Button style={{ marginRight: 10 }} onPress={close}>
                <react_i18next_1.Trans>Do nothing</react_i18next_1.Trans>
              </button_1.Button>
            </Modal_1.ModalButtons>
          </view_1.View>
        </view_1.View>);
        }}
    </Modal_1.Modal>);
}
