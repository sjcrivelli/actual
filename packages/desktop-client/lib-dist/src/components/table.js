import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-strict-ignore
import { forwardRef, useCallback, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState, } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Button } from '@actual-app/components/button';
import { AnimatedLoading } from '@actual-app/components/icons/AnimatedLoading';
import { SvgDelete, SvgExpandArrow } from '@actual-app/components/icons/v0';
import { SvgCheckmark } from '@actual-app/components/icons/v1';
import { Input } from '@actual-app/components/input';
import { Menu } from '@actual-app/components/menu';
import { Popover } from '@actual-app/components/popover';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { FixedSizeList } from './FixedSizeList';
import { ConditionalPrivacyFilter, mergeConditionalPrivacyFilterProps, } from './PrivacyFilter';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { useModalState } from '@desktop-client/hooks/useModalState';
import { AvoidRefocusScrollProvider, useProperFocus, } from '@desktop-client/hooks/useProperFocus';
import { useSelectedItems } from '@desktop-client/hooks/useSelected';
import { useSheetValue } from '@desktop-client/hooks/useSheetValue';
export const ROW_HEIGHT = 32;
function fireBlur(onBlur, e) {
    if (document.hasFocus()) {
        // We only fire the blur event if the app is still focused
        // because the blur event is fired when the app goes into
        // the background and we want to ignore that
        onBlur?.(e);
    }
    else {
        // Otherwise, stop React from bubbling this event and swallow it
        e.stopPropagation();
    }
}
export const Field = forwardRef(function Field({ width, name, truncate = true, children, style, contentStyle, ...props }, ref) {
    return (_jsx(View, { innerRef: ref, ...props, style: {
            ...(width === 'flex' ? { flex: 1, flexBasis: 0 } : { width }),
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: theme.tableBorder,
            ...styles.smallText,
            ...style,
        }, "data-testid": name, children: _jsx(View, { style: {
                flex: 1,
                padding: '0 5px',
                justifyContent: 'center',
                ...contentStyle,
            }, children: truncate ? (_jsx(Text, { style: {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }, children: children })) : (children) }) }));
});
export function UnexposedCellContent({ value, formatter, style, ...props }) {
    return (_jsx(Text, { style: {
            flexGrow: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            ...style,
            ...props,
        }, children: formatter ? formatter(value) : value }));
}
export function Cell({ width, name, exposed, focused, value, formatter, textAlign, alignItems, onExpose, children, plain, style, valueStyle, unexposedContent, privacyFilter, ...viewProps }) {
    const mouseCoords = useRef(null);
    const viewRef = useRef(null);
    useProperFocus(viewRef, focused !== undefined ? focused : exposed);
    const widthStyle = width === 'flex' ? { flex: 1, flexBasis: 0 } : { width };
    const cellStyle = {
        position: 'relative',
        textAlign: textAlign || 'left',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: theme.tableBorder,
        alignItems,
    };
    const conditionalPrivacyFilter = useMemo(() => (_jsx(ConditionalPrivacyFilter, { privacyFilter: mergeConditionalPrivacyFilterProps({
            activationFilters: [!focused, !exposed],
        }, privacyFilter), children: plain ? (children) : exposed ? (
        // @ts-expect-error Missing props refinement
        children()) : (_jsx(View, { style: {
                flexDirection: 'row',
                flex: 1,
                padding: '0 5px',
                alignItems: 'center',
                ...styles.smallText,
                ...valueStyle,
            }, 
            // Can't use click because we only want to expose the cell if
            // the user does a direct click, not if they also drag the
            // mouse to select something
            onMouseDown: e => (mouseCoords.current = [e.clientX, e.clientY]), 
            // When testing, allow the click handler to be used instead
            onClick: global.IS_TESTING
                ? () => onExpose?.(name)
                : e => {
                    if (mouseCoords.current &&
                        Math.abs(e.clientX - mouseCoords.current[0]) < 5 &&
                        Math.abs(e.clientY - mouseCoords.current[1]) < 5) {
                        onExpose?.(name);
                    }
                }, children: unexposedContent ? (unexposedContent({ value, formatter })) : (_jsx(UnexposedCellContent, { value: value, formatter: formatter })) })) })), [
        privacyFilter,
        focused,
        exposed,
        children,
        plain,
        valueStyle,
        onExpose,
        name,
        unexposedContent,
        value,
        formatter,
    ]);
    return (_jsx(View, { innerRef: viewRef, style: { ...widthStyle, ...cellStyle, ...style }, ...viewProps, "data-testid": name, children: conditionalPrivacyFilter }));
}
export const Row = forwardRef(function Row({ inset = 0, collapsed, children, height, style, ...nativeProps }, ref) {
    return (_jsxs(View, { ref: ref, style: {
            flexDirection: 'row',
            height: height || ROW_HEIGHT,
            flex: '0 0 ' + (height || ROW_HEIGHT) + 'px',
            userSelect: 'text',
            ...(collapsed && { marginTop: -1 }),
            ...style,
        }, "data-testid": "row", ...nativeProps, children: [inset !== 0 && _jsx(Field, { width: inset }), children, inset !== 0 && _jsx(Field, { width: inset })] }));
});
const inputCellStyle = {
    padding: '5px 3px',
    margin: '0 1px',
};
const readonlyInputStyle = {
    backgroundColor: 'transparent',
    '::selection': { backgroundColor: theme.formInputTextReadOnlySelection },
};
function InputValue({ value: defaultValue, onUpdate, onBlur, ...props }) {
    const [value, setValue] = useState(defaultValue);
    const [prevDefaultValue, setPrevDefaultValue] = useState(defaultValue);
    if (prevDefaultValue !== defaultValue) {
        setValue(defaultValue);
        setPrevDefaultValue(defaultValue);
    }
    function onBlur_(e) {
        if (onBlur) {
            fireBlur(onBlur, e);
        }
    }
    function onKeyDown(e) {
        // Only enter and tab to escape (which allows the user to move
        // around)
        if (e.key !== 'Enter' && e.key !== 'Tab') {
            e.stopPropagation();
        }
        if (shouldSaveFromKey(e)) {
            onUpdate?.(value);
        }
    }
    function onEscape() {
        if (value !== defaultValue) {
            setValue(defaultValue);
        }
    }
    const ops = ['+', '-', '*', '/', '^'];
    function valueIsASingleOperator(text) {
        return text?.length === 1 && ops.includes(text.charAt(0));
    }
    function setValue_(text) {
        if (valueIsASingleOperator(text)) {
            setValue(defaultValue + text);
        }
        else {
            setValue(text);
        }
    }
    return (_jsx(Input, { ...props, value: value, onChangeValue: setValue_, onBlur: onBlur_, onUpdate: onUpdate, onKeyDown: onKeyDown, onEscape: onEscape, style: {
            ...inputCellStyle,
            ...(props.readOnly ? readonlyInputStyle : null),
            ...props.style,
        } }));
}
export function InputCell({ inputProps, onUpdate, onBlur, textAlign, ...props }) {
    return (_jsx(Cell, { textAlign: textAlign, ...props, children: () => (_jsx(InputValue, { value: props.value, onUpdate: onUpdate, onBlur: onBlur, style: { textAlign, ...(inputProps && inputProps.style) }, ...inputProps })) }));
}
function shouldSaveFromKey(e) {
    switch (e.key) {
        case 'Tab':
        case 'Enter':
            e.preventDefault();
            return true;
        default:
    }
}
export function CustomCell({ value: defaultValue, children, onUpdate, onBlur, ...props }) {
    const [value, setValue] = useState(defaultValue);
    const [prevDefaultValue, setPrevDefaultValue] = useState(defaultValue);
    if (prevDefaultValue !== defaultValue) {
        setValue(defaultValue);
        setPrevDefaultValue(defaultValue);
    }
    function onBlur_(e) {
        // Only save on blur if the app is focused. Blur events fire when
        // the app unfocuses, and it's unintuitive to save the value since
        // the input will be focused again when the app regains focus
        if (document.hasFocus()) {
            onUpdate?.(value);
            fireBlur(onBlur, e);
        }
    }
    function onKeyDown(e) {
        if (shouldSaveFromKey(e)) {
            onUpdate?.(value);
        }
    }
    return (_jsx(Cell, { ...props, value: defaultValue, children: () => children?.({
            onBlur: onBlur_,
            onKeyDown,
            onUpdate: val => setValue(val),
            onSave: val => {
                setValue(val);
                onUpdate?.(val);
            },
            shouldSaveFromKey,
            inputStyle: inputCellStyle,
        }) }));
}
export function DeleteCell({ onDelete, style, ...props }) {
    return (_jsx(Cell, { ...props, name: "delete", width: 20, style: { alignItems: 'center', userSelect: 'none', ...style }, onClick: e => {
            e.stopPropagation();
            onDelete?.();
        }, children: () => _jsx(SvgDelete, { width: 7, height: 7 }) }));
}
export const CellButton = forwardRef(({ children, style, primary, bare, disabled, clickBehavior, onSelect, onEdit, className, }, ref) => {
    // This represents a cell that acts like a button: it's clickable,
    // focusable, etc. The reason we don't use a button is because the
    // full behavior is undesirable: we really don't want stuff like
    // "click is fired when enter is pressed". We have very custom
    // controls and focus/active states.
    //
    // Important behavior:
    // * X/SPACE/etc keys select the button _on key down_ and not on key
    //   up. This means it instantly selects and if you hold it down it
    //   will repeatedly select.
    // * The cell begins editing on focus. That means if the user does a
    //   mouse down, but moves out of the element and then does mouse
    //   up, it will properly still receive focus & being editing
    return (_jsx(View, { innerRef: ref, className: className, tabIndex: 0, onKeyDown: e => {
            if (e.key === 'x' || e.key === ' ') {
                e.preventDefault();
                if (!disabled) {
                    onSelect?.(e);
                }
            }
        }, style: {
            flexDirection: 'row',
            alignItems: 'center',
            cursor: 'default',
            transition: 'box-shadow .15s',
            backgroundColor: bare
                ? 'transparent'
                : disabled // always use disabled before primary since we can have a disabled primary button
                    ? theme.buttonNormalDisabledBackground
                    : primary
                        ? theme.buttonPrimaryBackground
                        : theme.buttonNormalBackground,
            border: bare
                ? 'none'
                : '1px solid ' +
                    (disabled
                        ? theme.buttonNormalDisabledBorder
                        : primary
                            ? theme.buttonPrimaryBorder
                            : theme.buttonNormalBorder),
            color: bare
                ? 'inherit'
                : disabled
                    ? theme.buttonNormalDisabledText
                    : primary
                        ? theme.buttonPrimaryText
                        : theme.buttonNormalText,
            ':focus': bare
                ? null
                : {
                    outline: 0,
                    boxShadow: `1px 1px 2px ${theme.buttonNormalShadow}`,
                },
            ...style,
        }, onFocus: () => onEdit && onEdit(), "data-testid": "cell-button", onClick: clickBehavior === 'none'
            ? null
            : e => {
                if (!disabled) {
                    onSelect?.(e);
                    onEdit?.();
                }
            }, children: children }));
});
CellButton.displayName = 'CellButton';
export function SelectCell({ focused, selected, style, onSelect, onEdit, icon = _jsx(SvgCheckmark, { width: 6, height: 6 }), buttonProps = {}, ...props }) {
    return (_jsx(Cell, { ...props, focused: focused, name: "select", width: 20, style: { alignItems: 'center', userSelect: 'none', ...style }, onClick: e => {
            e.stopPropagation();
            onSelect?.(e);
            onEdit?.();
        }, children: () => (_jsx(CellButton, { style: {
                width: 12,
                height: 12,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 3,
                border: selected
                    ? '1px solid ' + theme.checkboxBorderSelected
                    : '1px solid ' + theme.formInputBorder,
                color: theme.checkboxText,
                backgroundColor: selected
                    ? theme.checkboxBackgroundSelected
                    : theme.tableBackground,
                ':focus': {
                    border: '1px solid ' + theme.checkboxBorderSelected,
                    boxShadow: '0 1px 2px ' + theme.checkboxShadowSelected,
                },
            }, onEdit: onEdit, onSelect: onSelect, clickBehavior: "none", ...buttonProps, children: selected && icon })) }));
}
export function SheetCell({ valueProps, valueStyle, inputProps, textAlign, onSave, ...props }) {
    const { binding, type, getValueStyle, formatExpr, unformatExpr, privacyFilter, } = valueProps;
    const sheetValue = useSheetValue(binding, () => {
        // "close" the cell if it's editing
        if (props.exposed && inputProps && inputProps.onBlur) {
            inputProps.onBlur();
        }
    });
    const format = useFormat();
    return (_jsx(Cell, { valueStyle: getValueStyle
            ? { ...valueStyle, ...getValueStyle(sheetValue) }
            : valueStyle, textAlign: textAlign, ...props, value: String(sheetValue ?? ''), formatter: value => props.formatter ? props.formatter(value, type) : format(value, type), privacyFilter: privacyFilter != null
            ? privacyFilter
            : type === 'financial'
                ? true
                : undefined, "data-cellname": sheetValue, children: () => {
            return (_jsx(InputValue, { value: formatExpr ? formatExpr(sheetValue) : sheetValue.toString(), onUpdate: value => {
                    onSave(unformatExpr ? unformatExpr(value) : value);
                }, ...inputProps, style: { textAlign, ...(inputProps?.style || {}) } }));
        } }));
}
export function TableHeader({ headers, children, ...rowProps }) {
    return (_jsx(View, { style: {
            borderRadius: '6px 6px 0 0',
            overflow: 'hidden',
            flexShrink: 0,
        }, children: _jsx(Row, { collapsed: true, ...rowProps, style: {
                color: theme.tableHeaderText,
                backgroundColor: theme.tableHeaderBackground,
                zIndex: 200,
                fontWeight: 500,
                ...rowProps.style,
            }, children: headers
                ? headers.map(header => {
                    return (_jsx(Cell, { value: header.name, width: header.width, style: header.style, valueStyle: header.valueStyle }, header.name));
                })
                : children }) }));
}
export function SelectedItemsButton({ id, name, items, onSelect, }) {
    const selectedItems = useSelectedItems();
    const [menuOpen, setMenuOpen] = useState(false);
    const triggerRef = useRef(null);
    if (selectedItems.size === 0) {
        return null;
    }
    const buttonLabel = typeof name === 'function' ? name(selectedItems.size) : name;
    return (_jsxs(View, { style: { marginLeft: 10, flexShrink: 0 }, children: [_jsxs(Button, { ref: triggerRef, variant: "bare", style: { color: theme.pageTextPositive }, onPress: () => setMenuOpen(true), "data-testid": id + '-select-button', children: [_jsx(SvgExpandArrow, { width: 8, height: 8, style: { marginRight: 5, color: theme.pageText } }), buttonLabel] }), _jsx(Popover, { triggerRef: triggerRef, style: {
                    width: 200,
                    padding: 0,
                    backgroundColor: theme.menuBackground,
                }, isOpen: menuOpen, onOpenChange: () => setMenuOpen(false), "data-testid": id + '-select-tooltip', children: _jsx(Menu, { onMenuSelect: name => {
                        onSelect(name, [...selectedItems]);
                        setMenuOpen(false);
                    }, items: items }) })] }));
}
const rowStyle = {
    position: 'absolute',
    willChange: 'transform',
    width: '100%',
};
export function TableWithNavigator({ fields, ...props }) {
    const navigator = useTableNavigator(props.items, fields);
    return _jsx(Table, { ...props, navigator: navigator });
}
export const Table = forwardRef(({ items, count, headers, contentHeader, loading, rowHeight = ROW_HEIGHT, backgroundColor = theme.tableHeaderBackground, renderItem, renderEmpty, getItemKey, loadMore, style, navigator, onScroll, isSelected, saveScrollWidth, listContainerRef, ...props }, ref) => {
    if (!navigator) {
        navigator = {
            onEdit: () => { },
            editingId: null,
            focusedField: null,
            getNavigatorProps: props => props,
        };
    }
    const { onEdit, editingId, focusedField, getNavigatorProps } = navigator;
    const list = useRef(null);
    const listContainerInnerRef = useRef(null);
    const listContainer = listContainerRef || listContainerInnerRef;
    const scrollContainer = useRef(null);
    const initialScrollTo = useRef(null);
    const listInitialized = useRef(false);
    useImperativeHandle(ref, () => ({
        scrollTo: (id, alignment = 'smart') => {
            const index = items.findIndex(item => item.id === id);
            if (index !== -1) {
                if (!list.current) {
                    // If the table hasn't been laid out yet, we need to wait for
                    // that to happen before we can scroll to something
                    initialScrollTo.current = index;
                }
                else {
                    list.current.scrollToItem(index, alignment);
                }
            }
        },
        scrollToTop: () => {
            list.current?.scrollTo(0);
        },
        getScrolledItem: () => {
            if (scrollContainer.current) {
                const offset = scrollContainer.current.scrollTop;
                const index = list.current.getStartIndexForOffset(offset);
                return items[index].id;
            }
            return 0;
        },
        setRowAnimation: flag => {
            list.current?.setRowAnimation(flag);
        },
        edit(id, field, shouldScroll) {
            onEdit(id, field);
            if (id && shouldScroll) {
                // @ts-expect-error this should not be possible
                ref.scrollTo(id);
            }
        },
        anchor() {
            list.current?.anchor();
        },
        unanchor() {
            list.current?.unanchor();
        },
        isAnchored() {
            return list.current && list.current.isAnchored();
        },
    }));
    useLayoutEffect(() => {
        // We wait for the list to mount because AutoSizer needs to run
        // before it's mounted
        if (!listInitialized.current && listContainer.current) {
            // Animation is on by default
            list.current?.setRowAnimation(true);
            listInitialized.current = true;
        }
        if (scrollContainer.current && saveScrollWidth) {
            setTimeout(saveScrollDelayed, 200);
        }
    });
    function saveScrollDelayed() {
        saveScrollWidth(scrollContainer.current?.offsetParent
            ? scrollContainer.current?.offsetParent.clientWidth
            : 0, scrollContainer.current ? scrollContainer.current.clientWidth : 0);
    }
    function renderRow({ index, style, key }) {
        const item = items[index];
        const editing = editingId === item.id;
        const selected = isSelected && isSelected(item.id);
        const row = renderItem({
            item,
            editing,
            focusedField: editing && focusedField,
            onEdit,
            index,
            position: style.top,
        });
        // TODO: Need to also apply zIndex if item is selected
        // * Port over ListAnimation to Table
        // * Move highlighted functionality into here
        return (_jsx(View, { style: {
                ...rowStyle,
                zIndex: editing || selected ? 101 : 'auto',
                transform: 'translateY(var(--pos))',
            }, nativeStyle: { '--pos': `${style.top - 1}px` }, "data-focus-key": item.id, children: row }, key));
    }
    function getScrollOffset(height, index) {
        return (index * (rowHeight - 1) +
            (rowHeight - 1) / 2 -
            height / 2 +
            (rowHeight - 1) * 2);
    }
    function onItemsRendered({ overscanStopIndex }) {
        if (loadMore && overscanStopIndex > items.length - 100) {
            loadMore();
        }
    }
    function getEmptyContent(empty) {
        if (empty == null) {
            return null;
        }
        else if (typeof empty === 'function') {
            return empty();
        }
        return (_jsx(View, { style: {
                justifyContent: 'center',
                alignItems: 'center',
                fontStyle: 'italic',
                color: theme.tableText,
                flex: 1,
            }, children: empty }));
    }
    if (loading) {
        return (_jsx(View, { style: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor,
            }, children: _jsx(AnimatedLoading, { width: 25, color: theme.tableText }) }));
    }
    const isEmpty = (count || items.length) === 0;
    return (_jsxs(View, { style: {
            flex: 1,
            outline: 'none',
            ...style,
        }, tabIndex: 1, ...getNavigatorProps(props), "data-testid": "table", children: [headers && (_jsx(TableHeader, { height: rowHeight, ...(Array.isArray(headers) ? { headers } : { children: headers }) })), _jsx(View, { style: {
                    flex: `1 1 ${rowHeight * Math.max(2, items.length)}px`,
                    backgroundColor,
                }, children: isEmpty ? (getEmptyContent(renderEmpty)) : (_jsx(AutoSizer, { children: ({ width, height }) => {
                        if (width === 0 || height === 0) {
                            return null;
                        }
                        return (_jsx(AvoidRefocusScrollProvider, { children: _jsx(FixedSizeList, { ref: list, header: contentHeader, innerRef: listContainer, outerRef: scrollContainer, width: width, height: height, renderRow: renderRow, itemCount: count || items.length, itemSize: rowHeight - 1, itemKey: getItemKey || ((index) => items[index].id), indexForKey: key => items.findIndex(item => item.id === key), initialScrollOffset: initialScrollTo.current
                                    ? getScrollOffset(height, initialScrollTo.current)
                                    : 0, overscanCount: 5, onItemsRendered: onItemsRendered, onScroll: onScroll }) }));
                    } })) })] }));
});
// @ts-expect-error fix me
Table.displayName = 'Table';
export function useTableNavigator(data, fields) {
    const getFields = typeof fields !== 'function' ? () => fields : fields;
    const [editingId, setEditingId] = useState(null);
    const [focusedField, setFocusedField] = useState(null);
    const containerRef = useRef(null);
    // See `onBlur` for why we need this
    const modalState = useModalState();
    const modalStackLength = useRef(modalState.modalStack.length);
    // onEdit is passed to children, so make sure it maintains identity
    const onEdit = useCallback((id, field) => {
        setEditingId(id);
        setFocusedField(id ? field : null);
    }, []);
    function flashInput() {
        // Force the container to be focused which suppresses the "space
        // pages down" behavior. If we don't do this and the user presses
        // up + space down quickly while nothing is focused, it would page
        // down.
        containerRef.current.focus();
        // Not ideal, but works for now. Let the UI show the input
        // go away, and then bring it back on the same row/field
        onEdit(null);
        setTimeout(() => {
            onEdit(editingId, focusedField);
        }, 100);
    }
    function onFocusPrevious() {
        const idx = data.findIndex(item => item.id === editingId);
        if (idx > 0) {
            const item = data[idx - 1];
            const fields = getFields(item);
            onEdit(item.id, fields[fields.length - 1]);
        }
        else {
            flashInput();
        }
    }
    function onFocusNext() {
        const idx = data.findIndex(item => item.id === editingId);
        if (idx < data.length - 1) {
            const item = data[idx + 1];
            const fields = getFields(item);
            onEdit(item.id, fields[0]);
        }
        else {
            flashInput();
        }
    }
    function moveHorizontally(dir) {
        if (editingId) {
            const fields = getFields(data.find(item => item.id === editingId));
            const idx = fields.indexOf(focusedField) + dir;
            if (idx < 0) {
                onFocusPrevious();
            }
            else if (idx >= fields.length) {
                onFocusNext();
            }
            else {
                setFocusedField(fields[idx]);
            }
        }
    }
    function moveVertically(dir) {
        if (editingId) {
            const idx = data.findIndex(item => item.id === editingId);
            let nextIdx = idx;
            while (true) {
                nextIdx = nextIdx + dir;
                if (nextIdx >= 0 && nextIdx < data.length) {
                    const next = data[nextIdx];
                    if (getFields(next).includes(focusedField)) {
                        onEdit(next.id, focusedField);
                        break;
                    }
                }
                else {
                    flashInput();
                    break;
                }
            }
        }
    }
    function onMove(dir) {
        switch (dir) {
            case 'left':
                moveHorizontally(-1);
                break;
            case 'right':
                moveHorizontally(1);
                break;
            case 'up':
                moveVertically(-1);
                break;
            case 'down':
                moveVertically(1);
                break;
            default:
                throw new Error('Unknown direction: ' + dir);
        }
    }
    function getNavigatorProps(userProps) {
        return {
            ...userProps,
            innerRef: containerRef,
            onKeyDown: e => {
                userProps?.onKeyDown?.(e);
                if (e.isPropagationStopped()) {
                    return;
                }
                switch (e.key) {
                    case 'ArrowUp':
                    case 'k':
                        if (e.target.tagName !== 'INPUT') {
                            onMove('up');
                        }
                        break;
                    case 'ArrowDown':
                    case 'j':
                        if (e.target.tagName !== 'INPUT') {
                            onMove('down');
                        }
                        break;
                    case 'Enter':
                    case 'Tab':
                        e.preventDefault();
                        e.stopPropagation();
                        onMove(e.key === 'Enter'
                            ? e.shiftKey
                                ? 'up'
                                : 'down'
                            : e.shiftKey
                                ? 'left'
                                : 'right');
                        break;
                    default:
                }
            },
            onBlur: e => {
                // We want to hide the editing field if the user clicked away
                // from the table. We use `relatedTarget` to figure out where
                // the focus is going, and if it's nothing (the user clicked
                // somewhere that doesn't have an editable field) or if it's
                // anything outside of the table, clear editing.
                //
                // Also important: only do this if the app is focused. The
                // blur event is fired when the app loses focus and we don't
                // want to hide the input.
                // The last tricky edge case: we don't want to blur if a new
                // modal just opened. This way the field still shows an
                // input, and it will be refocused when the modal closes.
                const prevNumModals = modalStackLength.current;
                const numModals = modalState.modalStack.length;
                if (document.hasFocus() &&
                    (e.relatedTarget == null ||
                        !containerRef.current.contains(e.relatedTarget) ||
                        containerRef.current === e.relatedTarget) &&
                    prevNumModals === numModals) {
                    onEdit(null);
                }
            },
        };
    }
    return { onEdit, editingId, focusedField, getNavigatorProps };
}
