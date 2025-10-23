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
exports.Action = void 0;
// @ts-strict-ignore
const dateFns = __importStar(require("date-fns"));
const Handlebars = __importStar(require("handlebars"));
const log_1 = require("../../platform/server/log");
const months_1 = require("../../shared/months");
const rules_1 = require("../../shared/rules");
const rule_utils_1 = require("./rule-utils");
const ACTION_OPS = [
    'set',
    'set-split-amount',
    'link-schedule',
    'prepend-notes',
    'append-notes',
    'delete-transaction',
];
class Action {
    field;
    op;
    options;
    rawValue;
    type;
    value;
    handlebarsTemplate;
    constructor(op, field, value, options) {
        (0, rule_utils_1.assert)(ACTION_OPS.includes(op), 'internal', `Invalid action operation: ${op}`);
        if (op === 'set') {
            const typeName = rules_1.FIELD_TYPES.get(field);
            (0, rule_utils_1.assert)(typeName, 'internal', `Invalid field for action: ${field}`);
            this.field = field;
            this.type = typeName;
            if (options?.template) {
                this.handlebarsTemplate = Handlebars.compile(options.template, {
                    noEscape: true,
                });
                try {
                    this.handlebarsTemplate({});
                }
                catch (e) {
                    log_1.logger.debug(e);
                    (0, rule_utils_1.assert)(false, 'invalid-template', `Invalid Handlebars template`);
                }
            }
        }
        else if (op === 'set-split-amount') {
            this.field = null;
            this.type = 'number';
        }
        else if (op === 'link-schedule') {
            this.field = null;
            this.type = 'id';
        }
        else if (op === 'prepend-notes' || op === 'append-notes') {
            this.field = 'notes';
            this.type = 'id';
        }
        if (field === 'account') {
            (0, rule_utils_1.assert)(value, 'no-null', `Field cannot be empty: ${field}`);
        }
        this.op = op;
        this.rawValue = value;
        this.value = value;
        this.options = options;
    }
    exec(object) {
        switch (this.op) {
            case 'set':
                if (this.handlebarsTemplate) {
                    object[this.field] = this.handlebarsTemplate({
                        ...object,
                        today: (0, months_1.currentDay)(),
                    });
                    // Handlebars always returns a string, so we need to convert
                    switch (this.type) {
                        case 'number':
                            object[this.field] = parseFloat(object[this.field]);
                            break;
                        case 'date':
                            const parsed = (0, months_1.parseDate)(object[this.field]);
                            if (parsed && dateFns.isValid(parsed)) {
                                object[this.field] = (0, months_1.format)(parsed, 'yyyy-MM-dd');
                            }
                            else {
                                // Keep original string; log for diagnostics but avoid hard crash
                                log_1.logger.error(`rules: invalid date produced by template for field “${this.field}”:`, object[this.field]);
                                // Make it stick like a sore thumb
                                object[this.field] = '9999-12-31';
                            }
                            break;
                        case 'boolean':
                            object[this.field] = object[this.field] === 'true';
                            break;
                    }
                }
                else {
                    object[this.field] = this.value;
                }
                if (this.field === 'payee_name') {
                    object['payee'] = 'new';
                }
                break;
            case 'set-split-amount':
                switch (this.options.method) {
                    case 'fixed-amount':
                        object.amount = this.value;
                        break;
                    default:
                }
                break;
            case 'link-schedule':
                object.schedule = this.value;
                break;
            case 'prepend-notes':
                object[this.field] = object[this.field]
                    ? this.value + object[this.field]
                    : this.value;
                break;
            case 'append-notes':
                object[this.field] = object[this.field]
                    ? object[this.field] + this.value
                    : this.value;
                break;
            case 'delete-transaction':
                object['tombstone'] = 1;
                break;
            default:
        }
    }
    serialize() {
        return {
            op: this.op,
            field: this.field,
            value: this.value,
            type: this.type,
            ...(this.options ? { options: this.options } : {}),
        };
    }
}
exports.Action = Action;
//# sourceMappingURL=action.js.map