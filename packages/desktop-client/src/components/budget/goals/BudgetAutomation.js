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
exports.BudgetAutomation = void 0;
var react_1 = require("react");
var stack_1 = require("@actual-app/components/stack");
var BudgetAutomationEditor_1 = require("./BudgetAutomationEditor");
var BudgetAutomationReadOnly_1 = require("./BudgetAutomationReadOnly");
var reducer_1 = require("./reducer");
var DEFAULT_TEMPLATE = {
    directive: 'template',
    type: 'simple',
    monthly: 0,
    priority: reducer_1.DEFAULT_PRIORITY,
};
var BudgetAutomation = function (_a) {
    var onDelete = _a.onDelete, onSave = _a.onSave, categories = _a.categories, schedules = _a.schedules, readOnlyStyle = _a.readOnlyStyle, style = _a.style, template = _a.template, _b = _a.inline, inline = _b === void 0 ? false : _b;
    var _c = (0, react_1.useState)(false), isEditing = _c[0], setIsEditing = _c[1];
    var _d = (0, react_1.useReducer)(reducer_1.templateReducer, (0, reducer_1.getInitialState)(template !== null && template !== void 0 ? template : DEFAULT_TEMPLATE)), state = _d[0], originalDispatch = _d[1];
    var dispatch = (0, react_1.useCallback)(function (action) {
        originalDispatch(action);
        onSave === null || onSave === void 0 ? void 0 : onSave();
    }, [originalDispatch, onSave]);
    var categoryNameMap = (0, react_1.useMemo)(function () {
        return categories.reduce(function (acc, group) {
            var _a;
            for (var _i = 0, _b = (_a = group.categories) !== null && _a !== void 0 ? _a : []; _i < _b.length; _i++) {
                var category = _b[_i];
                acc[category.id] = category.name;
            }
            return acc;
        }, {});
    }, [categories]);
    return (<stack_1.Stack direction="column" spacing={inline ? 0 : 1} style={__assign(__assign({}, style), { minHeight: 'fit-content' })}>
      <BudgetAutomationReadOnly_1.BudgetAutomationReadOnly state={state} categoryNameMap={categoryNameMap} isEditing={isEditing} setIsEditing={setIsEditing} onDelete={onDelete} style={readOnlyStyle} inline={inline}/>
      {isEditing && (<BudgetAutomationEditor_1.BudgetAutomationEditor inline={inline} state={state} dispatch={dispatch} schedules={schedules} categories={categories}/>)}
    </stack_1.Stack>);
};
exports.BudgetAutomation = BudgetAutomation;
