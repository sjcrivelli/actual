"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetTotals = void 0;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v1_1 = require("@actual-app/components/icons/v1");
var v2_1 = require("@actual-app/components/icons/v2");
var menu_1 = require("@actual-app/components/menu");
var popover_1 = require("@actual-app/components/popover");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var RenderMonths_1 = require("./RenderMonths");
var util_1 = require("./util");
var useGlobalPref_1 = require("@desktop-client/hooks/useGlobalPref");
exports.BudgetTotals = (0, react_1.memo)(function BudgetTotals(_a) {
    var MonthComponent = _a.MonthComponent, toggleHiddenCategories = _a.toggleHiddenCategories, expandAllCategories = _a.expandAllCategories, collapseAllCategories = _a.collapseAllCategories;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _b = (0, useGlobalPref_1.useGlobalPref)('categoryExpandedState'), categoryExpandedStatePref = _b[0], setCategoryExpandedStatePref = _b[1];
    var categoryExpandedState = categoryExpandedStatePref !== null && categoryExpandedStatePref !== void 0 ? categoryExpandedStatePref : 0;
    var _c = (0, react_1.useState)(false), menuOpen = _c[0], setMenuOpen = _c[1];
    var triggerRef = (0, react_1.useRef)(null);
    var cycleExpandedState = function () {
        var nextState = (categoryExpandedState + 1) % 3;
        setCategoryExpandedStatePref(nextState);
    };
    var getExpandStateLabel = function () {
        switch (categoryExpandedState) {
            case 0:
                return t('Expand');
            case 1:
                return t('Fully Expand');
            case 2:
                return t('Collapse');
            default:
                return t('Expand');
        }
    };
    return (<view_1.View data-testid="budget-totals" style={{
            backgroundColor: theme_1.theme.tableBackground,
            flexDirection: 'row',
            flexShrink: 0,
            boxShadow: styles_1.styles.cardShadow,
            marginLeft: 5,
            marginRight: 5 + (0, util_1.getScrollbarWidth)(),
            borderRadius: '4px 4px 0 0',
            borderBottom: '1px solid ' + theme_1.theme.tableBorder,
            '& .hover-visible': {
                opacity: 0,
                transition: 'opacity .25s',
            },
            '&:hover .hover-visible': {
                opacity: 1,
            },
        }}>
      <view_1.View style={{
            width: 200 + 100 * categoryExpandedState,
            color: theme_1.theme.pageTextLight,
            justifyContent: 'center',
            paddingLeft: 5,
            paddingRight: 5,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            userSelect: 'none',
            WebkitUserSelect: 'none',
        }}>
        <button_1.Button variant="bare" aria-label={getExpandStateLabel()} onPress={cycleExpandedState} className="hover-visible" style={{
            color: 'currentColor',
            padding: 3,
            marginRight: 10,
        }}>
          {categoryExpandedState === 0 ? (<v2_1.SvgArrowButtonSingleLeft1 style={{
                width: 12,
                height: 12,
            }}/>) : categoryExpandedState === 1 ? (<v2_1.SvgArrowButtonLeft1 style={{
                width: 12,
                height: 12,
            }}/>) : (<v2_1.SvgArrowButtonRight1 style={{
                width: 12,
                height: 12,
            }}/>)}
        </button_1.Button>
        <view_1.View style={{ flexGrow: '1' }}>
          <react_i18next_1.Trans>Category</react_i18next_1.Trans>
        </view_1.View>
        <button_1.Button ref={triggerRef} variant="bare" aria-label={t('Menu')} onPress={function () { return setMenuOpen(true); }} style={{ color: 'currentColor', padding: 3 }}>
          <v1_1.SvgDotsHorizontalTriple width={15} height={15} style={{ color: theme_1.theme.pageTextLight }}/>
        </button_1.Button>

        <popover_1.Popover triggerRef={triggerRef} isOpen={menuOpen} onOpenChange={function () { return setMenuOpen(false); }} style={{ width: 200 }}>
          <menu_1.Menu onMenuSelect={function (type) {
            if (type === 'toggle-visibility') {
                toggleHiddenCategories();
            }
            else if (type === 'expandAllCategories') {
                expandAllCategories();
            }
            else if (type === 'collapseAllCategories') {
                collapseAllCategories();
            }
            setMenuOpen(false);
        }} items={[
            {
                name: 'toggle-visibility',
                text: t('Toggle hidden categories'),
            },
            {
                name: 'expandAllCategories',
                text: t('Expand all'),
            },
            {
                name: 'collapseAllCategories',
                text: t('Collapse all'),
            },
        ]}/>
        </popover_1.Popover>
      </view_1.View>
      <RenderMonths_1.RenderMonths component={MonthComponent}/>
    </view_1.View>);
});
