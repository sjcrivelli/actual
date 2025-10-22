"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RulesList = RulesList;
var react_aria_components_1 = require("react-aria-components");
var react_i18next_1 = require("react-i18next");
var AnimatedLoading_1 = require("@actual-app/components/icons/AnimatedLoading");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var RulesListItem_1 = require("./RulesListItem");
var MobileNavTabs_1 = require("@desktop-client/components/mobile/MobileNavTabs");
function RulesList(_a) {
    var rules = _a.rules, isLoading = _a.isLoading, onRulePress = _a.onRulePress, onRuleDelete = _a.onRuleDelete;
    var t = (0, react_i18next_1.useTranslation)().t;
    if (isLoading && rules.length === 0) {
        return (<view_1.View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 100,
            }}>
        <AnimatedLoading_1.AnimatedLoading style={{ width: 25, height: 25 }}/>
      </view_1.View>);
    }
    if (rules.length === 0) {
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
          {t('No rules found. Create your first rule to get started!')}
        </text_1.Text>
      </view_1.View>);
    }
    return (<view_1.View style={{ flex: 1, overflow: 'auto' }}>
      <react_aria_components_1.Virtualizer layout={react_aria_components_1.ListLayout} layoutOptions={{
            estimatedRowHeight: 140,
            padding: 0,
        }}>
        <react_aria_components_1.GridList aria-label={t('Rules')} aria-busy={isLoading || undefined} items={rules} style={{
            paddingBottom: MobileNavTabs_1.MOBILE_NAV_HEIGHT,
        }}>
          {function (rule) { return (<RulesListItem_1.RulesListItem value={rule} onAction={function () { return onRulePress(rule); }} onDelete={function () { return onRuleDelete(rule); }}/>); }}
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
