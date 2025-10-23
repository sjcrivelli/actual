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
exports.uniqueBudgetName = uniqueBudgetName;
exports.validateBudgetName = validateBudgetName;
exports.idFromBudgetName = idFromBudgetName;
const uuid_1 = require("uuid");
const fs = __importStar(require("../../platform/server/fs"));
const main_1 = require("../main");
async function uniqueBudgetName(initialName = 'My Finances') {
    const budgets = await main_1.handlers['get-budgets']();
    let idx = 1;
    // If there is a conflict, keep appending an index until there is no
    // conflict and we have a unique name
    let newName = initialName;
    while (budgets.find(file => file.name === newName)) {
        newName = `${initialName} ${idx}`;
        idx++;
    }
    return newName;
}
async function validateBudgetName(name) {
    const trimmedName = name.trim();
    const uniqueName = await uniqueBudgetName(trimmedName);
    let message = null;
    if (trimmedName === '')
        message = 'Budget name cannot be blank';
    if (trimmedName.length > 100) {
        message = 'Budget name is too long (max length 100)';
    }
    if (uniqueName !== trimmedName) {
        message = `“${name}” already exists, try “${uniqueName}” instead`;
    }
    return message ? { valid: false, message } : { valid: true };
}
async function idFromBudgetName(name) {
    let id = name.replace(/( |[^A-Za-z0-9])/g, '-') + '-' + (0, uuid_1.v4)().slice(0, 7);
    // Make sure the id is unique. There's a chance one could already
    // exist (although very unlikely now that we append unique
    // characters onto the id)
    let index = 0;
    let budgetDir = fs.getBudgetDir(id);
    while (await fs.exists(budgetDir)) {
        index++;
        budgetDir = fs.getBudgetDir(id + index.toString());
    }
    // If a suffix was added, update the id
    if (index > 0) {
        id = id + index.toString();
    }
    return id;
}
//# sourceMappingURL=budget-name.js.map