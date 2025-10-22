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
exports.defaultFilterSuggestion = defaultFilterSuggestion;
exports.AutocompleteFooter = AutocompleteFooter;
exports.Autocomplete = Autocomplete;
// @ts-strict-ignore
var react_1 = require("react");
var button_1 = require("@actual-app/components/button");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var v2_1 = require("@actual-app/components/icons/v2");
var input_1 = require("@actual-app/components/input");
var popover_1 = require("@actual-app/components/popover");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var downshift_1 = require("downshift");
var normalisation_1 = require("loot-core/shared/normalisation");
var useProperFocus_1 = require("@desktop-client/hooks/useProperFocus");
var inst = {};
function findItem(strict, suggestions, value) {
    if (strict) {
        var idx = suggestions.findIndex(function (item) { return item.id === value; });
        return idx === -1 ? null : suggestions[idx];
    }
    return value;
}
function getItemName(item) {
    if (item == null) {
        return '';
    }
    else if (typeof item === 'string') {
        return item;
    }
    return item.name || '';
}
function getItemId(item) {
    if (typeof item === 'string') {
        return item;
    }
    return item ? item.id : null;
}
function defaultFilterSuggestion(suggestion, value) {
    var name = getItemName(suggestion);
    return (0, normalisation_1.getNormalisedString)(name).includes((0, normalisation_1.getNormalisedString)(value));
}
function defaultFilterSuggestions(suggestions, value) {
    return suggestions.filter(function (suggestion) {
        return defaultFilterSuggestion(suggestion, value);
    });
}
function fireUpdate(onUpdate, strict, suggestions, index, value) {
    // If the index is null, look up the id in the suggestions. If the
    // value is empty it will select nothing (as expected). If it's not
    // empty but nothing is selected, it still resolves to an id. It
    // would very confusing otherwise: the menu could be in a state
    // where nothing is highlighted but there is a valid value.
    var selected = null;
    if (!strict) {
        selected = value;
    }
    else {
        if (index == null) {
            // If passing in a value directly, validate the id
            var sug = suggestions.find(function (sug) { return sug.id === value; });
            if (sug) {
                selected = sug.id;
            }
        }
        else if (index < suggestions.length) {
            selected = suggestions[index].id;
        }
    }
    onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(selected, value);
}
function defaultRenderInput(props) {
    // data-1p-ignore disables 1Password autofill behaviour
    return <input_1.Input data-1p-ignore {...props}/>;
}
function defaultRenderItems(items, getItemProps, highlightedIndex) {
    return (<div>
      {items.map(function (item, index) {
            var name = getItemName(item);
            return (<div {...getItemProps({ item: item })} 
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
            role="button" key={name} className={(0, css_1.css)({
                    padding: 5,
                    cursor: 'default',
                    backgroundColor: highlightedIndex === index
                        ? theme_1.theme.menuAutoCompleteBackgroundHover
                        : undefined,
                })}>
            {name}
          </div>);
        })}
    </div>);
}
function defaultShouldSaveFromKey(e) {
    return e.code === 'Enter';
}
function defaultItemToString(item) {
    return item ? getItemName(item) : '';
}
function SingleAutocomplete(_a) {
    var focused = _a.focused, _b = _a.embedded, embedded = _b === void 0 ? false : _b, containerProps = _a.containerProps, _c = _a.labelProps, labelProps = _c === void 0 ? {} : _c, _d = _a.inputProps, inputProps = _d === void 0 ? {} : _d, suggestions = _a.suggestions, _e = _a.renderInput, renderInput = _e === void 0 ? defaultRenderInput : _e, _f = _a.renderItems, renderItems = _f === void 0 ? defaultRenderItems : _f, _g = _a.itemToString, itemToString = _g === void 0 ? defaultItemToString : _g, _h = _a.shouldSaveFromKey, shouldSaveFromKey = _h === void 0 ? defaultShouldSaveFromKey : _h, _j = _a.filterSuggestions, filterSuggestions = _j === void 0 ? defaultFilterSuggestions : _j, _k = _a.openOnFocus, openOnFocus = _k === void 0 ? true : _k, getHighlightedIndex = _a.getHighlightedIndex, highlightFirst = _a.highlightFirst, onUpdate = _a.onUpdate, strict = _a.strict, onSelect = _a.onSelect, _l = _a.clearOnBlur, clearOnBlur = _l === void 0 ? true : _l, _m = _a.clearOnSelect, clearOnSelect = _m === void 0 ? false : _m, _o = _a.closeOnBlur, closeOnBlur = _o === void 0 ? true : _o, _p = _a.closeOnSelect, closeOnSelect = _p === void 0 ? !clearOnSelect : _p, _q = _a.updateOnValueChange, updateOnValueChange = _q === void 0 ? false : _q, onClose = _a.onClose, initialValue = _a.value;
    var _r = (0, react_1.useState)(function () {
        return findItem(strict, suggestions, initialValue);
    }), selectedItem = _r[0], setSelectedItem = _r[1];
    var _s = (0, react_1.useState)(selectedItem ? getItemName(selectedItem) : ''), value = _s[0], setValue = _s[1];
    var _t = (0, react_1.useState)(false), isChanged = _t[0], setIsChanged = _t[1];
    var _u = (0, react_1.useState)(selectedItem), originalItem = _u[0], setOriginalItem = _u[1];
    var filteredSuggestions = (0, react_1.useMemo)(function () { return filterSuggestions(suggestions, value); }, [filterSuggestions, suggestions, value]);
    var _v = (0, react_1.useState)(null), highlightedIndex = _v[0], setHighlightedIndex = _v[1];
    var _w = (0, react_1.useState)(embedded), isOpen = _w[0], setIsOpen = _w[1];
    var open = function () { return setIsOpen(true); };
    var close = function () {
        setIsOpen(false);
        onClose === null || onClose === void 0 ? void 0 : onClose();
    };
    var triggerRef = (0, react_1.useRef)(null);
    var itemsViewRef = (0, react_1.useRef)(null);
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var narrowInputStyle = embedded && isNarrowWidth
        ? __assign({}, styles_1.styles.mobileMenuItem) : {};
    inputProps = __assign(__assign({}, inputProps), { style: __assign(__assign({}, narrowInputStyle), inputProps.style) });
    // Update the selected item if the suggestion list or initial
    // input value has changed
    (0, react_1.useEffect)(function () {
        setSelectedItem(findItem(strict, suggestions, initialValue));
    }, [initialValue, suggestions, strict]);
    // Sometimes (khem, khem.. on mobile) we want to force update
    // the "value" field (which is also used as a search term) if
    // the initial value changes.
    (0, react_1.useEffect)(function () {
        if (updateOnValueChange) {
            var item = findItem(strict, suggestions, initialValue);
            setValue(item ? getItemName(item) : '');
        }
    }, [strict, suggestions, initialValue, updateOnValueChange]);
    function resetState(newValue) {
        var val = newValue === undefined ? initialValue : newValue;
        var selectedItem = findItem(strict, suggestions, val);
        setSelectedItem(selectedItem);
        setValue(selectedItem ? getItemName(selectedItem) : '');
        setOriginalItem(selectedItem);
        setHighlightedIndex(null);
        setIsOpen(embedded);
        setIsChanged(false);
    }
    function onSelectAfter() {
        setValue('');
        setSelectedItem(null);
        setHighlightedIndex(null);
        setIsChanged(false);
    }
    var filtered = isChanged ? filteredSuggestions || suggestions : suggestions;
    var inputRef = (0, react_1.useRef)(null);
    (0, useProperFocus_1.useProperFocus)(inputRef, focused);
    return (<downshift_1.default onSelect={function (item, _a) {
            var inputValue = _a.inputValue;
            setSelectedItem(item);
            setHighlightedIndex(null);
            if (clearOnSelect) {
                setValue('');
            }
            if (closeOnSelect) {
                close();
            }
            if (onSelect) {
                // I AM NOT PROUD OF THIS OK??
                // This WHOLE FILE is a mess anyway
                // OK SIT DOWN AND I WILL EXPLAIN
                // This component uses `componentWillReceiveProps` and in there
                // it will re-filter suggestions if the suggestions change and
                // a `highlightedIndex` exists. When we select something,
                // we clear `highlightedIndex` so it should show all suggestions
                // again. HOWEVER, in the case of a multi-autocomplete, it's
                // changing the suggestions every time something is selected.
                // In that case, cWRP is running *before* our state setting that
                // cleared `highlightedIndex`. Forcing this to run later assures
                // us that we will clear out local state before cWRP runs.
                // YEAH THAT'S ALL OK I JUST WANT TO SHIP THIS
                setTimeout(function () {
                    onSelect(getItemId(item), inputValue);
                }, 0);
            }
        }} highlightedIndex={highlightedIndex} selectedItem={selectedItem instanceof Object ? selectedItem : null} itemToString={itemToString} inputValue={value} isOpen={isOpen} onInputValueChange={function (value, changes) {
            // OMG this is the dumbest thing ever. I need to remove Downshift
            // and build my own component. For some reason this is fired on blur
            // with an empty value which clears out the input when the app blurs
            if (!document.hasFocus()) {
                return;
            }
            if ([
                // Do nothing if it's simply updating the selected item
                downshift_1.default.stateChangeTypes.controlledPropUpdatedSelectedItem,
                // Do nothing if it is a "touch" selection event
                downshift_1.default.stateChangeTypes.touchEnd,
                downshift_1.default.stateChangeTypes.mouseUp,
                // @ts-expect-error Types say there is no type
            ].includes(changes.type)) {
                return;
            }
            // Otherwise, filter the items and always the first item if
            // desired
            var filteredSuggestions = filterSuggestions(suggestions, value);
            if (value === '') {
                // A blank value shouldn't highlight any item so that the field
                // can be left blank if desired
                // @ts-expect-error Types say there is no type
                if (changes.type !== downshift_1.default.stateChangeTypes.clickItem) {
                    fireUpdate(onUpdate, strict, filteredSuggestions, null, null);
                }
                setHighlightedIndex(null);
            }
            else {
                var defaultGetHighlightedIndex = function (filteredSuggestions) {
                    return highlightFirst && filteredSuggestions.length ? 0 : null;
                };
                var highlightedIndex_1 = (getHighlightedIndex || defaultGetHighlightedIndex)(filteredSuggestions);
                // @ts-expect-error Types say there is no type
                if (changes.type !== downshift_1.default.stateChangeTypes.clickItem) {
                    fireUpdate(onUpdate, strict, filteredSuggestions, highlightedIndex_1, value);
                }
                setHighlightedIndex(highlightedIndex_1);
            }
            setValue(value);
            setIsChanged(true);
            open();
        }} onStateChange={function (changes) {
            if (!clearOnBlur &&
                (changes.type === downshift_1.default.stateChangeTypes.mouseUp ||
                    changes.type === downshift_1.default.stateChangeTypes.touchEnd)) {
                return;
            }
            if ('highlightedIndex' in changes &&
                changes.type !== downshift_1.default.stateChangeTypes.changeInput) {
                setHighlightedIndex(changes.highlightedIndex);
            }
            if ('selectedItem' in changes) {
                setSelectedItem(changes.selectedItem);
            }
            // We only ever want to update the value if the user explicitly
            // highlighted an item via the keyboard. It shouldn't change with
            // mouseover; otherwise the user could accidentally hover over an
            // item without realizing it and change the value.
            if (isOpen &&
                (changes.type === downshift_1.default.stateChangeTypes.keyDownArrowUp ||
                    changes.type === downshift_1.default.stateChangeTypes.keyDownArrowDown)) {
                fireUpdate(onUpdate, strict, filteredSuggestions || suggestions, changes.highlightedIndex != null
                    ? changes.highlightedIndex
                    : highlightedIndex, value);
            }
            inst.lastChangeType = changes.type;
        }} labelId={labelProps === null || labelProps === void 0 ? void 0 : labelProps.id}>
      {function (_a) {
            var _b;
            var getInputProps = _a.getInputProps, getItemProps = _a.getItemProps, isOpen = _a.isOpen, inputValue = _a.inputValue, highlightedIndex = _a.highlightedIndex;
            return (
            // Super annoying but it works best to return a div so we
            // can't use a View here, but we can fake it be using the
            // className
            <div className={(0, css_1.cx)('view', (0, css_1.css)({ display: 'flex' }))} {...containerProps}>
          <view_1.View ref={triggerRef} style={{ flexShrink: 0 }}>
            {renderInput((function () {
                    var _a = inputProps || {}, className = _a.className, style = _a.style, restInputProps = __rest(_a, ["className", "style"]);
                    var downshiftProps = getInputProps(__assign(__assign({ ref: inputRef }, restInputProps), { onFocus: function (e) {
                            var _a;
                            (_a = inputProps.onFocus) === null || _a === void 0 ? void 0 : _a.call(inputProps, e);
                            if (openOnFocus) {
                                open();
                            }
                        }, onBlur: function (e) {
                            var _a, _b;
                            // Should this be e.nativeEvent
                            e['preventDownshiftDefault'] = true;
                            (_a = inputProps.onBlur) === null || _a === void 0 ? void 0 : _a.call(inputProps, e);
                            if (!closeOnBlur) {
                                return;
                            }
                            if ((_b = itemsViewRef.current) === null || _b === void 0 ? void 0 : _b.contains(e.relatedTarget)) {
                                // Do not close when the user clicks on any of the items.
                                e.stopPropagation();
                                return;
                            }
                            if (clearOnBlur) {
                                if (e.target.value === '') {
                                    onSelect === null || onSelect === void 0 ? void 0 : onSelect(null, e.target.value);
                                    setSelectedItem(null);
                                    close();
                                    return;
                                }
                                // If not using table behavior, reset the input on blur. Tables
                                // handle saving the value on blur.
                                var value_1 = selectedItem
                                    ? getItemId(selectedItem)
                                    : null;
                                resetState(value_1);
                            }
                            else {
                                close();
                            }
                        }, onKeyDown: function (e) {
                            var onKeyDown = (inputProps || {}).onKeyDown;
                            // If the dropdown is open, an item is highlighted, and the user
                            // pressed enter, always capture that and handle it ourselves
                            if (isOpen) {
                                if (e.key === 'Enter') {
                                    if (highlightedIndex != null) {
                                        if (inst.lastChangeType ===
                                            downshift_1.default.stateChangeTypes.itemMouseEnter) {
                                            // If the last thing the user did was hover an item, intentionally
                                            // ignore the default behavior of selecting the item. It's too
                                            // common to accidentally hover an item and then save it
                                            e.preventDefault();
                                        }
                                        else {
                                            // Otherwise, stop propagation so that the table navigator
                                            // doesn't handle it
                                            e.stopPropagation();
                                        }
                                    }
                                    else if (!strict) {
                                        // Handle it ourselves
                                        e.stopPropagation();
                                        onSelect(value, e.target.value);
                                        return onSelectAfter();
                                    }
                                    else {
                                        // No highlighted item, still allow the table to save the item
                                        // as `null`, even though we're allowing the table to move
                                        e.preventDefault();
                                        onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(e);
                                    }
                                }
                                else if (shouldSaveFromKey(e)) {
                                    e.preventDefault();
                                    onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(e);
                                }
                            }
                            // Handle escape ourselves
                            if (e.key === 'Escape') {
                                e.nativeEvent['preventDownshiftDefault'] = true;
                                if (!embedded) {
                                    e.stopPropagation();
                                }
                                fireUpdate(onUpdate, strict, suggestions, null, getItemId(originalItem));
                                setValue(getItemName(originalItem));
                                setSelectedItem(findItem(strict, suggestions, originalItem));
                                setHighlightedIndex(null);
                                if (embedded) {
                                    open();
                                }
                                else {
                                    close();
                                }
                            }
                        } }));
                    return __assign(__assign(__assign({}, downshiftProps), (className && { className: className })), (style && { style: style }));
                })())}
          </view_1.View>
          {isOpen &&
                    filtered.length > 0 &&
                    (embedded ? (<view_1.View ref={itemsViewRef} style={__assign(__assign({}, styles_1.styles.darkScrollbar), { marginTop: 5 })} data-testid="autocomplete">
                {renderItems(filtered, getItemProps, highlightedIndex, inputValue)}
              </view_1.View>) : (<popover_1.Popover triggerRef={triggerRef} placement="bottom start" offset={2} isOpen={isOpen} onOpenChange={close} isNonModal style={__assign(__assign(__assign({}, styles_1.styles.darkScrollbar), styles_1.styles.popover), { backgroundColor: theme_1.theme.menuAutoCompleteBackground, color: theme_1.theme.menuAutoCompleteText, minWidth: 200, width: (_b = triggerRef.current) === null || _b === void 0 ? void 0 : _b.clientWidth })} data-testid="autocomplete">
                <view_1.View ref={itemsViewRef}>
                  {renderItems(filtered, getItemProps, highlightedIndex, inputValue)}
                </view_1.View>
              </popover_1.Popover>))}
        </div>);
        }}
    </downshift_1.default>);
}
function MultiItem(_a) {
    var name = _a.name, onRemove = _a.onRemove;
    return (<view_1.View style={{
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: theme_1.theme.pillBackgroundSelected,
            padding: '2px 4px',
            margin: '2px',
            borderRadius: 4,
        }}>
      {name}
      <button_1.Button variant="bare" style={{ marginLeft: 1 }} onPress={onRemove}>
        <v2_1.SvgRemove style={{ width: 8, height: 8 }}/>
      </button_1.Button>
    </view_1.View>);
}
var defaultMultiAutocompleteInputClassName = (0, css_1.css)({
    flex: 1,
    minWidth: 30,
    border: 0,
    '&[data-focused]': { border: 0, boxShadow: 'none' },
});
function MultiAutocomplete(_a) {
    var _b = _a.value, selectedItems = _b === void 0 ? [] : _b, onSelect = _a.onSelect, suggestions = _a.suggestions, strict = _a.strict, _c = _a.clearOnBlur, clearOnBlur = _c === void 0 ? true : _c, props = __rest(_a, ["value", "onSelect", "suggestions", "strict", "clearOnBlur"]);
    var _d = (0, react_1.useState)(false), focused = _d[0], setFocused = _d[1];
    var selectedItemIds = selectedItems.map(getItemId);
    var inputRef = (0, react_1.useRef)(null);
    (0, useProperFocus_1.useProperFocus)(inputRef, focused);
    function onRemoveItem(id) {
        var items = selectedItemIds.filter(function (i) { return i !== id; });
        onSelect(items);
    }
    function onAddItem(id, value) {
        if (id) {
            id = id.trim();
            onSelect(__spreadArray(__spreadArray([], selectedItemIds, true), [id], false), value);
        }
    }
    function onKeyDown(e, prevOnKeyDown) {
        if (e.key === 'Backspace' && e.currentTarget.value === '') {
            onRemoveItem(selectedItemIds[selectedItems.length - 1]);
        }
        prevOnKeyDown === null || prevOnKeyDown === void 0 ? void 0 : prevOnKeyDown(e);
    }
    return (<Autocomplete {...props} type="single" value={null} clearOnBlur={clearOnBlur} clearOnSelect={true} suggestions={suggestions.filter(function (item) { return !selectedItemIds.includes(getItemId(item)); })} onSelect={onAddItem} highlightFirst strict={strict} renderInput={function (_a) {
            var inputClassName = _a.className, inputProps = __rest(_a, ["className"]);
            return (<view_1.View style={__assign({ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center', backgroundColor: theme_1.theme.tableBackground, borderRadius: 4, border: '1px solid ' + theme_1.theme.formInputBorder }, (focused && {
                    border: '1px solid ' + theme_1.theme.formInputBorderSelected,
                    boxShadow: '0 1px 1px ' + theme_1.theme.formInputShadowSelected,
                }))}>
          {selectedItems.map(function (item, idx) {
                    item = findItem(strict, suggestions, item);
                    return (item && (<MultiItem key={getItemId(item) || idx} name={getItemName(item)} onRemove={function () { return onRemoveItem(getItemId(item)); }}/>));
                })}
          <input_1.Input {...inputProps} ref={inputRef} onKeyDown={function (e) { return onKeyDown(e, inputProps.onKeyDown); }} onFocus={function (e) {
                    setFocused(true);
                    inputProps.onFocus(e);
                }} onBlur={function (e) {
                    setFocused(false);
                    inputProps.onBlur(e);
                }} className={typeof inputClassName === 'function'
                    ? function (renderProps) {
                        return (0, css_1.cx)(defaultMultiAutocompleteInputClassName, inputClassName(renderProps));
                    }
                    : (0, css_1.cx)(defaultMultiAutocompleteInputClassName, inputClassName)}/>
        </view_1.View>);
        }}/>);
}
function AutocompleteFooter(_a) {
    var _b = _a.show, show = _b === void 0 ? true : _b, embedded = _a.embedded, children = _a.children;
    if (!show) {
        return null;
    }
    return (<view_1.View style={__assign({ flexShrink: 0 }, (embedded ? { paddingTop: 5 } : { padding: 5 }))}>
      {children}
    </view_1.View>);
}
function Autocomplete(_a) {
    var props = __rest(_a, []);
    if (props.type === 'multi') {
        return <MultiAutocomplete {...props}/>;
    }
    return <SingleAutocomplete {...props}/>;
}
