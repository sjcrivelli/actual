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
exports.handleBudgetImport = handleBudgetImport;
// @ts-strict-ignore
const log_1 = require("../../platform/server/log");
const main_1 = require("../main");
const actual_1 = require("./actual");
const YNAB4 = __importStar(require("./ynab4"));
const YNAB5 = __importStar(require("./ynab5"));
const importers = {
    ynab4: YNAB4,
    ynab5: YNAB5,
};
async function handleBudgetImport(type, filepath, buffer) {
    if (type === 'actual') {
        return (0, actual_1.importActual)(filepath, buffer);
    }
    const importer = importers[type];
    try {
        let data;
        let budgetName;
        try {
            data = importer.parseFile(buffer);
            budgetName = importer.getBudgetName(filepath, data);
        }
        catch (e) {
            log_1.logger.error('failed to parse file', e);
        }
        if (!budgetName) {
            return { error: 'not-' + type };
        }
        try {
            await main_1.handlers['api/start-import']({ budgetName });
        }
        catch (e) {
            log_1.logger.error('failed to start import', e);
            return { error: 'unknown' };
        }
        await importer.doImport(data);
    }
    catch (e) {
        await main_1.handlers['api/abort-import']();
        log_1.logger.error('failed to run import', e);
        return { error: 'unknown' };
    }
    await main_1.handlers['api/finish-import']();
}
