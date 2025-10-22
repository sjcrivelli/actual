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
exports.RulesListItem = RulesListItem;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var space_between_1 = require("@actual-app/components/space-between");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var ActionableGridListItem_1 = require("@desktop-client/components/mobile/ActionableGridListItem");
var ActionExpression_1 = require("@desktop-client/components/rules/ActionExpression");
var ConditionExpression_1 = require("@desktop-client/components/rules/ConditionExpression");
var ruleUtils_1 = require("@desktop-client/util/ruleUtils");
function RulesListItem(_a) {
    var rule = _a.value, onDelete = _a.onDelete, style = _a.style, props = __rest(_a, ["value", "onDelete", "style"]);
    var t = (0, react_i18next_1.useTranslation)().t;
    // Group actions by splitIndex to handle split transactions
    var actionSplits = (0, ruleUtils_1.groupActionsBySplitIndex)(rule.actions);
    var hasSplits = actionSplits.length > 1;
    return (<ActionableGridListItem_1.ActionableGridListItem id={rule.id} value={rule} textValue={t('Rule {{id}}', { id: rule.id })} style={__assign(__assign(__assign({}, styles_1.styles.mobileListItem), { padding: '8px 16px' }), style)} actions={<button_1.Button variant="bare" onPress={onDelete} style={{
                color: theme_1.theme.errorText,
                width: '100%',
            }}>
          <react_i18next_1.Trans>Delete</react_i18next_1.Trans>
        </button_1.Button>} {...props}>
      <space_between_1.SpaceBetween gap={12} style={{ alignItems: 'flex-start' }}>
        {/* Column 1: PRE/POST pill */}
        <view_1.View style={{
            flexShrink: 0,
            paddingTop: 2, // Slight top padding to align with text baseline
        }}>
          <view_1.View style={{
            backgroundColor: rule.stage === 'pre'
                ? theme_1.theme.noticeBackgroundLight
                : rule.stage === 'post'
                    ? theme_1.theme.warningBackground
                    : theme_1.theme.pillBackgroundSelected,
            paddingLeft: 6,
            paddingRight: 6,
            paddingTop: 2,
            paddingBottom: 2,
            borderRadius: 3,
        }}>
            <span style={{
            fontSize: 11,
            fontWeight: 500,
            color: rule.stage === 'pre'
                ? theme_1.theme.noticeTextLight
                : rule.stage === 'post'
                    ? theme_1.theme.warningText
                    : theme_1.theme.pillTextSelected,
        }} data-testid="rule-stage-badge">
              {rule.stage === 'pre'
            ? t('PRE')
            : rule.stage === 'post'
                ? t('POST')
                : t('DEFAULT')}
            </span>
          </view_1.View>
        </view_1.View>

        {/* Column 2: IF and THEN blocks */}
        <view_1.View style={{
            flex: 1,
            flexDirection: 'column',
            gap: 4,
        }}>
          {/* IF conditions block */}
          <space_between_1.SpaceBetween gap={6}>
            <span style={{
            fontSize: 13,
            fontWeight: 600,
            color: theme_1.theme.pageTextLight,
            marginRight: 4,
        }}>
              {t('IF')}
            </span>

            {rule.conditions.map(function (condition, index) { return (<view_1.View key={index} style={{ marginRight: 4, marginBottom: 2 }}>
                <ConditionExpression_1.ConditionExpression field={condition.field} op={condition.op} value={condition.value} options={condition.options} inline={true}/>
              </view_1.View>); })}
          </space_between_1.SpaceBetween>

          {/* THEN actions block */}
          <view_1.View style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 4,
        }}>
            <span style={{
            fontSize: 13,
            fontWeight: 600,
            color: theme_1.theme.pageTextLight,
            marginBottom: 2,
        }}>
              {t('THEN')}
            </span>

            {hasSplits
            ? actionSplits.map(function (split, i) { return (<view_1.View key={i} style={{
                    width: '100%',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    marginTop: i > 0 ? 4 : 0,
                    padding: '6px',
                    borderColor: theme_1.theme.tableBorder,
                    borderWidth: '1px',
                    borderRadius: '5px',
                }}>
                    <span style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: theme_1.theme.pageTextLight,
                    marginBottom: 4,
                }}>
                      {i ? t('Split {{num}}', { num: i }) : t('Apply to all')}
                    </span>
                    {split.actions.map(function (action, j) { return (<view_1.View key={j} style={{
                        marginBottom: j !== split.actions.length - 1 ? 2 : 0,
                        maxWidth: '100%',
                    }}>
                        <ActionExpression_1.ActionExpression {...action}/>
                      </view_1.View>); })}
                  </view_1.View>); })
            : rule.actions.map(function (action, index) { return (<view_1.View key={index} style={{ marginBottom: 2, maxWidth: '100%' }}>
                    <ActionExpression_1.ActionExpression {...action}/>
                  </view_1.View>); })}
          </view_1.View>
        </view_1.View>
      </space_between_1.SpaceBetween>
    </ActionableGridListItem_1.ActionableGridListItem>);
}
