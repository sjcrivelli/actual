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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.PayeeAutocomplete = PayeeAutocomplete;
exports.CreatePayeeButton = CreatePayeeButton;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var v1_1 = require("@actual-app/components/icons/v1");
var styles_1 = require("@actual-app/components/styles");
var text_one_line_1 = require("@actual-app/components/text-one-line");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var normalisation_1 = require("loot-core/shared/normalisation");
var Autocomplete_1 = require("./Autocomplete");
var ItemHeader_1 = require("./ItemHeader");
var useAccounts_1 = require("@desktop-client/hooks/useAccounts");
var usePayees_1 = require("@desktop-client/hooks/usePayees");
var payeesSlice_1 = require("@desktop-client/payees/payeesSlice");
var redux_1 = require("@desktop-client/redux");
var MAX_AUTO_SUGGESTIONS = 5;
function getPayeeSuggestions(commonPayees, payees) {
    var favoritePayees = payees
        .filter(function (p) { return p.favorite; })
        .map(function (p) {
        return __assign(__assign({}, p), { itemType: determineItemType(p, true) });
    })
        .sort(function (a, b) { return a.name.localeCompare(b.name); });
    var additionalCommonPayees = [];
    if ((commonPayees === null || commonPayees === void 0 ? void 0 : commonPayees.length) > 0) {
        if (favoritePayees.length < MAX_AUTO_SUGGESTIONS) {
            additionalCommonPayees = commonPayees
                .filter(function (p) { return !(p.favorite || favoritePayees.map(function (fp) { return fp.id; }).includes(p.id)); })
                .slice(0, MAX_AUTO_SUGGESTIONS - favoritePayees.length)
                .map(function (p) {
                return __assign(__assign({}, p), { itemType: determineItemType(p, true) });
            })
                .sort(function (a, b) { return a.name.localeCompare(b.name); });
        }
    }
    if (favoritePayees.length + additionalCommonPayees.length) {
        var filteredPayees = payees
            .filter(function (p) { return !favoritePayees.find(function (fp) { return fp.id === p.id; }); })
            .filter(function (p) { return !additionalCommonPayees.find(function (fp) { return fp.id === p.id; }); })
            .map(function (p) {
            return __assign(__assign({}, p), { itemType: determineItemType(p, false) });
        });
        return favoritePayees.concat(additionalCommonPayees).concat(filteredPayees);
    }
    return payees.map(function (p) {
        return __assign(__assign({}, p), { itemType: determineItemType(p, false) });
    });
}
function filterActivePayees(payees, accounts) {
    return accounts ? (0, payeesSlice_1.getActivePayees)(payees, accounts) : payees;
}
function filterTransferPayees(payees) {
    return payees.filter(function (payee) { return !!payee.transfer_acct; });
}
function makeNew(id, rawPayee) {
    if (id === 'new' && !rawPayee.startsWith('new:')) {
        return 'new:' + rawPayee;
    }
    return id;
}
// Convert the fully resolved new value into the 'new' id that can be
// looked up in the suggestions
function stripNew(value) {
    if (typeof value === 'string' && value.startsWith('new:')) {
        return 'new';
    }
    return value;
}
function determineItemType(item, isCommon) {
    if (item.transfer_acct) {
        return 'account';
    }
    if (isCommon) {
        return 'common_payee';
    }
    else {
        return 'payee';
    }
}
function PayeeList(_a) {
    var items = _a.items, getItemProps = _a.getItemProps, highlightedIndex = _a.highlightedIndex, embedded = _a.embedded, inputValue = _a.inputValue, _b = _a.renderCreatePayeeButton, renderCreatePayeeButton = _b === void 0 ? defaultRenderCreatePayeeButton : _b, _c = _a.renderPayeeItemGroupHeader, renderPayeeItemGroupHeader = _c === void 0 ? defaultRenderPayeeItemGroupHeader : _c, _d = _a.renderPayeeItem, renderPayeeItem = _d === void 0 ? defaultRenderPayeeItem : _d, footer = _a.footer;
    var t = (0, react_i18next_1.useTranslation)().t;
    // If the "new payee" item exists, create it as a special-cased item
    // with the value of the input so it always shows whatever the user
    // entered
    var _e = (0, react_1.useMemo)(function () {
        var currentIndex = 0;
        var result = items.reduce(function (acc, item) {
            if (item.id === 'new') {
                acc.newPayee = __assign({}, item);
            }
            else if (item.itemType === 'common_payee') {
                acc.suggestedPayees.push(__assign({}, item));
            }
            else if (item.itemType === 'payee') {
                acc.payees.push(__assign({}, item));
            }
            else if (item.itemType === 'account') {
                acc.transferPayees.push(__assign({}, item));
            }
            return acc;
        }, {
            newPayee: null,
            suggestedPayees: [],
            payees: [],
            transferPayees: [],
        });
        // assign indexes in render order
        var newPayeeWithIndex = result.newPayee
            ? __assign(__assign({}, result.newPayee), { highlightedIndex: currentIndex++ }) : null;
        var suggestedPayeesWithIndex = result.suggestedPayees.map(function (item) { return (__assign(__assign({}, item), { highlightedIndex: currentIndex++ })); });
        var payeesWithIndex = result.payees.map(function (item) { return (__assign(__assign({}, item), { highlightedIndex: currentIndex++ })); });
        var transferPayeesWithIndex = result.transferPayees.map(function (item) { return (__assign(__assign({}, item), { highlightedIndex: currentIndex++ })); });
        return {
            newPayee: newPayeeWithIndex,
            suggestedPayees: suggestedPayeesWithIndex,
            payees: payeesWithIndex,
            transferPayees: transferPayeesWithIndex,
        };
    }, [items]), newPayee = _e.newPayee, suggestedPayees = _e.suggestedPayees, payees = _e.payees, transferPayees = _e.transferPayees;
    // We limit the number of payees shown to 100.
    // So we show a hint that more are available via search.
    var showSearchForMore = items.length > 100;
    return (<view_1.View>
      <view_1.View style={__assign({ overflow: 'auto', padding: '5px 0' }, (!embedded && { maxHeight: 175 }))}>
        {newPayee &&
            renderCreatePayeeButton(__assign(__assign({}, (getItemProps ? getItemProps({ item: newPayee }) : {})), { payeeName: inputValue, highlighted: newPayee.highlightedIndex === highlightedIndex, embedded: embedded }))}

        {suggestedPayees.length > 0 &&
            renderPayeeItemGroupHeader({ title: t('Suggested Payees') })}
        {suggestedPayees.map(function (item) { return (<react_1.Fragment key={item.id}>
            {renderPayeeItem(__assign(__assign({}, (getItemProps ? getItemProps({ item: item }) : {})), { item: item, highlighted: highlightedIndex === item.highlightedIndex, embedded: embedded }))}
          </react_1.Fragment>); })}

        {payees.length > 0 &&
            renderPayeeItemGroupHeader({ title: t('Payees') })}
        {payees.map(function (item) { return (<react_1.Fragment key={item.id}>
            {renderPayeeItem(__assign(__assign({}, (getItemProps ? getItemProps({ item: item }) : {})), { item: item, highlighted: highlightedIndex === item.highlightedIndex, embedded: embedded }))}
          </react_1.Fragment>); })}

        {transferPayees.length > 0 &&
            renderPayeeItemGroupHeader({ title: t('Transfer To/From') })}
        {transferPayees.map(function (item) { return (<react_1.Fragment key={item.id}>
            {renderPayeeItem(__assign(__assign({}, (getItemProps ? getItemProps({ item: item }) : {})), { item: item, highlighted: highlightedIndex === item.highlightedIndex, embedded: embedded }))}
          </react_1.Fragment>); })}

        {showSearchForMore && (<div style={{
                fontSize: 11,
                padding: 5,
                color: theme_1.theme.pageTextLight,
                textAlign: 'center',
            }}>
            <react_i18next_1.Trans>More payees are available, search to find them</react_i18next_1.Trans>
          </div>)}
      </view_1.View>
      {footer}
    </view_1.View>);
}
function PayeeAutocomplete(_a) {
    var value = _a.value, inputProps = _a.inputProps, _b = _a.showInactivePayees, showInactivePayees = _b === void 0 ? false : _b, _c = _a.showMakeTransfer, showMakeTransfer = _c === void 0 ? true : _c, _d = _a.showManagePayees, showManagePayees = _d === void 0 ? false : _d, _e = _a.clearOnBlur, clearOnBlur = _e === void 0 ? true : _e, closeOnBlur = _a.closeOnBlur, embedded = _a.embedded, onUpdate = _a.onUpdate, onSelect = _a.onSelect, onManagePayees = _a.onManagePayees, _f = _a.renderCreatePayeeButton, renderCreatePayeeButton = _f === void 0 ? defaultRenderCreatePayeeButton : _f, _g = _a.renderPayeeItemGroupHeader, renderPayeeItemGroupHeader = _g === void 0 ? defaultRenderPayeeItemGroupHeader : _g, _h = _a.renderPayeeItem, renderPayeeItem = _h === void 0 ? defaultRenderPayeeItem : _h, accounts = _a.accounts, payees = _a.payees, props = __rest(_a, ["value", "inputProps", "showInactivePayees", "showMakeTransfer", "showManagePayees", "clearOnBlur", "closeOnBlur", "embedded", "onUpdate", "onSelect", "onManagePayees", "renderCreatePayeeButton", "renderPayeeItemGroupHeader", "renderPayeeItem", "accounts", "payees"]);
    var commonPayees = (0, usePayees_1.useCommonPayees)();
    var retrievedPayees = (0, usePayees_1.usePayees)();
    if (!payees) {
        payees = retrievedPayees;
    }
    var cachedAccounts = (0, useAccounts_1.useAccounts)();
    if (!accounts) {
        accounts = cachedAccounts;
    }
    var _j = (0, react_1.useState)(false), focusTransferPayees = _j[0], setFocusTransferPayees = _j[1];
    var _k = (0, react_1.useState)(''), rawPayee = _k[0], setRawPayee = _k[1];
    var hasPayeeInput = !!rawPayee;
    var payeeSuggestions = (0, react_1.useMemo)(function () {
        var suggestions = getPayeeSuggestions(commonPayees, payees);
        var filteredSuggestions = __spreadArray([], suggestions, true);
        if (!showInactivePayees) {
            filteredSuggestions = filterActivePayees(filteredSuggestions, accounts);
        }
        if (focusTransferPayees) {
            filteredSuggestions = filterTransferPayees(filteredSuggestions);
        }
        if (!hasPayeeInput) {
            return filteredSuggestions;
        }
        return __spreadArray([{ id: 'new', favorite: false, name: '' }], filteredSuggestions, true);
    }, [
        commonPayees,
        payees,
        focusTransferPayees,
        accounts,
        hasPayeeInput,
        showInactivePayees,
    ]);
    var dispatch = (0, redux_1.useDispatch)();
    function handleSelect(idOrIds, rawInputValue) {
        return __awaiter(this, void 0, void 0, function () {
            var create_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!clearOnBlur) return [3 /*break*/, 1];
                        onSelect === null || onSelect === void 0 ? void 0 : onSelect(makeNew(idOrIds, rawInputValue), rawInputValue);
                        return [3 /*break*/, 6];
                    case 1:
                        create_1 = function (payeeName) {
                            return dispatch((0, payeesSlice_1.createPayee)({ name: payeeName })).unwrap();
                        };
                        if (!Array.isArray(idOrIds)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Promise.all(idOrIds.map(function (v) { return (v === 'new' ? create_1(rawInputValue) : v); }))];
                    case 2:
                        idOrIds = _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        if (!(idOrIds === 'new')) return [3 /*break*/, 5];
                        return [4 /*yield*/, create_1(rawInputValue)];
                    case 4:
                        idOrIds = _a.sent();
                        _a.label = 5;
                    case 5:
                        onSelect === null || onSelect === void 0 ? void 0 : onSelect(idOrIds, rawInputValue);
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    var _l = (0, react_1.useState)(false), payeeFieldFocused = _l[0], setPayeeFieldFocused = _l[1];
    return (<Autocomplete_1.Autocomplete key={focusTransferPayees ? 'transfers' : 'all'} strict={true} embedded={embedded} value={stripNew(value)} suggestions={payeeSuggestions} clearOnBlur={clearOnBlur} closeOnBlur={closeOnBlur} itemToString={function (item) {
            if (!item) {
                return '';
            }
            else if (item.id === 'new') {
                return rawPayee;
            }
            return item.name;
        }} focused={payeeFieldFocused} inputProps={__assign(__assign({}, inputProps), { autoCapitalize: 'words', onBlur: function () {
                setRawPayee('');
                setPayeeFieldFocused(false);
            }, onFocus: function () { return setPayeeFieldFocused(true); }, onChangeValue: setRawPayee })} onUpdate={function (id, inputValue) { return onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(id, makeNew(id, inputValue)); }} onSelect={handleSelect} getHighlightedIndex={function (suggestions) {
            if (suggestions.length > 1 && suggestions[0].id === 'new') {
                return 1;
            }
            return 0;
        }} filterSuggestions={function (suggestions, value) {
            var filtered = suggestions.filter(function (suggestion) {
                if (suggestion.id === 'new') {
                    return !value || value === '' || focusTransferPayees ? false : true;
                }
                return (0, Autocomplete_1.defaultFilterSuggestion)(suggestion, value);
            });
            filtered.sort(function (p1, p2) {
                var r1 = (0, normalisation_1.getNormalisedString)(p1.name).startsWith((0, normalisation_1.getNormalisedString)(value));
                var r2 = (0, normalisation_1.getNormalisedString)(p2.name).startsWith((0, normalisation_1.getNormalisedString)(value));
                var r1exact = p1.name.toLowerCase() === value.toLowerCase();
                var r2exact = p2.name.toLowerCase() === value.toLowerCase();
                // (maniacal laughter) mwahaHAHAHAHAH
                if (p1.id === 'new') {
                    return -1;
                }
                else if (p2.id === 'new') {
                    return 1;
                }
                else {
                    if (r1exact && !r2exact) {
                        return -1;
                    }
                    else if (!r1exact && r2exact) {
                        return 1;
                    }
                    else {
                        if (r1 === r2) {
                            return 0;
                        }
                        else if (r1 && !r2) {
                            return -1;
                        }
                        else {
                            return 1;
                        }
                    }
                }
            });
            // Only show the first 100 results, users can search to find more.
            // If user want to view all payees, it can be done via the manage payees page.
            filtered = filtered.slice(0, 100);
            if (filtered.length >= 2 && filtered[0].id === 'new') {
                if (filtered[1].name.toLowerCase() === value.toLowerCase() &&
                    !filtered[1].transfer_acct) {
                    return filtered.slice(1);
                }
            }
            return filtered;
        }} renderItems={function (items, getItemProps, highlightedIndex, inputValue) { return (<PayeeList items={items} commonPayees={commonPayees} getItemProps={getItemProps} highlightedIndex={highlightedIndex} inputValue={inputValue} embedded={embedded} renderCreatePayeeButton={renderCreatePayeeButton} renderPayeeItemGroupHeader={renderPayeeItemGroupHeader} renderPayeeItem={renderPayeeItem} footer={<Autocomplete_1.AutocompleteFooter embedded={embedded}>
              {showMakeTransfer && (<button_1.Button variant={focusTransferPayees ? 'menuSelected' : 'menu'} style={showManagePayees && { marginBottom: 5 }} onPress={function () {
                        onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(null, null);
                        setFocusTransferPayees(!focusTransferPayees);
                    }}>
                  <react_i18next_1.Trans>Make transfer</react_i18next_1.Trans>
                </button_1.Button>)}
              {showManagePayees && (<button_1.Button variant="menu" onPress={function () { return onManagePayees(); }}>
                  <react_i18next_1.Trans>Manage payees</react_i18next_1.Trans>
                </button_1.Button>)}
            </Autocomplete_1.AutocompleteFooter>}/>); }} {...props}/>);
}
function CreatePayeeButton(_a) {
    var Icon = _a.Icon, payeeName = _a.payeeName, highlighted = _a.highlighted, embedded = _a.embedded, style = _a.style, props = __rest(_a, ["Icon", "payeeName", "highlighted", "embedded", "style"]);
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var narrowStyle = isNarrowWidth
        ? __assign({}, styles_1.styles.mobileMenuItem) : {};
    var iconSize = isNarrowWidth ? 14 : 8;
    return (<view_1.View data-testid="create-payee-button" style={__assign(__assign({ display: 'block', flex: '1 0', color: highlighted
                ? theme_1.theme.menuAutoCompleteTextHover
                : theme_1.theme.noticeTextMenu, borderRadius: embedded ? 4 : 0, fontSize: 11, fontWeight: 500, padding: '6px 9px', backgroundColor: highlighted
                ? theme_1.theme.menuAutoCompleteBackgroundHover
                : 'transparent', ':active': {
                backgroundColor: 'rgba(100, 100, 100, .25)',
            } }, narrowStyle), style)} {...props}>
      {Icon ? (<Icon style={{ marginRight: 5, display: 'inline-block' }}/>) : (<v1_1.SvgAdd width={iconSize} height={iconSize} style={{ marginRight: 5, display: 'inline-block' }}/>)}
      <react_i18next_1.Trans>Create payee “{{ payeeName: payeeName }}”</react_i18next_1.Trans>
    </view_1.View>);
}
function defaultRenderCreatePayeeButton(props) {
    return <CreatePayeeButton {...props}/>;
}
function defaultRenderPayeeItemGroupHeader(props) {
    return <ItemHeader_1.ItemHeader {...props} type="payee"/>;
}
function PayeeItem(_a) {
    var item = _a.item, className = _a.className, highlighted = _a.highlighted, embedded = _a.embedded, props = __rest(_a, ["item", "className", "highlighted", "embedded"]);
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var narrowStyle = isNarrowWidth
        ? __assign(__assign({}, styles_1.styles.mobileMenuItem), { borderRadius: 0, borderTop: "1px solid ".concat(theme_1.theme.pillBorder) }) : {};
    var iconSize = isNarrowWidth ? 14 : 8;
    var paddingLeftOverFromIcon = 20;
    var itemIcon = undefined;
    if (item.favorite) {
        itemIcon = (<v1_1.SvgBookmark width={iconSize} height={iconSize} style={{ marginRight: 5, display: 'inline-block' }}/>);
        paddingLeftOverFromIcon -= iconSize + 5;
    }
    return (<div 
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
                : theme_1.theme.menuAutoCompleteItemText, borderRadius: embedded ? 4 : 0, padding: 4, paddingLeft: paddingLeftOverFromIcon }, narrowStyle)))} data-testid={"".concat(item.name, "-payee-item")} data-highlighted={highlighted || undefined} {...props}>
      <text_one_line_1.TextOneLine>
        {itemIcon}
        {item.name}
      </text_one_line_1.TextOneLine>
    </div>);
}
function defaultRenderPayeeItem(props) {
    return <PayeeItem {...props}/>;
}
