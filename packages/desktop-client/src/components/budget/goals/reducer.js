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
exports.templateReducer = exports.getInitialState = exports.DEFAULT_PRIORITY = void 0;
exports.DEFAULT_PRIORITY = 1;
var getInitialState = function (template) {
    var type = template === null || template === void 0 ? void 0 : template.type;
    switch (type) {
        case 'simple':
            return {
                template: template,
                displayType: 'simple',
            };
        case 'percentage':
            return {
                template: template,
                displayType: 'percentage',
            };
        case 'schedule':
            return {
                template: template,
                displayType: 'schedule',
            };
        case 'periodic':
            return {
                template: template,
                displayType: 'week',
            };
        case 'spend':
        case 'by':
            throw new Error('Goal is not yet supported');
        case 'remainder':
            throw new Error('Remainder is not yet supported');
        case 'limit':
            throw new Error('Limit is not yet supported');
        case 'average':
        case 'copy':
            return {
                template: template,
                displayType: 'historical',
            };
        case 'goal':
            throw new Error('Goal is not yet supported');
        case 'error':
            throw new Error('An error occurred while parsing the template');
        default:
            throw new Error("Unknown template type: ".concat(type));
    }
};
exports.getInitialState = getInitialState;
var changeType = function (prevState, visualType) {
    switch (visualType) {
        case 'simple':
            if (prevState.template.type === 'simple') {
                return prevState;
            }
            return {
                displayType: visualType,
                template: {
                    directive: 'template',
                    type: 'simple',
                    monthly: 5,
                    priority: exports.DEFAULT_PRIORITY,
                },
            };
        case 'percentage':
            if (prevState.template.type === 'percentage') {
                return prevState;
            }
            return {
                displayType: visualType,
                template: {
                    directive: 'template',
                    type: 'percentage',
                    percent: 15,
                    previous: false,
                    category: 'total',
                    priority: exports.DEFAULT_PRIORITY,
                },
            };
        case 'schedule':
            if (prevState.template.type === 'schedule') {
                return prevState;
            }
            return {
                displayType: visualType,
                template: {
                    directive: 'template',
                    type: 'schedule',
                    name: '',
                    priority: exports.DEFAULT_PRIORITY,
                },
            };
        case 'week':
            if (prevState.template.type === 'periodic') {
                return prevState;
            }
            return {
                displayType: visualType,
                template: {
                    directive: 'template',
                    type: 'periodic',
                    amount: 5,
                    period: {
                        period: 'week',
                        amount: 1,
                    },
                    starting: '',
                    priority: exports.DEFAULT_PRIORITY,
                },
            };
        case 'historical':
            if (prevState.template.type === 'copy' ||
                prevState.template.type === 'average') {
                return prevState;
            }
            return {
                displayType: visualType,
                template: {
                    directive: 'template',
                    type: 'average',
                    numMonths: 3,
                    priority: exports.DEFAULT_PRIORITY,
                },
            };
        default:
            // Make sure we're not missing any cases
            throw new Error("Unknown display type: ".concat(visualType));
    }
};
function mapTemplateTypesForUpdate(state, template) {
    switch (state.template.type) {
        case 'average':
            switch (template.type) {
                case 'copy':
                    return __assign(__assign({}, state), { displayType: 'historical', template: __assign(__assign({}, template), { directive: 'template', type: 'copy', lookBack: state.template.numMonths, priority: state.template.priority }) });
                default:
                    break;
            }
            break;
        case 'copy':
            switch (template.type) {
                case 'average':
                    return __assign(__assign({}, state), { displayType: 'historical', template: __assign(__assign({}, template), { directive: 'template', type: 'average', numMonths: state.template.lookBack, priority: state.template.priority }) });
                default:
                    break;
            }
            break;
        default:
            break;
    }
    if (state.template.type === template.type) {
        var _1 = template.type, _2 = template.directive, rest = __rest(template, ["type", "directive"]);
        return __assign(__assign({}, state), (0, exports.getInitialState)(__assign(__assign({}, state.template), rest)));
    }
    console.error("Template type mismatch: ".concat(state.template.type, " !== ").concat(template.type));
    return state;
}
var templateReducer = function (state, action) {
    switch (action.type) {
        case 'set-type':
            return __assign(__assign({}, state), changeType(state, action.payload));
        case 'set-template':
            return __assign(__assign({}, state), (0, exports.getInitialState)(action.payload));
        case 'update-template':
            return mapTemplateTypesForUpdate(state, action.payload);
        default:
            return state;
    }
};
exports.templateReducer = templateReducer;
