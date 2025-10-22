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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveReport = SaveReport;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v0_1 = require("@actual-app/components/icons/v0");
var popover_1 = require("@actual-app/components/popover");
var text_1 = require("@actual-app/components/text");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var SaveReportChoose_1 = require("./SaveReportChoose");
var SaveReportDelete_1 = require("./SaveReportDelete");
var SaveReportMenu_1 = require("./SaveReportMenu");
var SaveReportName_1 = require("./SaveReportName");
var useReports_1 = require("@desktop-client/hooks/useReports");
function SaveReport(_a) {
    var _this = this;
    var _b;
    var customReportItems = _a.customReportItems, report = _a.report, savedStatus = _a.savedStatus, onReportChange = _a.onReportChange;
    var listReports = (0, useReports_1.useReports)().data;
    var triggerRef = (0, react_1.useRef)(null);
    var _c = (0, react_1.useState)(false), deleteMenuOpen = _c[0], setDeleteMenuOpen = _c[1];
    var _d = (0, react_1.useState)(false), nameMenuOpen = _d[0], setNameMenuOpen = _d[1];
    var _e = (0, react_1.useState)(false), menuOpen = _e[0], setMenuOpen = _e[1];
    var _f = (0, react_1.useState)(false), chooseMenuOpen = _f[0], setChooseMenuOpen = _f[1];
    var _g = (0, react_1.useState)(''), menuItem = _g[0], setMenuItem = _g[1];
    var _h = (0, react_1.useState)(''), err = _h[0], setErr = _h[1];
    var _j = (0, react_1.useState)((_b = report.name) !== null && _b !== void 0 ? _b : ''), newName = _j[0], setNewName = _j[1];
    var inputRef = (0, react_1.createRef)();
    function onApply(cond) {
        return __awaiter(this, void 0, void 0, function () {
            var chooseSavedReport;
            return __generator(this, function (_a) {
                chooseSavedReport = listReports.find(function (r) { return cond === r.id; });
                onReportChange({ savedReport: chooseSavedReport, type: 'choose' });
                setChooseMenuOpen(false);
                setNewName(chooseSavedReport === undefined ? '' : chooseSavedReport.name);
                return [2 /*return*/];
            });
        });
    }
    var onAddUpdate = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var newSavedReport, response_1, name, id, props, updatedReport, response;
        var menuChoice = _b.menuChoice;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!menuChoice) {
                        return [2 /*return*/, null];
                    }
                    if (!(menuChoice === 'save-report')) return [3 /*break*/, 3];
                    newSavedReport = __assign(__assign(__assign({}, report), customReportItems), { name: newName });
                    return [4 /*yield*/, (0, fetch_1.sendCatch)('report/create', newSavedReport)];
                case 1:
                    response_1 = _c.sent();
                    if (response_1.error) {
                        setErr(response_1.error.message);
                        setNameMenuOpen(true);
                        return [2 /*return*/];
                    }
                    // Add to dashboard
                    return [4 /*yield*/, (0, fetch_1.send)('dashboard-add-widget', {
                            type: 'custom-report',
                            width: 4,
                            height: 2,
                            meta: { id: response_1.data },
                        })];
                case 2:
                    // Add to dashboard
                    _c.sent();
                    setNameMenuOpen(false);
                    onReportChange({
                        savedReport: __assign(__assign({}, newSavedReport), { id: response_1.data }),
                        type: 'add-update',
                    });
                    return [2 /*return*/];
                case 3:
                    name = customReportItems.name, id = customReportItems.id, props = __rest(customReportItems, ["name", "id"]);
                    updatedReport = __assign(__assign({}, report), (menuChoice === 'rename-report' ? { name: newName } : props));
                    return [4 /*yield*/, (0, fetch_1.sendCatch)('report/update', updatedReport)];
                case 4:
                    response = _c.sent();
                    if (response.error) {
                        setErr(response.error.message);
                        setNameMenuOpen(true);
                        return [2 /*return*/];
                    }
                    setNameMenuOpen(false);
                    onReportChange({
                        savedReport: updatedReport,
                        type: menuChoice === 'rename-report' ? 'rename' : 'add-update',
                    });
                    return [2 /*return*/];
            }
        });
    }); };
    var onDelete = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setNewName('');
                    return [4 /*yield*/, (0, fetch_1.send)('report/delete', report.id)];
                case 1:
                    _a.sent();
                    onReportChange({ type: 'reset' });
                    setDeleteMenuOpen(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var onMenuSelect = function (item) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setMenuItem(item);
            switch (item) {
                case 'rename-report':
                    setErr('');
                    setMenuOpen(false);
                    setNameMenuOpen(true);
                    break;
                case 'delete-report':
                    setMenuOpen(false);
                    setDeleteMenuOpen(true);
                    break;
                case 'update-report':
                    setErr('');
                    setMenuOpen(false);
                    onAddUpdate({ menuChoice: item });
                    break;
                case 'save-report':
                    setErr('');
                    setMenuOpen(false);
                    setNameMenuOpen(true);
                    break;
                case 'reload-report':
                    setMenuOpen(false);
                    onReportChange({ type: 'reload' });
                    break;
                case 'reset-report':
                    setMenuOpen(false);
                    setNewName('');
                    onReportChange({ type: 'reset' });
                    break;
                case 'choose-report':
                    setErr('');
                    setMenuOpen(false);
                    setChooseMenuOpen(true);
                    break;
                default:
            }
            return [2 /*return*/];
        });
    }); };
    return (<view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
        }}>
      <button_1.Button ref={triggerRef} variant="bare" onPress={function () {
            setMenuOpen(true);
        }}>
        <text_1.Text style={{
            maxWidth: 150,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flexShrink: 0,
        }}>
          {!report.id ? <react_i18next_1.Trans>Unsaved report</react_i18next_1.Trans> : report.name}&nbsp;
        </text_1.Text>
        {savedStatus === 'modified' && <text_1.Text>(modified)&nbsp;</text_1.Text>}
        <v0_1.SvgExpandArrow width={8} height={8} style={{ marginRight: 5 }}/>
      </button_1.Button>

      <popover_1.Popover triggerRef={triggerRef} isOpen={menuOpen} onOpenChange={function () { return setMenuOpen(false); }} style={{ width: 150 }}>
        <SaveReportMenu_1.SaveReportMenu onMenuSelect={onMenuSelect} savedStatus={savedStatus} listReports={listReports && listReports.length}/>
      </popover_1.Popover>

      <popover_1.Popover triggerRef={triggerRef} isOpen={nameMenuOpen} onOpenChange={function () { return setNameMenuOpen(false); }} style={{ width: 325 }}>
        <SaveReportName_1.SaveReportName menuItem={menuItem} name={newName} setName={setNewName} inputRef={inputRef} onAddUpdate={onAddUpdate} err={err}/>
      </popover_1.Popover>

      <popover_1.Popover triggerRef={triggerRef} isOpen={chooseMenuOpen} onOpenChange={function () { return setChooseMenuOpen(false); }} style={{ padding: 15 }}>
        <SaveReportChoose_1.SaveReportChoose onApply={onApply}/>
      </popover_1.Popover>

      <popover_1.Popover triggerRef={triggerRef} isOpen={deleteMenuOpen} onOpenChange={function () { return setDeleteMenuOpen(false); }} style={{ width: 275, padding: 15 }}>
        <SaveReportDelete_1.SaveReportDelete onDelete={onDelete} onClose={function () { return setDeleteMenuOpen(false); }} name={report.name}/>
      </popover_1.Popover>
    </view_1.View>);
}
