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
exports.RuleRow = void 0;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v0_1 = require("@actual-app/components/icons/v0");
var menu_1 = require("@actual-app/components/menu");
var popover_1 = require("@actual-app/components/popover");
var stack_1 = require("@actual-app/components/stack");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var rules_1 = require("loot-core/shared/rules");
var ActionExpression_1 = require("./ActionExpression");
var ConditionExpression_1 = require("./ConditionExpression");
var table_1 = require("@desktop-client/components/table");
var useContextMenu_1 = require("@desktop-client/hooks/useContextMenu");
var useSelected_1 = require("@desktop-client/hooks/useSelected");
var ruleUtils_1 = require("@desktop-client/util/ruleUtils");
exports.RuleRow = (0, react_1.memo)(function (_a) {
    var rule = _a.rule, hovered = _a.hovered, selected = _a.selected, onHover = _a.onHover, onEditRule = _a.onEditRule, onDeleteRule = _a.onDeleteRule;
    var dispatchSelected = (0, useSelected_1.useSelectedDispatch)();
    var borderColor = selected ? theme_1.theme.tableBorderSelected : 'none';
    var backgroundFocus = hovered;
    var actionSplits = (0, ruleUtils_1.groupActionsBySplitIndex)(rule.actions);
    var hasSplits = actionSplits.length > 1;
    var hasSchedule = rule.actions.some(function (_a) {
        var op = _a.op;
        return op === 'link-schedule';
    });
    var t = (0, react_i18next_1.useTranslation)().t;
    var triggerRef = (0, react_1.useRef)(null);
    var _b = (0, useContextMenu_1.useContextMenu)(), setMenuOpen = _b.setMenuOpen, menuOpen = _b.menuOpen, handleContextMenu = _b.handleContextMenu, position = _b.position;
    return (<table_1.Row ref={triggerRef} height="auto" style={{
            fontSize: 13,
            zIndex: selected ? 101 : 'auto',
            borderColor: borderColor,
            backgroundColor: selected
                ? theme_1.theme.tableRowBackgroundHighlight
                : backgroundFocus
                    ? theme_1.theme.tableRowBackgroundHover
                    : theme_1.theme.tableBackground,
        }} collapsed={true} onMouseEnter={function () { return onHover && onHover(rule.id); }} onMouseLeave={function () { return onHover && onHover(null); }} onContextMenu={handleContextMenu}>
        <popover_1.Popover triggerRef={triggerRef} placement="bottom start" isOpen={menuOpen} onOpenChange={function () { return setMenuOpen(false); }} {...position} style={{ width: 200, margin: 1 }} isNonModal>
          <menu_1.Menu items={[
            onEditRule && { name: 'edit', text: t('Edit') },
            onDeleteRule &&
                !hasSchedule && { name: 'delete', text: t('Delete') },
        ]} onMenuSelect={function (name) {
            switch (name) {
                case 'delete':
                    onDeleteRule(rule);
                    break;
                case 'edit':
                    onEditRule(rule);
                    break;
                default:
                    throw new Error("Unrecognized menu option: ".concat(name));
            }
            setMenuOpen(false);
        }}/>
        </popover_1.Popover>
        <table_1.SelectCell exposed={hovered || selected} focused={true} onSelect={function (e) {
            dispatchSelected({
                type: 'select',
                id: rule.id,
                isRangeSelect: e.shiftKey,
            });
        }} selected={selected}/>

        <table_1.Cell name="stage" width={50} plain style={{ color: theme_1.theme.tableText }}>
          {rule.stage && (<view_1.View style={{
                alignSelf: 'flex-start',
                margin: 5,
                backgroundColor: theme_1.theme.pillBackgroundSelected,
                color: theme_1.theme.pillTextSelected,
                borderRadius: 4,
                padding: '3px 5px',
            }}>
              {(0, rules_1.translateRuleStage)(rule.stage)}
            </view_1.View>)}
        </table_1.Cell>

        <table_1.Field width="flex" style={{ padding: '15px 0' }} truncate={false}>
          <stack_1.Stack direction="row" align="center">
            <view_1.View style={{ flex: 1, alignItems: 'flex-start' }} data-testid="conditions">
              {rule.conditions.map(function (cond, i) { return (<ConditionExpression_1.ConditionExpression key={i} field={cond.field} op={cond.op} inline={true} value={cond.value} options={cond.options} prefix={i > 0 ? (0, rules_1.friendlyOp)(rule.conditionsOp) : null} style={i !== 0 && { marginTop: 3 }}/>); })}
            </view_1.View>

            <text_1.Text>
              <v0_1.SvgRightArrow2 style={{ width: 12, height: 12, color: theme_1.theme.tableText }}/>
            </text_1.Text>

            <view_1.View style={{ flex: 1, alignItems: 'flex-start' }} data-testid="actions">
              {hasSplits
            ? actionSplits.map(function (split, i) { return (<view_1.View key={split.id} style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    marginTop: i > 0 ? 3 : 0,
                    padding: '5px',
                    borderColor: theme_1.theme.tableBorder,
                    borderWidth: '1px',
                    borderRadius: '5px',
                }}>
                      <text_1.Text style={__assign(__assign({}, styles_1.styles.smallText), { color: theme_1.theme.pageTextLight, marginBottom: 6 })}>
                        {i ? t('Split {{num}}', { num: i }) : t('Apply to all')}
                      </text_1.Text>
                      {split.actions.map(function (action, j) { return (<ActionExpression_1.ActionExpression key={j} {...action} style={j !== 0 && { marginTop: 3 }}/>); })}
                    </view_1.View>); })
            : rule.actions.map(function (action, i) { return (<ActionExpression_1.ActionExpression key={i} {...action} style={i !== 0 && { marginTop: 3 }}/>); })}
            </view_1.View>
          </stack_1.Stack>
        </table_1.Field>

        <table_1.Cell name="edit" plain style={{ padding: '0 15px', paddingLeft: 5 }}>
          <button_1.Button onPress={function () { return onEditRule(rule); }}>
            <react_i18next_1.Trans>Edit</react_i18next_1.Trans>
          </button_1.Button>
        </table_1.Cell>
      </table_1.Row>);
});
exports.RuleRow.displayName = 'RuleRow';
