"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayeesList = PayeesList;
var react_aria_components_1 = require("react-aria-components");
var react_i18next_1 = require("react-i18next");
var AnimatedLoading_1 = require("@actual-app/components/icons/AnimatedLoading");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var PayeesListItem_1 = require("./PayeesListItem");
var MobileNavTabs_1 = require("@desktop-client/components/mobile/MobileNavTabs");
function PayeesList(_a) {
    var payees = _a.payees, ruleCounts = _a.ruleCounts, _b = _a.isRuleCountsLoading, isRuleCountsLoading = _b === void 0 ? false : _b, _c = _a.isLoading, isLoading = _c === void 0 ? false : _c, onPayeePress = _a.onPayeePress, onPayeeDelete = _a.onPayeeDelete;
    var t = (0, react_i18next_1.useTranslation)().t;
    if (isLoading && payees.length === 0) {
        return (<view_1.View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 100,
            }}>
        <AnimatedLoading_1.AnimatedLoading style={{ width: 25, height: 25 }}/>
      </view_1.View>);
    }
    if (payees.length === 0) {
        return (<view_1.View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 20,
            }}>
        <text_1.Text style={{
                fontSize: 16,
                color: theme_1.theme.pageTextSubdued,
                textAlign: 'center',
            }}>
          <react_i18next_1.Trans>No payees found.</react_i18next_1.Trans>
        </text_1.Text>
      </view_1.View>);
    }
    return (<view_1.View style={{ flex: 1 }}>
      <react_aria_components_1.Virtualizer layout={react_aria_components_1.ListLayout}>
        <react_aria_components_1.GridList aria-label={t('Payees')} aria-busy={isLoading || undefined} items={payees} style={{
            flex: 1,
            paddingBottom: MobileNavTabs_1.MOBILE_NAV_HEIGHT,
            overflow: 'auto',
        }} dependencies={[ruleCounts, isRuleCountsLoading]}>
          {function (payee) {
            var _a;
            return (<PayeesListItem_1.PayeesListItem value={payee} ruleCount={(_a = ruleCounts.get(payee.id)) !== null && _a !== void 0 ? _a : 0} isRuleCountLoading={isRuleCountsLoading} onAction={function () { return onPayeePress(payee); }} onDelete={function () { return onPayeeDelete(payee); }}/>);
        }}
        </react_aria_components_1.GridList>
      </react_aria_components_1.Virtualizer>
      {isLoading && (<view_1.View style={{
                alignItems: 'center',
                paddingTop: 20,
            }}>
          <AnimatedLoading_1.AnimatedLoading style={{ width: 20, height: 20 }}/>
        </view_1.View>)}
    </view_1.View>);
}
