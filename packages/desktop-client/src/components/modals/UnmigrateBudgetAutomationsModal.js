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
exports.UnmigrateBudgetAutomationsModal = UnmigrateBudgetAutomationsModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var AnimatedLoading_1 = require("@actual-app/components/icons/AnimatedLoading");
var stack_1 = require("@actual-app/components/stack");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var Link_1 = require("@desktop-client/components/common/Link");
var Modal_1 = require("@desktop-client/components/common/Modal");
var Notes_1 = require("@desktop-client/components/Notes");
var useCategory_1 = require("@desktop-client/hooks/useCategory");
var useNotes_1 = require("@desktop-client/hooks/useNotes");
function UnmigrateBudgetAutomationsModal(_a) {
    var _this = this;
    var categoryId = _a.categoryId, templates = _a.templates;
    var t = (0, react_i18next_1.useTranslation)().t;
    var category = (0, useCategory_1.useCategory)(categoryId);
    var existingNotes = (0, useNotes_1.useNotes)(categoryId) || '';
    var _b = (0, react_1.useState)(''), editedNotes = _b[0], setEditedNotes = _b[1];
    var _c = (0, react_1.useState)(null), rendered = _c[0], setRendered = _c[1];
    var _d = (0, react_1.useState)(false), saving = _d[0], setSaving = _d[1];
    (0, react_1.useEffect)(function () {
        var mounted = true;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var text, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, fetch_1.send)('budget/render-note-templates', templates)];
                    case 1:
                        text = _a.sent();
                        if (mounted)
                            setRendered(text);
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        if (mounted)
                            setRendered('');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
        return function () {
            mounted = false;
        };
    }, [templates]);
    // Seed editable notes once templates rendered
    (0, react_1.useEffect)(function () {
        if (rendered !== null) {
            var base = existingNotes.trimEnd();
            if (!rendered) {
                setEditedNotes(base);
                return;
            }
            var existingLineSet = new Set(base
                .split('\n')
                .map(function (l) { return l.trim(); })
                .filter(function (l) { return l.length > 0; }));
            var renderedLines = rendered
                .split('\n')
                .map(function (l) { return l.trimEnd(); })
                .filter(function (l) { return l.length > 0; });
            var newLines = [];
            for (var _i = 0, renderedLines_1 = renderedLines; _i < renderedLines_1.length; _i++) {
                var line = renderedLines_1[_i];
                if (!existingLineSet.has(line.trim())) {
                    newLines.push(line);
                }
            }
            if (newLines.length === 0) {
                setEditedNotes(base);
            }
            else {
                var needsNewline = base && !base.endsWith('\n') ? '\n' : '';
                setEditedNotes(base +
                    needsNewline +
                    '\nExport from automations UI:\n' +
                    newLines.join('\n'));
            }
        }
    }, [rendered, existingNotes]);
    function onSave(close) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setSaving(true);
                        return [4 /*yield*/, (0, fetch_1.send)('notes-save-undoable', { id: categoryId, note: editedNotes })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, fetch_1.send)('budget/set-category-automations', {
                                categoriesWithTemplates: [{ id: categoryId, templates: templates }],
                                source: 'notes',
                            })];
                    case 2:
                        _a.sent();
                        setSaving(false);
                        close();
                        return [2 /*return*/];
                }
            });
        });
    }
    return (<Modal_1.Modal name="category-automations-unmigrate" containerProps={{
            style: { width: 850, height: 650, paddingBottom: 20 },
        }}>
      {function (_a) {
            var close = _a.state.close;
            return (<stack_1.Stack direction="column" style={{ height: '100%' }} spacing={3}>
          <Modal_1.ModalHeader title={t('Un-migrate automations: {{category}}', {
                    category: category === null || category === void 0 ? void 0 : category.name,
                })} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          {rendered === null ? (<view_1.View style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
              <AnimatedLoading_1.AnimatedLoading style={{ width: 20, height: 20 }}/>
            </view_1.View>) : (<stack_1.Stack spacing={3} style={{ overflowY: 'auto', flex: 1 }}>
              <view_1.View style={{ display: 'inline-block', minHeight: 'unset' }}>
                <react_i18next_1.Trans>
                  If the automation UI isn&apos;t working for you, you can
                  temporarily switch back to notes-based automations. Please let
                  us know your feedback about what&apos;s not working on the{' '}
                  <Link_1.Link variant="external" to="https://github.com/actualbudget/actual/issues/">
                    feedback issue
                  </Link_1.Link>
                  .
                </react_i18next_1.Trans>
              </view_1.View>
              <view_1.View>
                <react_i18next_1.Trans>
                  We have merged your existing automations with the notes for
                  this category. Please review and edit as needed.
                </react_i18next_1.Trans>
              </view_1.View>
              <Notes_1.Notes notes={editedNotes} editable focused getStyle={function () { return ({
                        flex: 1,
                        borderRadius: 6,
                        display: 'flex',
                        flexDirection: 'column',
                        resize: 'none',
                    }); }} onChange={setEditedNotes}/>
            </stack_1.Stack>)}
          <stack_1.Stack direction="row" justify="flex-end" spacing={2}>
            <button_1.Button onPress={function () { return close(); }}>
              <react_i18next_1.Trans>Cancel</react_i18next_1.Trans>
            </button_1.Button>
            <button_1.Button variant="primary" onPress={function () { return onSave(close); }} isDisabled={saving}>
              {saving && (<AnimatedLoading_1.AnimatedLoading style={{ width: 16, height: 16, marginRight: 6 }}/>)}
              <react_i18next_1.Trans>Save notes & un-migrate</react_i18next_1.Trans>
            </button_1.Button>
          </stack_1.Stack>
        </stack_1.Stack>);
        }}
    </Modal_1.Modal>);
}
