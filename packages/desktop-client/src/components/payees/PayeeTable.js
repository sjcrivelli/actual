"use strict";
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
exports.PayeeTable = void 0;
// @ts-strict-ignore
var react_1 = require("react");
var view_1 = require("@actual-app/components/view");
var PayeeTableRow_1 = require("./PayeeTableRow");
var table_1 = require("@desktop-client/components/table");
var useSelected_1 = require("@desktop-client/hooks/useSelected");
exports.PayeeTable = (0, react_1.forwardRef)(function (_a, ref) {
    var payees = _a.payees, ruleCounts = _a.ruleCounts, onUpdate = _a.onUpdate, onDelete = _a.onDelete, onViewRules = _a.onViewRules, onCreateRule = _a.onCreateRule;
    var _b = (0, react_1.useState)(null), hovered = _b[0], setHovered = _b[1];
    var selectedItems = (0, useSelected_1.useSelectedItems)();
    (0, react_1.useLayoutEffect)(function () {
        var firstSelected = __spreadArray([], selectedItems, true)[0];
        if (typeof ref !== 'function') {
            ref.current.scrollTo(firstSelected, 'center');
        }
    }, []);
    var onHover = (0, react_1.useCallback)(function (id) {
        setHovered(id);
    }, []);
    var tableNavigator = (0, table_1.useTableNavigator)(payees, function (item) {
        return item.transfer_acct == null
            ? ['select', 'name', 'rule-count']
            : ['rule-count'];
    });
    return (<view_1.View style={{ flex: 1 }} onMouseLeave={function () { return setHovered(null); }}>
        <table_1.Table navigator={tableNavigator} ref={ref} items={payees} renderItem={function (_a) {
            var item = _a.item, editing = _a.editing, focusedField = _a.focusedField, onEdit = _a.onEdit;
            return (<PayeeTableRow_1.PayeeTableRow payee={item} ruleCount={ruleCounts.get(item.id) || 0} selected={selectedItems.has(item.id)} editing={editing} focusedField={focusedField} hovered={hovered === item.id} onHover={onHover} onEdit={onEdit} onUpdate={onUpdate} onDelete={onDelete} onViewRules={onViewRules} onCreateRule={onCreateRule}/>);
        }}/>
      </view_1.View>);
});
exports.PayeeTable.displayName = 'PayeeTable';
