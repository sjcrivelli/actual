import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-strict-ignore
import { useEffect, useMemo, useRef, useState, } from 'react';
import { Button } from '@actual-app/components/button';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { SvgRemove } from '@actual-app/components/icons/v2';
import { Input } from '@actual-app/components/input';
import { Popover } from '@actual-app/components/popover';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { css, cx } from '@emotion/css';
import Downshift from 'downshift';
import { getNormalisedString } from 'loot-core/shared/normalisation';
import { useProperFocus } from '@desktop-client/hooks/useProperFocus';
const inst = {};
function findItem(strict, suggestions, value) {
    if (strict) {
        const idx = suggestions.findIndex(item => item.id === value);
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
export function defaultFilterSuggestion(suggestion, value) {
    const name = getItemName(suggestion);
    return getNormalisedString(name).includes(getNormalisedString(value));
}
function defaultFilterSuggestions(suggestions, value) {
    return suggestions.filter(suggestion => defaultFilterSuggestion(suggestion, value));
}
function fireUpdate(onUpdate, strict, suggestions, index, value) {
    // If the index is null, look up the id in the suggestions. If the
    // value is empty it will select nothing (as expected). If it's not
    // empty but nothing is selected, it still resolves to an id. It
    // would very confusing otherwise: the menu could be in a state
    // where nothing is highlighted but there is a valid value.
    let selected = null;
    if (!strict) {
        selected = value;
    }
    else {
        if (index == null) {
            // If passing in a value directly, validate the id
            const sug = suggestions.find(sug => sug.id === value);
            if (sug) {
                selected = sug.id;
            }
        }
        else if (index < suggestions.length) {
            selected = suggestions[index].id;
        }
    }
    onUpdate?.(selected, value);
}
function defaultRenderInput(props) {
    // data-1p-ignore disables 1Password autofill behaviour
    return _jsx(Input, { "data-1p-ignore": true, ...props });
}
function defaultRenderItems(items, getItemProps, highlightedIndex) {
    return (_jsx("div", { children: items.map((item, index) => {
            const name = getItemName(item);
            return (_createElement("div", { ...getItemProps({ item }), 
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
                role: "button", key: name, className: css({
                    padding: 5,
                    cursor: 'default',
                    backgroundColor: highlightedIndex === index
                        ? theme.menuAutoCompleteBackgroundHover
                        : undefined,
                }) }, name));
        }) }));
}
function defaultShouldSaveFromKey(e) {
    return e.code === 'Enter';
}
function defaultItemToString(item) {
    return item ? getItemName(item) : '';
}
function SingleAutocomplete({ focused, embedded = false, containerProps, labelProps = {}, inputProps = {}, suggestions, renderInput = defaultRenderInput, renderItems = defaultRenderItems, itemToString = defaultItemToString, shouldSaveFromKey = defaultShouldSaveFromKey, filterSuggestions = defaultFilterSuggestions, openOnFocus = true, getHighlightedIndex, highlightFirst, onUpdate, strict, onSelect, clearOnBlur = true, clearOnSelect = false, closeOnBlur = true, closeOnSelect = !clearOnSelect, updateOnValueChange = false, onClose, value: initialValue, }) {
    const [selectedItem, setSelectedItem] = useState(() => findItem(strict, suggestions, initialValue));
    const [value, setValue] = useState(selectedItem ? getItemName(selectedItem) : '');
    const [isChanged, setIsChanged] = useState(false);
    const [originalItem, setOriginalItem] = useState(selectedItem);
    const filteredSuggestions = useMemo(() => filterSuggestions(suggestions, value), [filterSuggestions, suggestions, value]);
    const [highlightedIndex, setHighlightedIndex] = useState(null);
    const [isOpen, setIsOpen] = useState(embedded);
    const open = () => setIsOpen(true);
    const close = () => {
        setIsOpen(false);
        onClose?.();
    };
    const triggerRef = useRef(null);
    const itemsViewRef = useRef(null);
    const { isNarrowWidth } = useResponsive();
    const narrowInputStyle = embedded && isNarrowWidth
        ? {
            ...styles.mobileMenuItem,
        }
        : {};
    inputProps = {
        ...inputProps,
        style: {
            ...narrowInputStyle,
            ...inputProps.style,
        },
    };
    // Update the selected item if the suggestion list or initial
    // input value has changed
    useEffect(() => {
        setSelectedItem(findItem(strict, suggestions, initialValue));
    }, [initialValue, suggestions, strict]);
    // Sometimes (khem, khem.. on mobile) we want to force update
    // the "value" field (which is also used as a search term) if
    // the initial value changes.
    useEffect(() => {
        if (updateOnValueChange) {
            const item = findItem(strict, suggestions, initialValue);
            setValue(item ? getItemName(item) : '');
        }
    }, [strict, suggestions, initialValue, updateOnValueChange]);
    function resetState(newValue) {
        const val = newValue === undefined ? initialValue : newValue;
        const selectedItem = findItem(strict, suggestions, val);
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
    const filtered = isChanged ? filteredSuggestions || suggestions : suggestions;
    const inputRef = useRef(null);
    useProperFocus(inputRef, focused);
    return (_jsx(Downshift, { onSelect: (item, { inputValue }) => {
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
                setTimeout(() => {
                    onSelect(getItemId(item), inputValue);
                }, 0);
            }
        }, highlightedIndex: highlightedIndex, selectedItem: selectedItem instanceof Object ? selectedItem : null, itemToString: itemToString, inputValue: value, isOpen: isOpen, onInputValueChange: (value, changes) => {
            // OMG this is the dumbest thing ever. I need to remove Downshift
            // and build my own component. For some reason this is fired on blur
            // with an empty value which clears out the input when the app blurs
            if (!document.hasFocus()) {
                return;
            }
            if ([
                // Do nothing if it's simply updating the selected item
                Downshift.stateChangeTypes.controlledPropUpdatedSelectedItem,
                // Do nothing if it is a "touch" selection event
                Downshift.stateChangeTypes.touchEnd,
                Downshift.stateChangeTypes.mouseUp,
                // @ts-expect-error Types say there is no type
            ].includes(changes.type)) {
                return;
            }
            // Otherwise, filter the items and always the first item if
            // desired
            const filteredSuggestions = filterSuggestions(suggestions, value);
            if (value === '') {
                // A blank value shouldn't highlight any item so that the field
                // can be left blank if desired
                // @ts-expect-error Types say there is no type
                if (changes.type !== Downshift.stateChangeTypes.clickItem) {
                    fireUpdate(onUpdate, strict, filteredSuggestions, null, null);
                }
                setHighlightedIndex(null);
            }
            else {
                const defaultGetHighlightedIndex = filteredSuggestions => {
                    return highlightFirst && filteredSuggestions.length ? 0 : null;
                };
                const highlightedIndex = (getHighlightedIndex || defaultGetHighlightedIndex)(filteredSuggestions);
                // @ts-expect-error Types say there is no type
                if (changes.type !== Downshift.stateChangeTypes.clickItem) {
                    fireUpdate(onUpdate, strict, filteredSuggestions, highlightedIndex, value);
                }
                setHighlightedIndex(highlightedIndex);
            }
            setValue(value);
            setIsChanged(true);
            open();
        }, onStateChange: changes => {
            if (!clearOnBlur &&
                (changes.type === Downshift.stateChangeTypes.mouseUp ||
                    changes.type === Downshift.stateChangeTypes.touchEnd)) {
                return;
            }
            if ('highlightedIndex' in changes &&
                changes.type !== Downshift.stateChangeTypes.changeInput) {
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
                (changes.type === Downshift.stateChangeTypes.keyDownArrowUp ||
                    changes.type === Downshift.stateChangeTypes.keyDownArrowDown)) {
                fireUpdate(onUpdate, strict, filteredSuggestions || suggestions, changes.highlightedIndex != null
                    ? changes.highlightedIndex
                    : highlightedIndex, value);
            }
            inst.lastChangeType = changes.type;
        }, labelId: labelProps?.id, children: ({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex, }) => (
        // Super annoying but it works best to return a div so we
        // can't use a View here, but we can fake it be using the
        // className
        _jsxs("div", { className: cx('view', css({ display: 'flex' })), ...containerProps, children: [_jsx(View, { ref: triggerRef, style: { flexShrink: 0 }, children: renderInput((() => {
                        const { className, style, ...restInputProps } = inputProps || {};
                        const downshiftProps = getInputProps({
                            ref: inputRef,
                            ...restInputProps,
                            onFocus: e => {
                                inputProps.onFocus?.(e);
                                if (openOnFocus) {
                                    open();
                                }
                            },
                            onBlur: e => {
                                // Should this be e.nativeEvent
                                e['preventDownshiftDefault'] = true;
                                inputProps.onBlur?.(e);
                                if (!closeOnBlur) {
                                    return;
                                }
                                if (itemsViewRef.current?.contains(e.relatedTarget)) {
                                    // Do not close when the user clicks on any of the items.
                                    e.stopPropagation();
                                    return;
                                }
                                if (clearOnBlur) {
                                    if (e.target.value === '') {
                                        onSelect?.(null, e.target.value);
                                        setSelectedItem(null);
                                        close();
                                        return;
                                    }
                                    // If not using table behavior, reset the input on blur. Tables
                                    // handle saving the value on blur.
                                    const value = selectedItem
                                        ? getItemId(selectedItem)
                                        : null;
                                    resetState(value);
                                }
                                else {
                                    close();
                                }
                            },
                            onKeyDown: (e) => {
                                const { onKeyDown } = inputProps || {};
                                // If the dropdown is open, an item is highlighted, and the user
                                // pressed enter, always capture that and handle it ourselves
                                if (isOpen) {
                                    if (e.key === 'Enter') {
                                        if (highlightedIndex != null) {
                                            if (inst.lastChangeType ===
                                                Downshift.stateChangeTypes.itemMouseEnter) {
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
                                            onKeyDown?.(e);
                                        }
                                    }
                                    else if (shouldSaveFromKey(e)) {
                                        e.preventDefault();
                                        onKeyDown?.(e);
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
                            },
                        });
                        return {
                            ...downshiftProps,
                            ...(className && { className }),
                            ...(style && { style }),
                        };
                    })()) }), isOpen &&
                    filtered.length > 0 &&
                    (embedded ? (_jsx(View, { ref: itemsViewRef, style: { ...styles.darkScrollbar, marginTop: 5 }, "data-testid": "autocomplete", children: renderItems(filtered, getItemProps, highlightedIndex, inputValue) })) : (_jsx(Popover, { triggerRef: triggerRef, placement: "bottom start", offset: 2, isOpen: isOpen, onOpenChange: close, isNonModal: true, style: {
                            ...styles.darkScrollbar,
                            ...styles.popover,
                            backgroundColor: theme.menuAutoCompleteBackground,
                            color: theme.menuAutoCompleteText,
                            minWidth: 200,
                            width: triggerRef.current?.clientWidth,
                        }, "data-testid": "autocomplete", children: _jsx(View, { ref: itemsViewRef, children: renderItems(filtered, getItemProps, highlightedIndex, inputValue) }) })))] })) }));
}
function MultiItem({ name, onRemove }) {
    return (_jsxs(View, { style: {
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: theme.pillBackgroundSelected,
            padding: '2px 4px',
            margin: '2px',
            borderRadius: 4,
        }, children: [name, _jsx(Button, { variant: "bare", style: { marginLeft: 1 }, onPress: onRemove, children: _jsx(SvgRemove, { style: { width: 8, height: 8 } }) })] }));
}
const defaultMultiAutocompleteInputClassName = css({
    flex: 1,
    minWidth: 30,
    border: 0,
    '&[data-focused]': { border: 0, boxShadow: 'none' },
});
function MultiAutocomplete({ value: selectedItems = [], onSelect, suggestions, strict, clearOnBlur = true, ...props }) {
    const [focused, setFocused] = useState(false);
    const selectedItemIds = selectedItems.map(getItemId);
    const inputRef = useRef(null);
    useProperFocus(inputRef, focused);
    function onRemoveItem(id) {
        const items = selectedItemIds.filter(i => i !== id);
        onSelect(items);
    }
    function onAddItem(id, value) {
        if (id) {
            id = id.trim();
            onSelect([...selectedItemIds, id], value);
        }
    }
    function onKeyDown(e, prevOnKeyDown) {
        if (e.key === 'Backspace' && e.currentTarget.value === '') {
            onRemoveItem(selectedItemIds[selectedItems.length - 1]);
        }
        prevOnKeyDown?.(e);
    }
    return (_jsx(Autocomplete, { ...props, type: "single", value: null, clearOnBlur: clearOnBlur, clearOnSelect: true, suggestions: suggestions.filter(item => !selectedItemIds.includes(getItemId(item))), onSelect: onAddItem, highlightFirst: true, strict: strict, renderInput: ({ className: inputClassName, ...inputProps }) => (_jsxs(View, { style: {
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.tableBackground,
                borderRadius: 4,
                border: '1px solid ' + theme.formInputBorder,
                ...(focused && {
                    border: '1px solid ' + theme.formInputBorderSelected,
                    boxShadow: '0 1px 1px ' + theme.formInputShadowSelected,
                }),
            }, children: [selectedItems.map((item, idx) => {
                    item = findItem(strict, suggestions, item);
                    return (item && (_jsx(MultiItem, { name: getItemName(item), onRemove: () => onRemoveItem(getItemId(item)) }, getItemId(item) || idx)));
                }), _jsx(Input, { ...inputProps, ref: inputRef, onKeyDown: e => onKeyDown(e, inputProps.onKeyDown), onFocus: e => {
                        setFocused(true);
                        inputProps.onFocus(e);
                    }, onBlur: e => {
                        setFocused(false);
                        inputProps.onBlur(e);
                    }, className: typeof inputClassName === 'function'
                        ? renderProps => cx(defaultMultiAutocompleteInputClassName, inputClassName(renderProps))
                        : cx(defaultMultiAutocompleteInputClassName, inputClassName) })] })) }));
}
export function AutocompleteFooter({ show = true, embedded, children, }) {
    if (!show) {
        return null;
    }
    return (_jsx(View, { style: {
            flexShrink: 0,
            ...(embedded ? { paddingTop: 5 } : { padding: 5 }),
        }, children: children }));
}
export function Autocomplete({ ...props }) {
    if (props.type === 'multi') {
        return _jsx(MultiAutocomplete, { ...props });
    }
    return _jsx(SingleAutocomplete, { ...props });
}
