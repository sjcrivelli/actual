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
exports.Overview = Overview;
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
var react_grid_layout_1 = require("react-grid-layout");
var react_hotkeys_hook_1 = require("react-hotkeys-hook");
var react_i18next_1 = require("react-i18next");
var react_router_1 = require("react-router");
var button_1 = require("@actual-app/components/button");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var v1_1 = require("@actual-app/components/icons/v1");
var menu_1 = require("@actual-app/components/menu");
var popover_1 = require("@actual-app/components/popover");
var tokens_1 = require("@actual-app/components/tokens");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var constants_1 = require("./constants");
var LoadingIndicator_1 = require("./LoadingIndicator");
var CalendarCard_1 = require("./reports/CalendarCard");
var CashFlowCard_1 = require("./reports/CashFlowCard");
var CustomReportListCards_1 = require("./reports/CustomReportListCards");
var MarkdownCard_1 = require("./reports/MarkdownCard");
var NetWorthCard_1 = require("./reports/NetWorthCard");
var SpendingCard_1 = require("./reports/SpendingCard");
require("./overview.scss");
var SummaryCard_1 = require("./reports/SummaryCard");
var MobileNavTabs_1 = require("@desktop-client/components/mobile/MobileNavTabs");
var Page_1 = require("@desktop-client/components/Page");
var useAccounts_1 = require("@desktop-client/hooks/useAccounts");
var useDashboard_1 = require("@desktop-client/hooks/useDashboard");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var useReports_1 = require("@desktop-client/hooks/useReports");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
var useUndo_1 = require("@desktop-client/hooks/useUndo");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var redux_1 = require("@desktop-client/redux");
var ResponsiveGridLayout = (0, react_grid_layout_1.WidthProvider)(react_grid_layout_1.Responsive);
function isCustomReportWidget(widget) {
    return widget.type === 'custom-report';
}
function Overview() {
    var _this = this;
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var _firstDayOfWeekIdx = (0, useSyncedPref_1.useSyncedPref)('firstDayOfWeekIdx')[0];
    var firstDayOfWeekIdx = _firstDayOfWeekIdx || '0';
    var _a = (0, react_1.useState)(false), isImporting = _a[0], setIsImporting = _a[1];
    var _b = (0, react_1.useState)(false), isEditing = _b[0], setIsEditing = _b[1];
    var _c = (0, react_1.useState)('desktop'), currentBreakpoint = _c[0], setCurrentBreakpoint = _c[1];
    var _d = (0, useReports_1.useReports)(), customReports = _d.data, isCustomReportsLoading = _d.isLoading;
    var _e = (0, useDashboard_1.useDashboard)(), widgets = _e.data, isWidgetsLoading = _e.isLoading;
    var customReportMap = (0, react_1.useMemo)(function () { return new Map(customReports.map(function (report) { return [report.id, report]; })); }, [customReports]);
    var isLoading = isCustomReportsLoading || isWidgetsLoading;
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var navigate = (0, useNavigate_1.useNavigate)();
    var location = (0, react_router_1.useLocation)();
    sessionStorage.setItem('url', location.pathname);
    var mobileLayout = (0, react_1.useMemo)(function () {
        if (!widgets || widgets.length === 0) {
            return [];
        }
        var sortedDesktopItems = __spreadArray([], widgets, true);
        // Sort to ensure that items are ordered top-to-bottom, and for items on the same row, left-to-right
        sortedDesktopItems.sort(function (a, b) {
            if (a.y < b.y)
                return -1;
            if (a.y > b.y)
                return 1;
            if (a.x < b.x)
                return -1;
            if (a.x > b.x)
                return 1;
            return 0;
        });
        var currentY = 0;
        return sortedDesktopItems.map(function (widget) {
            var itemY = currentY;
            currentY += widget.height;
            return __assign(__assign({}, widget), { i: widget.id, x: 0, y: itemY, w: 1, h: widget.height });
        });
    }, [widgets]);
    var desktopLayout = (0, react_1.useMemo)(function () {
        if (!widgets)
            return [];
        return widgets.map(function (widget) { return (__assign({ i: widget.id, w: widget.width, h: widget.height, minW: isCustomReportWidget(widget) || widget.type === 'markdown-card' ? 2 : 3, minH: isCustomReportWidget(widget) || widget.type === 'markdown-card' ? 1 : 2 }, widget)); });
    }, [widgets]);
    var closeNotifications = function () {
        dispatch((0, notificationsSlice_1.removeNotification)({ id: 'import' }));
    };
    // Close import notifications when doing "undo" operation
    (0, react_hotkeys_hook_1.useHotkeys)('ctrl+z, cmd+z, meta+z', closeNotifications, {
        scopes: ['app'],
    }, [closeNotifications]);
    var undo = (0, useUndo_1.useUndo)().undo;
    var onDispatchSucessNotification = function (message) {
        dispatch((0, notificationsSlice_1.addNotification)({
            notification: {
                id: 'import',
                type: 'message',
                sticky: true,
                timeout: 30000, // 30s
                message: message,
                messageActions: {
                    undo: function () {
                        closeNotifications();
                        undo();
                    },
                },
            },
        }));
    };
    var onBreakpointChange = function (breakpoint) {
        setCurrentBreakpoint(breakpoint);
    };
    var onResetDashboard = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsImporting(true);
                    return [4 /*yield*/, (0, fetch_1.send)('dashboard-reset')];
                case 1:
                    _a.sent();
                    setIsImporting(false);
                    onDispatchSucessNotification(t('Dashboard has been successfully reset to default state. Don’t like what you see? You can always press [ctrl+z](#undo) to undo.'));
                    return [2 /*return*/];
            }
        });
    }); };
    var onLayoutChange = function (newLayout) {
        if (!isEditing) {
            return;
        }
        (0, fetch_1.send)('dashboard-update', newLayout.map(function (item) { return ({
            id: item.i,
            width: item.w,
            height: item.h,
            x: item.x,
            y: item.y,
        }); }));
    };
    var onAddWidget = function (type, meta) {
        if (meta === void 0) { meta = null; }
        (0, fetch_1.send)('dashboard-add-widget', {
            type: type,
            width: 4,
            height: 2,
            meta: meta,
        });
    };
    var onRemoveWidget = function (widgetId) {
        (0, fetch_1.send)('dashboard-remove-widget', widgetId);
    };
    var onExport = function () {
        var widgetMap = new Map(widgets.map(function (item) { return [item.id, item]; }));
        var data = {
            version: 1,
            widgets: desktopLayout.map(function (item) {
                var widget = widgetMap.get(item.i);
                if (!widget) {
                    throw new Error("Unable to query widget: ".concat(item.i));
                }
                if (isCustomReportWidget(widget)) {
                    var customReport = customReportMap.get(widget.meta.id);
                    if (!customReport) {
                        throw new Error("Custom report not found for widget: ".concat(item.i));
                    }
                    return __assign(__assign({}, widget), { meta: customReport, id: undefined, tombstone: undefined });
                }
                return __assign(__assign({}, widget), { id: undefined, tombstone: undefined });
            }),
        };
        window.Actual.saveFile(JSON.stringify(data, null, 2), 'dashboard.json', t('Export Dashboard'));
    };
    var onImport = function () { return __awaiter(_this, void 0, void 0, function () {
        var openFileDialog, filepath, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    openFileDialog = window.Actual.openFileDialog;
                    if (!openFileDialog) {
                        dispatch((0, notificationsSlice_1.addNotification)({
                            notification: {
                                type: 'error',
                                message: t('Fatal error occurred: unable to open import file dialog.'),
                            },
                        }));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, openFileDialog({
                            properties: ['openFile'],
                            filters: [
                                {
                                    name: 'JSON files',
                                    extensions: ['json'],
                                },
                            ],
                        })];
                case 1:
                    filepath = (_a.sent())[0];
                    closeNotifications();
                    setIsImporting(true);
                    return [4 /*yield*/, (0, fetch_1.send)('dashboard-import', { filepath: filepath })];
                case 2:
                    res = _a.sent();
                    setIsImporting(false);
                    if ('error' in res) {
                        switch (res.error) {
                            case 'json-parse-error':
                                dispatch((0, notificationsSlice_1.addNotification)({
                                    notification: {
                                        id: 'import',
                                        type: 'error',
                                        message: t('Failed parsing the imported JSON.'),
                                    },
                                }));
                                break;
                            case 'validation-error':
                                dispatch((0, notificationsSlice_1.addNotification)({
                                    notification: {
                                        id: 'import',
                                        type: 'error',
                                        message: res.message,
                                    },
                                }));
                                break;
                            default:
                                dispatch((0, notificationsSlice_1.addNotification)({
                                    notification: {
                                        id: 'import',
                                        type: 'error',
                                        message: t('Failed importing the dashboard file.'),
                                    },
                                }));
                                break;
                        }
                        return [2 /*return*/];
                    }
                    onDispatchSucessNotification(t('Dashboard has been successfully imported. Don’t like what you see? You can always press [ctrl+z](#undo) to undo.'));
                    return [2 /*return*/];
            }
        });
    }); };
    var onMetaChange = function (widget, newMeta) {
        (0, fetch_1.send)('dashboard-update-widget', {
            id: widget.i,
            meta: newMeta,
        });
    };
    var accounts = (0, useAccounts_1.useAccounts)();
    if (isLoading) {
        return <LoadingIndicator_1.LoadingIndicator message={t('Loading reports...')}/>;
    }
    return (<Page_1.Page header={isNarrowWidth ? (<Page_1.MobilePageHeader title={t('Reports')}/>) : (<view_1.View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginRight: 15,
            }}>
            <Page_1.PageHeader title={t('Reports')}/>

            <view_1.View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 5,
            }}>
              {currentBreakpoint === 'desktop' && (<>
                  <react_aria_components_1.DialogTrigger>
                    <button_1.Button variant="primary" isDisabled={isImporting}>
                      <react_i18next_1.Trans>Add new widget</react_i18next_1.Trans>
                    </button_1.Button>

                    <popover_1.Popover>
                      <react_aria_components_1.Dialog>
                        <menu_1.Menu slot="close" onMenuSelect={function (item) {
                    if (item === 'custom-report') {
                        navigate('/reports/custom');
                        return;
                    }
                    function isExistingCustomReport(name) {
                        return name.startsWith('custom-report-');
                    }
                    if (isExistingCustomReport(item)) {
                        var _a = item.split('custom-report-'), reportId = _a[1];
                        onAddWidget('custom-report', {
                            id: reportId,
                        });
                        return;
                    }
                    if (item === 'markdown-card') {
                        onAddWidget(item, {
                            content: "### ".concat(t('Text Widget'), "\n\n").concat(t('Edit this widget to change the **markdown** content.')),
                        });
                        return;
                    }
                    onAddWidget(item);
                }} items={__spreadArray(__spreadArray([
                    {
                        name: 'cash-flow-card',
                        text: t('Cash flow graph'),
                    },
                    {
                        name: 'net-worth-card',
                        text: t('Net worth graph'),
                    },
                    {
                        name: 'spending-card',
                        text: t('Spending analysis'),
                    },
                    {
                        name: 'markdown-card',
                        text: t('Text widget'),
                    },
                    {
                        name: 'summary-card',
                        text: t('Summary card'),
                    },
                    {
                        name: 'calendar-card',
                        text: t('Calendar card'),
                    },
                    {
                        name: 'custom-report',
                        text: t('New custom report'),
                    }
                ], (customReports.length
                    ? [menu_1.Menu.line]
                    : []), true), customReports.map(function (report) { return ({
                    name: "custom-report-".concat(report.id),
                    text: report.name,
                }); }), true)}/>
                      </react_aria_components_1.Dialog>
                    </popover_1.Popover>
                  </react_aria_components_1.DialogTrigger>

                  {isEditing ? (<button_1.Button isDisabled={isImporting} onPress={function () { return setIsEditing(false); }}>
                      <react_i18next_1.Trans>Finish editing dashboard</react_i18next_1.Trans>
                    </button_1.Button>) : (<button_1.Button isDisabled={isImporting} onPress={function () { return setIsEditing(true); }}>
                      <react_i18next_1.Trans>Edit dashboard</react_i18next_1.Trans>
                    </button_1.Button>)}

                  <react_aria_components_1.DialogTrigger>
                    <button_1.Button variant="bare" aria-label={t('Menu')}>
                      <v1_1.SvgDotsHorizontalTriple width={15} height={15} style={{ transform: 'rotateZ(90deg)' }}/>
                    </button_1.Button>
                    <popover_1.Popover>
                      <react_aria_components_1.Dialog>
                        <menu_1.Menu slot="close" onMenuSelect={function (item) {
                    switch (item) {
                        case 'reset':
                            onResetDashboard();
                            break;
                        case 'export':
                            onExport();
                            break;
                        case 'import':
                            onImport();
                            break;
                    }
                }} items={[
                    {
                        name: 'reset',
                        text: t('Reset to default'),
                        disabled: isImporting,
                    },
                    menu_1.Menu.line,
                    {
                        name: 'import',
                        text: t('Import'),
                        disabled: isImporting,
                    },
                    {
                        name: 'export',
                        text: t('Export'),
                        disabled: isImporting,
                    },
                ]}/>
                      </react_aria_components_1.Dialog>
                    </popover_1.Popover>
                  </react_aria_components_1.DialogTrigger>
                </>)}
            </view_1.View>
          </view_1.View>)} padding={10}>
      {isImporting ? (<LoadingIndicator_1.LoadingIndicator message={t('Import is running...')}/>) : (<div>
          <view_1.View data-testid="reports-overview" style={{ userSelect: 'none', paddingBottom: MobileNavTabs_1.MOBILE_NAV_HEIGHT }}>
            <ResponsiveGridLayout breakpoints={{ desktop: tokens_1.breakpoints.medium, mobile: 1 }} layouts={{ desktop: desktopLayout, mobile: mobileLayout }} onLayoutChange={currentBreakpoint === 'desktop' ? onLayoutChange : undefined} onBreakpointChange={onBreakpointChange} cols={{ desktop: 12, mobile: 1 }} rowHeight={100} draggableCancel={".".concat(constants_1.NON_DRAGGABLE_AREA_CLASS_NAME)} isDraggable={currentBreakpoint === 'desktop' && isEditing} isResizable={currentBreakpoint === 'desktop' && isEditing}>
              {desktopLayout.map(function (item) { return (<div key={item.i}>
                  {item.type === 'net-worth-card' ? (<NetWorthCard_1.NetWorthCard widgetId={item.i} isEditing={isEditing} accounts={accounts} meta={item.meta} onMetaChange={function (newMeta) { return onMetaChange(item, newMeta); }} onRemove={function () { return onRemoveWidget(item.i); }}/>) : item.type === 'cash-flow-card' ? (<CashFlowCard_1.CashFlowCard widgetId={item.i} isEditing={isEditing} meta={item.meta} onMetaChange={function (newMeta) { return onMetaChange(item, newMeta); }} onRemove={function () { return onRemoveWidget(item.i); }}/>) : item.type === 'spending-card' ? (<SpendingCard_1.SpendingCard widgetId={item.i} isEditing={isEditing} meta={item.meta} onMetaChange={function (newMeta) { return onMetaChange(item, newMeta); }} onRemove={function () { return onRemoveWidget(item.i); }}/>) : item.type === 'markdown-card' ? (<MarkdownCard_1.MarkdownCard isEditing={isEditing} meta={item.meta} onMetaChange={function (newMeta) { return onMetaChange(item, newMeta); }} onRemove={function () { return onRemoveWidget(item.i); }}/>) : item.type === 'custom-report' ? (<CustomReportListCards_1.CustomReportListCards isEditing={isEditing} report={customReportMap.get(item.meta.id)} onRemove={function () { return onRemoveWidget(item.i); }}/>) : item.type === 'summary-card' ? (<SummaryCard_1.SummaryCard widgetId={item.i} isEditing={isEditing} meta={item.meta} onMetaChange={function (newMeta) { return onMetaChange(item, newMeta); }} onRemove={function () { return onRemoveWidget(item.i); }}/>) : item.type === 'calendar-card' ? (<CalendarCard_1.CalendarCard widgetId={item.i} isEditing={isEditing} meta={item.meta} firstDayOfWeekIdx={firstDayOfWeekIdx} onMetaChange={function (newMeta) { return onMetaChange(item, newMeta); }} onRemove={function () { return onRemoveWidget(item.i); }}/>) : null}
                </div>); })}
            </ResponsiveGridLayout>
          </view_1.View>
        </div>)}
    </Page_1.Page>);
}
