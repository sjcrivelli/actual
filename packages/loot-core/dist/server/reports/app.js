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
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.reportModel = void 0;
const uuid_1 = require("uuid");
const app_1 = require("../app");
const db = __importStar(require("../db"));
const errors_1 = require("../errors");
const models_1 = require("../models");
const mutators_1 = require("../mutators");
const undo_1 = require("../undo");
exports.reportModel = {
    validate(report, { update } = {}) {
        (0, models_1.requiredFields)('Report', report, ['conditionsOp'], update);
        if (!update || 'conditionsOp' in report) {
            if (!['and', 'or'].includes(report.conditionsOp)) {
                throw new errors_1.ValidationError('Invalid filter conditionsOp: ' + report.conditionsOp);
            }
        }
        return report;
    },
    toJS(row) {
        return {
            id: row.id,
            name: row.name,
            startDate: row.start_date,
            endDate: row.end_date,
            isDateStatic: row.date_static === 1,
            dateRange: row.date_range,
            mode: row.mode,
            groupBy: row.group_by,
            sortBy: row.sort_by,
            interval: row.interval,
            balanceType: row.balance_type,
            showEmpty: row.show_empty === 1,
            showOffBudget: row.show_offbudget === 1,
            showHiddenCategories: row.show_hidden === 1,
            showUncategorized: row.show_uncategorized === 1,
            trimIntervals: row.trim_intervals === 1,
            includeCurrentInterval: row.include_current === 1,
            graphType: row.graph_type,
            conditions: row.conditions,
            conditionsOp: row.conditions_op,
        };
    },
    fromJS(report) {
        return {
            id: report.id,
            name: report.name,
            start_date: report.startDate,
            end_date: report.endDate,
            date_static: report.isDateStatic ? 1 : 0,
            date_range: report.dateRange,
            mode: report.mode,
            group_by: report.groupBy,
            sort_by: report.sortBy,
            interval: report.interval,
            balance_type: report.balanceType,
            show_empty: report.showEmpty ? 1 : 0,
            show_offbudget: report.showOffBudget ? 1 : 0,
            show_hidden: report.showHiddenCategories ? 1 : 0,
            trim_intervals: report.trimIntervals ? 1 : 0,
            include_current: report.includeCurrentInterval ? 1 : 0,
            graph_type: report.graphType,
            conditions: report.conditions,
            conditions_op: report.conditionsOp,
        };
    },
};
async function reportNameExists(name, reportId, newItem) {
    const idForName = await db.first('SELECT id from custom_reports WHERE tombstone = 0 AND name = ?', [name]);
    //no existing name found
    if (idForName === null) {
        return false;
    }
    //for update/rename
    if (!newItem) {
        /*
        -if the found item is the same as the existing item
        then no name change was made.
        -if they are not the same then there is another
        item with that name already.
        */
        return idForName.id !== reportId;
    }
    //default return: item was found but does not match current name
    return true;
}
async function createReport(report) {
    const reportId = (0, uuid_1.v4)();
    const item = {
        ...report,
        id: reportId,
    };
    if (!item.name) {
        throw new Error('Report name is required');
    }
    const nameExists = await reportNameExists(item.name, item.id ?? '', true);
    if (nameExists) {
        throw new Error('There is already a report named ' + item.name);
    }
    // Create the report here based on the info
    await db.insertWithSchema('custom_reports', exports.reportModel.fromJS(item));
    return reportId;
}
async function updateReport(item) {
    if (!item.name) {
        throw new Error('Report name is required');
    }
    if (!item.id) {
        throw new Error('Report recall error');
    }
    const nameExists = await reportNameExists(item.name, item.id, false);
    if (nameExists) {
        throw new Error('There is already a report named ' + item.name);
    }
    await db.updateWithSchema('custom_reports', exports.reportModel.fromJS(item));
}
async function deleteReport(id) {
    await db.delete_('custom_reports', id);
}
// Expose functions to the client
exports.app = (0, app_1.createApp)();
exports.app.method('report/create', (0, mutators_1.mutator)((0, undo_1.undoable)(createReport)));
exports.app.method('report/update', (0, mutators_1.mutator)((0, undo_1.undoable)(updateReport)));
exports.app.method('report/delete', (0, mutators_1.mutator)((0, undo_1.undoable)(deleteReport)));
