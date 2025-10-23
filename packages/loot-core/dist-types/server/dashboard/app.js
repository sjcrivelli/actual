"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const isMatch_1 = __importDefault(require("lodash/isMatch"));
const exceptions_1 = require("../../platform/exceptions");
const fs = __importStar(require("../../platform/server/fs"));
const dashboard_1 = require("../../shared/dashboard");
const query_1 = require("../../shared/query");
const app_1 = require("../app");
const aql_1 = require("../aql");
const db = __importStar(require("../db"));
const errors_1 = require("../errors");
const models_1 = require("../models");
const mutators_1 = require("../mutators");
const app_2 = require("../reports/app");
const sync_1 = require("../sync");
const undo_1 = require("../undo");
function isExportedCustomReportWidget(widget) {
    return widget.type === 'custom-report';
}
const exportModel = {
    validate(dashboard) {
        (0, models_1.requiredFields)('Dashboard', dashboard, ['version', 'widgets']);
        if (!Array.isArray(dashboard.widgets)) {
            throw new errors_1.ValidationError('Invalid dashboard.widgets data type: it must be an array of widgets.');
        }
        dashboard.widgets.forEach((widget, idx) => {
            (0, models_1.requiredFields)(`Dashboard widget #${idx}`, widget, [
                'type',
                'x',
                'y',
                'width',
                'height',
                ...(isExportedCustomReportWidget(widget) ? ['meta'] : []),
            ]);
            if (!Number.isInteger(widget.x)) {
                throw new errors_1.ValidationError(`Invalid widget.${idx}.x data-type for value ${widget.x}.`);
            }
            if (!Number.isInteger(widget.y)) {
                throw new errors_1.ValidationError(`Invalid widget.${idx}.y data-type for value ${widget.y}.`);
            }
            if (!Number.isInteger(widget.width)) {
                throw new errors_1.ValidationError(`Invalid widget.${idx}.width data-type for value ${widget.width}.`);
            }
            if (!Number.isInteger(widget.height)) {
                throw new errors_1.ValidationError(`Invalid widget.${idx}.height data-type for value ${widget.height}.`);
            }
            if (![
                'net-worth-card',
                'cash-flow-card',
                'spending-card',
                'custom-report',
                'markdown-card',
                'summary-card',
                'calendar-card',
            ].includes(widget.type)) {
                throw new errors_1.ValidationError(`Invalid widget.${idx}.type value ${widget.type}.`);
            }
            if (isExportedCustomReportWidget(widget)) {
                app_2.reportModel.validate(widget.meta);
            }
        });
    },
};
async function updateDashboard(widgets) {
    const { data: dbWidgets } = await (0, aql_1.aqlQuery)((0, query_1.q)('dashboard')
        .filter({ id: { $oneof: widgets.map(({ id }) => id) } })
        .select('*'));
    const dbWidgetMap = new Map(dbWidgets.map(widget => [widget.id, widget]));
    await Promise.all(widgets
        // Perform an update query only if the widget actually has changes
        .filter(widget => !(0, isMatch_1.default)(dbWidgetMap.get(widget.id) ?? {}, widget))
        .map(widget => db.update('dashboard', widget)));
}
async function updateDashboardWidget(widget) {
    await db.updateWithSchema('dashboard', widget);
}
async function resetDashboard() {
    await (0, sync_1.batchMessages)(async () => {
        await Promise.all([
            // Delete all widgets
            db.deleteAll('dashboard'),
            // Insert the default state
            ...dashboard_1.DEFAULT_DASHBOARD_STATE.map(widget => db.insertWithSchema('dashboard', widget)),
        ]);
    });
}
async function addDashboardWidget(widget) {
    // If no x & y was provided - calculate it dynamically
    // The new widget should be the very last one in the list of all widgets
    if (!('x' in widget) && !('y' in widget)) {
        const data = await db.first('SELECT x, y, width, height FROM dashboard WHERE tombstone = 0 ORDER BY y DESC, x DESC');
        if (!data) {
            widget.x = 0;
            widget.y = 0;
        }
        else {
            const xBoundaryCheck = data.x + data.width + widget.width;
            widget.x = xBoundaryCheck > 12 ? 0 : data.x + data.width;
            widget.y = data.y + (xBoundaryCheck > 12 ? data.height : 0);
        }
    }
    await db.insertWithSchema('dashboard', widget);
}
async function removeDashboardWidget(widgetId) {
    await db.delete_('dashboard', widgetId);
}
async function importDashboard({ filepath }) {
    try {
        if (!(await fs.exists(filepath))) {
            throw new Error(`File not found at the provided path: ${filepath}`);
        }
        const content = await fs.readFile(filepath);
        const parsedContent = JSON.parse(content);
        exportModel.validate(parsedContent);
        const customReportIds = await db.all('SELECT id from custom_reports');
        const customReportIdSet = new Set(customReportIds.map(({ id }) => id));
        await (0, sync_1.batchMessages)(async () => {
            await Promise.all([
                // Delete all widgets
                db.deleteAll('dashboard'),
                // Insert new widgets
                ...parsedContent.widgets.map(widget => db.insertWithSchema('dashboard', {
                    type: widget.type,
                    width: widget.width,
                    height: widget.height,
                    x: widget.x,
                    y: widget.y,
                    meta: isExportedCustomReportWidget(widget)
                        ? { id: widget.meta.id }
                        : widget.meta,
                })),
                // Insert new custom reports
                ...parsedContent.widgets
                    .filter(isExportedCustomReportWidget)
                    .filter(({ meta }) => !customReportIdSet.has(meta.id))
                    .map(({ meta }) => db.insertWithSchema('custom_reports', app_2.reportModel.fromJS(meta))),
                // Update existing reports
                ...parsedContent.widgets
                    .filter(isExportedCustomReportWidget)
                    .filter(({ meta }) => customReportIdSet.has(meta.id))
                    .map(({ meta }) => db.updateWithSchema('custom_reports', {
                    // Replace `undefined` values with `null`
                    // (null clears the value in DB; undefined breaks the operation)
                    ...Object.fromEntries(Object.entries(app_2.reportModel.fromJS(meta)).map(([key, value]) => [
                        key,
                        value ?? null,
                    ])),
                    tombstone: false,
                })),
            ]);
        });
        return { status: 'ok' };
    }
    catch (err) {
        if (err instanceof Error) {
            err.message = 'Error importing file: ' + err.message;
            (0, exceptions_1.captureException)(err);
        }
        if (err instanceof SyntaxError) {
            return { error: 'json-parse-error' };
        }
        if (err instanceof errors_1.ValidationError) {
            return { error: 'validation-error', message: err.message };
        }
        return { error: 'internal-error' };
    }
}
exports.app = (0, app_1.createApp)();
exports.app.method('dashboard-update', (0, mutators_1.mutator)((0, undo_1.undoable)(updateDashboard)));
exports.app.method('dashboard-update-widget', (0, mutators_1.mutator)((0, undo_1.undoable)(updateDashboardWidget)));
exports.app.method('dashboard-reset', (0, mutators_1.mutator)((0, undo_1.undoable)(resetDashboard)));
exports.app.method('dashboard-add-widget', (0, mutators_1.mutator)((0, undo_1.undoable)(addDashboardWidget)));
exports.app.method('dashboard-remove-widget', (0, mutators_1.mutator)((0, undo_1.undoable)(removeDashboardWidget)));
exports.app.method('dashboard-import', (0, mutators_1.mutator)((0, undo_1.undoable)(importDashboard)));
//# sourceMappingURL=app.js.map