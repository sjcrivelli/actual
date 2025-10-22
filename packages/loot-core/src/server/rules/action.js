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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
// @ts-strict-ignore
var dateFns = require("date-fns");
var Handlebars = require("handlebars");
var log_1 = require("../../platform/server/log");
var months_1 = require("../../shared/months");
var rules_1 = require("../../shared/rules");
var rule_utils_1 = require("./rule-utils");
var ACTION_OPS = [
    'set',
    'set-split-amount',
    'link-schedule',
    'prepend-notes',
    'append-notes',
    'delete-transaction',
];
var Action = /** @class */ (function () {
    function Action(op, field, value, options) {
        (0, rule_utils_1.assert)(ACTION_OPS.includes(op), 'internal', "Invalid action operation: ".concat(op));
        if (op === 'set') {
            var typeName = rules_1.FIELD_TYPES.get(field);
            (0, rule_utils_1.assert)(typeName, 'internal', "Invalid field for action: ".concat(field));
            this.field = field;
            this.type = typeName;
            if (options === null || options === void 0 ? void 0 : options.template) {
                this.handlebarsTemplate = Handlebars.compile(options.template, {
                    noEscape: true,
                });
                try {
                    this.handlebarsTemplate({});
                }
                catch (e) {
                    log_1.logger.debug(e);
                    (0, rule_utils_1.assert)(false, 'invalid-template', "Invalid Handlebars template");
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
            (0, rule_utils_1.assert)(value, 'no-null', "Field cannot be empty: ".concat(field));
        }
        this.op = op;
        this.rawValue = value;
        this.value = value;
        this.options = options;
    }
    Action.prototype.exec = function (object) {
        switch (this.op) {
            case 'set':
                if (this.handlebarsTemplate) {
                    object[this.field] = this.handlebarsTemplate(__assign(__assign({}, object), { today: (0, months_1.currentDay)() }));
                    // Handlebars always returns a string, so we need to convert
                    switch (this.type) {
                        case 'number':
                            object[this.field] = parseFloat(object[this.field]);
                            break;
                        case 'date':
                            var parsed = (0, months_1.parseDate)(object[this.field]);
                            if (parsed && dateFns.isValid(parsed)) {
                                object[this.field] = (0, months_1.format)(parsed, 'yyyy-MM-dd');
                            }
                            else {
                                // Keep original string; log for diagnostics but avoid hard crash
                                log_1.logger.error("rules: invalid date produced by template for field \u201C".concat(this.field, "\u201D:"), object[this.field]);
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
    };
    Action.prototype.serialize = function () {
        return __assign({ op: this.op, field: this.field, value: this.value, type: this.type }, (this.options ? { options: this.options } : {}));
    };
    return Action;
}());
exports.Action = Action;
