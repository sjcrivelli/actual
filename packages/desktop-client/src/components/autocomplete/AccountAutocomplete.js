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
exports.AccountAutocomplete = AccountAutocomplete;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var styles_1 = require("@actual-app/components/styles");
var text_one_line_1 = require("@actual-app/components/text-one-line");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var Autocomplete_1 = require("./Autocomplete");
var ItemHeader_1 = require("./ItemHeader");
var useAccounts_1 = require("@desktop-client/hooks/useAccounts");
function AccountList(_a) {
    var items = _a.items, getItemProps = _a.getItemProps, highlightedIndex = _a.highlightedIndex, embedded = _a.embedded, _b = _a.renderAccountItemGroupHeader, renderAccountItemGroupHeader = _b === void 0 ? defaultRenderAccountItemGroupHeader : _b, _c = _a.renderAccountItem, renderAccountItem = _c === void 0 ? defaultRenderAccountItem : _c;
    var t = (0, react_i18next_1.useTranslation)().t;
    // Split by onbudget, offbudget, closed and add their indeces relative
    // to the full list. This is needed to highlight the correct item.
    var _d = (0, react_1.useMemo)(function () {
        return items.reduce(function (acc, item, index) {
            if (item.closed) {
                acc.closedAccounts.push(__assign(__assign({}, item), { highlightedIndex: index }));
            }
            else if (item.offbudget) {
                acc.offBudgetAccounts.push(__assign(__assign({}, item), { highlightedIndex: index }));
            }
            else {
                acc.onBudgetAccounts.push(__assign(__assign({}, item), { highlightedIndex: index }));
            }
            return acc;
        }, {
            onBudgetAccounts: [],
            offBudgetAccounts: [],
            closedAccounts: [],
        });
    }, [items]), onBudgetAccounts = _d.onBudgetAccounts, offBudgetAccounts = _d.offBudgetAccounts, closedAccounts = _d.closedAccounts;
    return (<view_1.View>
      <view_1.View style={__assign({ overflow: 'auto', padding: '5px 0' }, (!embedded && { maxHeight: 175 }))}>
        {onBudgetAccounts.length > 0 && (<react_1.Fragment key="On budget">
            {renderAccountItemGroupHeader({ title: t('On budget') })}
          </react_1.Fragment>)}
        {onBudgetAccounts.map(function (item) { return (<react_1.Fragment key={item.id}>
            {renderAccountItem(__assign(__assign({}, (getItemProps ? getItemProps({ item: item }) : {})), { item: item, highlighted: highlightedIndex === item.highlightedIndex, embedded: embedded }))}
          </react_1.Fragment>); })}

        {offBudgetAccounts.length > 0 && (<react_1.Fragment key="Off budget">
            {renderAccountItemGroupHeader({ title: t('Off budget') })}
          </react_1.Fragment>)}
        {offBudgetAccounts.map(function (item) { return (<react_1.Fragment key={item.id}>
            {renderAccountItem(__assign(__assign({}, (getItemProps ? getItemProps({ item: item }) : {})), { item: item, highlighted: highlightedIndex === item.highlightedIndex, embedded: embedded }))}
          </react_1.Fragment>); })}

        {closedAccounts.length > 0 && (<react_1.Fragment key="Closed accounts">
            {renderAccountItemGroupHeader({ title: t('Closed accounts') })}
          </react_1.Fragment>)}
        {closedAccounts.map(function (item) { return (<react_1.Fragment key={item.id}>
            {renderAccountItem(__assign(__assign({}, (getItemProps ? getItemProps({ item: item }) : {})), { item: item, highlighted: highlightedIndex === item.highlightedIndex, embedded: embedded }))}
          </react_1.Fragment>); })}
      </view_1.View>
    </view_1.View>);
}
function AccountAutocomplete(_a) {
    var embedded = _a.embedded, _b = _a.includeClosedAccounts, includeClosedAccounts = _b === void 0 ? true : _b, renderAccountItemGroupHeader = _a.renderAccountItemGroupHeader, renderAccountItem = _a.renderAccountItem, closeOnBlur = _a.closeOnBlur, hiddenAccounts = _a.hiddenAccounts, props = __rest(_a, ["embedded", "includeClosedAccounts", "renderAccountItemGroupHeader", "renderAccountItem", "closeOnBlur", "hiddenAccounts"]);
    var accounts = (0, useAccounts_1.useAccounts)() || [];
    //remove closed accounts if needed
    //then sort by closed, then offbudget
    var accountSuggestions = accounts
        .filter(function (item) {
        return ((includeClosedAccounts ? item : !item.closed) &&
            !(hiddenAccounts === null || hiddenAccounts === void 0 ? void 0 : hiddenAccounts.includes(item.id)));
    })
        .sort(function (a, b) {
        return a.closed - b.closed ||
            a.offbudget - b.offbudget ||
            a.sort_order - b.sort_order;
    });
    return (<Autocomplete_1.Autocomplete strict={true} highlightFirst={true} embedded={embedded} closeOnBlur={closeOnBlur} suggestions={accountSuggestions} renderItems={function (items, getItemProps, highlightedIndex) { return (<AccountList items={items} getItemProps={getItemProps} highlightedIndex={highlightedIndex} embedded={embedded} renderAccountItemGroupHeader={renderAccountItemGroupHeader} renderAccountItem={renderAccountItem}/>); }} {...props}/>);
}
function defaultRenderAccountItemGroupHeader(props) {
    return <ItemHeader_1.ItemHeader {...props} type="account"/>;
}
function AccountItem(_a) {
    var item = _a.item, className = _a.className, highlighted = _a.highlighted, embedded = _a.embedded, props = __rest(_a, ["item", "className", "highlighted", "embedded"]);
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var narrowStyle = isNarrowWidth
        ? __assign(__assign({}, styles_1.styles.mobileMenuItem), { borderRadius: 0, borderTop: "1px solid ".concat(theme_1.theme.pillBorder) }) : {};
    return (<div 
    // List each account up to a max
    // Downshift calls `setTimeout(..., 250)` in the `onMouseMove`
    // event handler they set on this element. When this code runs
    // in WebKit on touch-enabled devices, taps on this element end
    // up not triggering the `onClick` event (and therefore delaying
    // response to user input) until after the `setTimeout` callback
    // finishes executing. This is caused by content observation code
    // that implements various strategies to prevent the user from
    // accidentally clicking content that changed as a result of code
    // run in the `onMouseMove` event.
    //
    // Long story short, we don't want any delay here between the user
    // tapping and the resulting action being performed. It turns out
    // there's some "fast path" logic that can be triggered in various
    // ways to force WebKit to bail on the content observation process.
    // One of those ways is setting `role="button"` (or a number of
    // other aria roles) on the element, which is what we're doing here.
    //
    // ref:
    // * https://github.com/WebKit/WebKit/blob/447d90b0c52b2951a69df78f06bb5e6b10262f4b/LayoutTests/fast/events/touch/ios/content-observation/400ms-hover-intent.html
    // * https://github.com/WebKit/WebKit/blob/58956cf59ba01267644b5e8fe766efa7aa6f0c5c/Source/WebCore/page/ios/ContentChangeObserver.cpp
    // * https://github.com/WebKit/WebKit/blob/58956cf59ba01267644b5e8fe766efa7aa6f0c5c/Source/WebKit/WebProcess/WebPage/ios/WebPageIOS.mm#L783
    role="button" className={(0, css_1.cx)(className, (0, css_1.css)(__assign({ backgroundColor: highlighted
                ? theme_1.theme.menuAutoCompleteBackgroundHover
                : 'transparent', color: highlighted
                ? theme_1.theme.menuAutoCompleteItemTextHover
                : theme_1.theme.menuAutoCompleteItemText, padding: 4, paddingLeft: 20, borderRadius: embedded ? 4 : 0 }, narrowStyle)))} data-testid={"".concat(item.name, "-account-item")} data-highlighted={highlighted || undefined} {...props}>
      <text_one_line_1.TextOneLine>{item.name}</text_one_line_1.TextOneLine>
    </div>);
}
function defaultRenderAccountItem(props) {
    return <AccountItem {...props}/>;
}
