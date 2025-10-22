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
exports.Table = exports.CellButton = exports.Row = exports.Field = exports.ROW_HEIGHT = void 0;
exports.UnexposedCellContent = UnexposedCellContent;
exports.Cell = Cell;
exports.InputCell = InputCell;
exports.CustomCell = CustomCell;
exports.DeleteCell = DeleteCell;
exports.SelectCell = SelectCell;
exports.SheetCell = SheetCell;
exports.TableHeader = TableHeader;
exports.SelectedItemsButton = SelectedItemsButton;
exports.TableWithNavigator = TableWithNavigator;
exports.useTableNavigator = useTableNavigator;
// @ts-strict-ignore
var react_1 = require("react");
var react_virtualized_auto_sizer_1 = require("react-virtualized-auto-sizer");
var button_1 = require("@actual-app/components/button");
var AnimatedLoading_1 = require("@actual-app/components/icons/AnimatedLoading");
var v0_1 = require("@actual-app/components/icons/v0");
var v1_1 = require("@actual-app/components/icons/v1");
var input_1 = require("@actual-app/components/input");
var menu_1 = require("@actual-app/components/menu");
var popover_1 = require("@actual-app/components/popover");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var FixedSizeList_1 = require("./FixedSizeList");
var PrivacyFilter_1 = require("./PrivacyFilter");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useModalState_1 = require("@desktop-client/hooks/useModalState");
var useProperFocus_1 = require("@desktop-client/hooks/useProperFocus");
var useSelected_1 = require("@desktop-client/hooks/useSelected");
var useSheetValue_1 = require("@desktop-client/hooks/useSheetValue");
exports.ROW_HEIGHT = 32;
function fireBlur(onBlur, e) {
    if (document.hasFocus()) {
        // We only fire the blur event if the app is still focused
        // because the blur event is fired when the app goes into
        // the background and we want to ignore that
        onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
    }
    else {
        // Otherwise, stop React from bubbling this event and swallow it
        e.stopPropagation();
    }
}
exports.Field = (0, react_1.forwardRef)(function Field(_a, ref) {
    var width = _a.width, name = _a.name, _b = _a.truncate, truncate = _b === void 0 ? true : _b, children = _a.children, style = _a.style, contentStyle = _a.contentStyle, props = __rest(_a, ["width", "name", "truncate", "children", "style", "contentStyle"]);
    return (<view_1.View innerRef={ref} {...props} style={__assign(__assign(__assign(__assign({}, (width === 'flex' ? { flex: 1, flexBasis: 0 } : { width: width })), { borderTopWidth: 1, borderBottomWidth: 1, borderColor: theme_1.theme.tableBorder }), styles_1.styles.smallText), style)} data-testid={name}>
      {/* This is wrapped so that the padding is not taken into
            account with the flex width (which aligns it with the Cell
            component) */}
      <view_1.View style={__assign({ flex: 1, padding: '0 5px', justifyContent: 'center' }, contentStyle)}>
        {truncate ? (<text_1.Text style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            }}>
            {children}
          </text_1.Text>) : (children)}
      </view_1.View>
    </view_1.View>);
});
function UnexposedCellContent(_a) {
    var value = _a.value, formatter = _a.formatter, style = _a.style, props = __rest(_a, ["value", "formatter", "style"]);
    return (<text_1.Text style={__assign(__assign({ flexGrow: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, style), props)}>
      {formatter ? formatter(value) : value}
    </text_1.Text>);
}
function Cell(_a) {
    var width = _a.width, name = _a.name, exposed = _a.exposed, focused = _a.focused, value = _a.value, formatter = _a.formatter, textAlign = _a.textAlign, alignItems = _a.alignItems, onExpose = _a.onExpose, children = _a.children, plain = _a.plain, style = _a.style, valueStyle = _a.valueStyle, unexposedContent = _a.unexposedContent, privacyFilter = _a.privacyFilter, viewProps = __rest(_a, ["width", "name", "exposed", "focused", "value", "formatter", "textAlign", "alignItems", "onExpose", "children", "plain", "style", "valueStyle", "unexposedContent", "privacyFilter"]);
    var mouseCoords = (0, react_1.useRef)(null);
    var viewRef = (0, react_1.useRef)(null);
    (0, useProperFocus_1.useProperFocus)(viewRef, focused !== undefined ? focused : exposed);
    var widthStyle = width === 'flex' ? { flex: 1, flexBasis: 0 } : { width: width };
    var cellStyle = {
        position: 'relative',
        textAlign: textAlign || 'left',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: theme_1.theme.tableBorder,
        alignItems: alignItems,
    };
    var conditionalPrivacyFilter = (0, react_1.useMemo)(function () { return (<PrivacyFilter_1.ConditionalPrivacyFilter privacyFilter={(0, PrivacyFilter_1.mergeConditionalPrivacyFilterProps)({
            activationFilters: [!focused, !exposed],
        }, privacyFilter)}>
        {plain ? (children) : exposed ? (
        // @ts-expect-error Missing props refinement
        children()) : (<view_1.View style={__assign(__assign({ flexDirection: 'row', flex: 1, padding: '0 5px', alignItems: 'center' }, styles_1.styles.smallText), valueStyle)} 
        // Can't use click because we only want to expose the cell if
        // the user does a direct click, not if they also drag the
        // mouse to select something
        onMouseDown={function (e) { return (mouseCoords.current = [e.clientX, e.clientY]); }} 
        // When testing, allow the click handler to be used instead
        onClick={global.IS_TESTING
                ? function () { return onExpose === null || onExpose === void 0 ? void 0 : onExpose(name); }
                : function (e) {
                    if (mouseCoords.current &&
                        Math.abs(e.clientX - mouseCoords.current[0]) < 5 &&
                        Math.abs(e.clientY - mouseCoords.current[1]) < 5) {
                        onExpose === null || onExpose === void 0 ? void 0 : onExpose(name);
                    }
                }}>
            {unexposedContent ? (unexposedContent({ value: value, formatter: formatter })) : (<UnexposedCellContent value={value} formatter={formatter}/>)}
          </view_1.View>)}
      </PrivacyFilter_1.ConditionalPrivacyFilter>); }, [
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
    return (<view_1.View innerRef={viewRef} style={__assign(__assign(__assign({}, widthStyle), cellStyle), style)} {...viewProps} data-testid={name}>
      {conditionalPrivacyFilter}
    </view_1.View>);
}
exports.Row = (0, react_1.forwardRef)(function Row(_a, ref) {
    var _b = _a.inset, inset = _b === void 0 ? 0 : _b, collapsed = _a.collapsed, children = _a.children, height = _a.height, style = _a.style, nativeProps = __rest(_a, ["inset", "collapsed", "children", "height", "style"]);
    return (<view_1.View ref={ref} style={__assign(__assign({ flexDirection: 'row', height: height || exports.ROW_HEIGHT, flex: '0 0 ' + (height || exports.ROW_HEIGHT) + 'px', userSelect: 'text' }, (collapsed && { marginTop: -1 })), style)} data-testid="row" {...nativeProps}>
      {inset !== 0 && <exports.Field width={inset}/>}
      {children}
      {inset !== 0 && <exports.Field width={inset}/>}
    </view_1.View>);
});
var inputCellStyle = {
    padding: '5px 3px',
    margin: '0 1px',
};
var readonlyInputStyle = {
    backgroundColor: 'transparent',
    '::selection': { backgroundColor: theme_1.theme.formInputTextReadOnlySelection },
};
function InputValue(_a) {
    var defaultValue = _a.value, onUpdate = _a.onUpdate, onBlur = _a.onBlur, props = __rest(_a, ["value", "onUpdate", "onBlur"]);
    var _b = (0, react_1.useState)(defaultValue), value = _b[0], setValue = _b[1];
    var _c = (0, react_1.useState)(defaultValue), prevDefaultValue = _c[0], setPrevDefaultValue = _c[1];
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
            onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(value);
        }
    }
    function onEscape() {
        if (value !== defaultValue) {
            setValue(defaultValue);
        }
    }
    var ops = ['+', '-', '*', '/', '^'];
    function valueIsASingleOperator(text) {
        return (text === null || text === void 0 ? void 0 : text.length) === 1 && ops.includes(text.charAt(0));
    }
    function setValue_(text) {
        if (valueIsASingleOperator(text)) {
            setValue(defaultValue + text);
        }
        else {
            setValue(text);
        }
    }
    return (<input_1.Input {...props} value={value} onChangeValue={setValue_} onBlur={onBlur_} onUpdate={onUpdate} onKeyDown={onKeyDown} onEscape={onEscape} style={__assign(__assign(__assign({}, inputCellStyle), (props.readOnly ? readonlyInputStyle : null)), props.style)}/>);
}
function InputCell(_a) {
    var inputProps = _a.inputProps, onUpdate = _a.onUpdate, onBlur = _a.onBlur, textAlign = _a.textAlign, props = __rest(_a, ["inputProps", "onUpdate", "onBlur", "textAlign"]);
    return (<Cell textAlign={textAlign} {...props}>
      {function () { return (<InputValue value={props.value} onUpdate={onUpdate} onBlur={onBlur} style={__assign({ textAlign: textAlign }, (inputProps && inputProps.style))} {...inputProps}/>); }}
    </Cell>);
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
function CustomCell(_a) {
    var defaultValue = _a.value, children = _a.children, onUpdate = _a.onUpdate, onBlur = _a.onBlur, props = __rest(_a, ["value", "children", "onUpdate", "onBlur"]);
    var _b = (0, react_1.useState)(defaultValue), value = _b[0], setValue = _b[1];
    var _c = (0, react_1.useState)(defaultValue), prevDefaultValue = _c[0], setPrevDefaultValue = _c[1];
    if (prevDefaultValue !== defaultValue) {
        setValue(defaultValue);
        setPrevDefaultValue(defaultValue);
    }
    function onBlur_(e) {
        // Only save on blur if the app is focused. Blur events fire when
        // the app unfocuses, and it's unintuitive to save the value since
        // the input will be focused again when the app regains focus
        if (document.hasFocus()) {
            onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(value);
            fireBlur(onBlur, e);
        }
    }
    function onKeyDown(e) {
        if (shouldSaveFromKey(e)) {
            onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(value);
        }
    }
    return (<Cell {...props} value={defaultValue}>
      {function () {
            return children === null || children === void 0 ? void 0 : children({
                onBlur: onBlur_,
                onKeyDown: onKeyDown,
                onUpdate: function (val) { return setValue(val); },
                onSave: function (val) {
                    setValue(val);
                    onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(val);
                },
                shouldSaveFromKey: shouldSaveFromKey,
                inputStyle: inputCellStyle,
            });
        }}
    </Cell>);
}
function DeleteCell(_a) {
    var onDelete = _a.onDelete, style = _a.style, props = __rest(_a, ["onDelete", "style"]);
    return (<Cell {...props} name="delete" width={20} style={__assign({ alignItems: 'center', userSelect: 'none' }, style)} onClick={function (e) {
            e.stopPropagation();
            onDelete === null || onDelete === void 0 ? void 0 : onDelete();
        }}>
      {function () { return <v0_1.SvgDelete width={7} height={7}/>; }}
    </Cell>);
}
exports.CellButton = (0, react_1.forwardRef)(function (_a, ref) {
    var children = _a.children, style = _a.style, primary = _a.primary, bare = _a.bare, disabled = _a.disabled, clickBehavior = _a.clickBehavior, onSelect = _a.onSelect, onEdit = _a.onEdit, className = _a.className;
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
    return (<view_1.View innerRef={ref} className={className} tabIndex={0} onKeyDown={function (e) {
            if (e.key === 'x' || e.key === ' ') {
                e.preventDefault();
                if (!disabled) {
                    onSelect === null || onSelect === void 0 ? void 0 : onSelect(e);
                }
            }
        }} style={__assign({ flexDirection: 'row', alignItems: 'center', cursor: 'default', transition: 'box-shadow .15s', backgroundColor: bare
                ? 'transparent'
                : disabled // always use disabled before primary since we can have a disabled primary button
                    ? theme_1.theme.buttonNormalDisabledBackground
                    : primary
                        ? theme_1.theme.buttonPrimaryBackground
                        : theme_1.theme.buttonNormalBackground, border: bare
                ? 'none'
                : '1px solid ' +
                    (disabled
                        ? theme_1.theme.buttonNormalDisabledBorder
                        : primary
                            ? theme_1.theme.buttonPrimaryBorder
                            : theme_1.theme.buttonNormalBorder), color: bare
                ? 'inherit'
                : disabled
                    ? theme_1.theme.buttonNormalDisabledText
                    : primary
                        ? theme_1.theme.buttonPrimaryText
                        : theme_1.theme.buttonNormalText, ':focus': bare
                ? null
                : {
                    outline: 0,
                    boxShadow: "1px 1px 2px ".concat(theme_1.theme.buttonNormalShadow),
                } }, style)} onFocus={function () { return onEdit && onEdit(); }} data-testid="cell-button" onClick={clickBehavior === 'none'
            ? null
            : function (e) {
                if (!disabled) {
                    onSelect === null || onSelect === void 0 ? void 0 : onSelect(e);
                    onEdit === null || onEdit === void 0 ? void 0 : onEdit();
                }
            }}>
        {children}
      </view_1.View>);
});
exports.CellButton.displayName = 'CellButton';
function SelectCell(_a) {
    var focused = _a.focused, selected = _a.selected, style = _a.style, onSelect = _a.onSelect, onEdit = _a.onEdit, _b = _a.icon, icon = _b === void 0 ? <v1_1.SvgCheckmark width={6} height={6}/> : _b, _c = _a.buttonProps, buttonProps = _c === void 0 ? {} : _c, props = __rest(_a, ["focused", "selected", "style", "onSelect", "onEdit", "icon", "buttonProps"]);
    return (<Cell {...props} focused={focused} name="select" width={20} style={__assign({ alignItems: 'center', userSelect: 'none' }, style)} onClick={function (e) {
            e.stopPropagation();
            onSelect === null || onSelect === void 0 ? void 0 : onSelect(e);
            onEdit === null || onEdit === void 0 ? void 0 : onEdit();
        }}>
      {function () { return (<exports.CellButton style={{
                width: 12,
                height: 12,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 3,
                border: selected
                    ? '1px solid ' + theme_1.theme.checkboxBorderSelected
                    : '1px solid ' + theme_1.theme.formInputBorder,
                color: theme_1.theme.checkboxText,
                backgroundColor: selected
                    ? theme_1.theme.checkboxBackgroundSelected
                    : theme_1.theme.tableBackground,
                ':focus': {
                    border: '1px solid ' + theme_1.theme.checkboxBorderSelected,
                    boxShadow: '0 1px 2px ' + theme_1.theme.checkboxShadowSelected,
                },
            }} onEdit={onEdit} onSelect={onSelect} clickBehavior="none" {...buttonProps}>
          {selected && icon}
        </exports.CellButton>); }}
    </Cell>);
}
function SheetCell(_a) {
    var valueProps = _a.valueProps, valueStyle = _a.valueStyle, inputProps = _a.inputProps, textAlign = _a.textAlign, onSave = _a.onSave, props = __rest(_a, ["valueProps", "valueStyle", "inputProps", "textAlign", "onSave"]);
    var binding = valueProps.binding, type = valueProps.type, getValueStyle = valueProps.getValueStyle, formatExpr = valueProps.formatExpr, unformatExpr = valueProps.unformatExpr, privacyFilter = valueProps.privacyFilter;
    var sheetValue = (0, useSheetValue_1.useSheetValue)(binding, function () {
        // "close" the cell if it's editing
        if (props.exposed && inputProps && inputProps.onBlur) {
            inputProps.onBlur();
        }
    });
    var format = (0, useFormat_1.useFormat)();
    return (<Cell valueStyle={getValueStyle
            ? __assign(__assign({}, valueStyle), getValueStyle(sheetValue)) : valueStyle} textAlign={textAlign} {...props} value={String(sheetValue !== null && sheetValue !== void 0 ? sheetValue : '')} formatter={function (value) {
            return props.formatter ? props.formatter(value, type) : format(value, type);
        }} privacyFilter={privacyFilter != null
            ? privacyFilter
            : type === 'financial'
                ? true
                : undefined} data-cellname={sheetValue}>
      {function () {
            return (<InputValue value={formatExpr ? formatExpr(sheetValue) : sheetValue.toString()} onUpdate={function (value) {
                    onSave(unformatExpr ? unformatExpr(value) : value);
                }} {...inputProps} style={__assign({ textAlign: textAlign }, ((inputProps === null || inputProps === void 0 ? void 0 : inputProps.style) || {}))}/>);
        }}
    </Cell>);
}
function TableHeader(_a) {
    var headers = _a.headers, children = _a.children, rowProps = __rest(_a, ["headers", "children"]);
    return (<view_1.View style={{
            borderRadius: '6px 6px 0 0',
            overflow: 'hidden',
            flexShrink: 0,
        }}>
      <exports.Row collapsed={true} {...rowProps} style={__assign({ color: theme_1.theme.tableHeaderText, backgroundColor: theme_1.theme.tableHeaderBackground, zIndex: 200, fontWeight: 500 }, rowProps.style)}>
        {headers
            ? headers.map(function (header) {
                return (<Cell key={header.name} value={header.name} width={header.width} style={header.style} valueStyle={header.valueStyle}/>);
            })
            : children}
      </exports.Row>
    </view_1.View>);
}
function SelectedItemsButton(_a) {
    var id = _a.id, name = _a.name, items = _a.items, onSelect = _a.onSelect;
    var selectedItems = (0, useSelected_1.useSelectedItems)();
    var _b = (0, react_1.useState)(false), menuOpen = _b[0], setMenuOpen = _b[1];
    var triggerRef = (0, react_1.useRef)(null);
    if (selectedItems.size === 0) {
        return null;
    }
    var buttonLabel = typeof name === 'function' ? name(selectedItems.size) : name;
    return (<view_1.View style={{ marginLeft: 10, flexShrink: 0 }}>
      <button_1.Button ref={triggerRef} variant="bare" style={{ color: theme_1.theme.pageTextPositive }} onPress={function () { return setMenuOpen(true); }} data-testid={id + '-select-button'}>
        <v0_1.SvgExpandArrow width={8} height={8} style={{ marginRight: 5, color: theme_1.theme.pageText }}/>
        {buttonLabel}
      </button_1.Button>

      <popover_1.Popover triggerRef={triggerRef} style={{
            width: 200,
            padding: 0,
            backgroundColor: theme_1.theme.menuBackground,
        }} isOpen={menuOpen} onOpenChange={function () { return setMenuOpen(false); }} data-testid={id + '-select-tooltip'}>
        <menu_1.Menu onMenuSelect={function (name) {
            onSelect(name, __spreadArray([], selectedItems, true));
            setMenuOpen(false);
        }} items={items}/>
      </popover_1.Popover>
    </view_1.View>);
}
var rowStyle = {
    position: 'absolute',
    willChange: 'transform',
    width: '100%',
};
function TableWithNavigator(_a) {
    var fields = _a.fields, props = __rest(_a, ["fields"]);
    var navigator = useTableNavigator(props.items, fields);
    return <exports.Table {...props} navigator={navigator}/>;
}
exports.Table = (0, react_1.forwardRef)(function (_a, ref) {
    var items = _a.items, count = _a.count, headers = _a.headers, contentHeader = _a.contentHeader, loading = _a.loading, _b = _a.rowHeight, rowHeight = _b === void 0 ? exports.ROW_HEIGHT : _b, _c = _a.backgroundColor, backgroundColor = _c === void 0 ? theme_1.theme.tableHeaderBackground : _c, renderItem = _a.renderItem, renderEmpty = _a.renderEmpty, getItemKey = _a.getItemKey, loadMore = _a.loadMore, style = _a.style, navigator = _a.navigator, onScroll = _a.onScroll, isSelected = _a.isSelected, saveScrollWidth = _a.saveScrollWidth, listContainerRef = _a.listContainerRef, props = __rest(_a, ["items", "count", "headers", "contentHeader", "loading", "rowHeight", "backgroundColor", "renderItem", "renderEmpty", "getItemKey", "loadMore", "style", "navigator", "onScroll", "isSelected", "saveScrollWidth", "listContainerRef"]);
    if (!navigator) {
        navigator = {
            onEdit: function () { },
            editingId: null,
            focusedField: null,
            getNavigatorProps: function (props) { return props; },
        };
    }
    var onEdit = navigator.onEdit, editingId = navigator.editingId, focusedField = navigator.focusedField, getNavigatorProps = navigator.getNavigatorProps;
    var list = (0, react_1.useRef)(null);
    var listContainerInnerRef = (0, react_1.useRef)(null);
    var listContainer = listContainerRef || listContainerInnerRef;
    var scrollContainer = (0, react_1.useRef)(null);
    var initialScrollTo = (0, react_1.useRef)(null);
    var listInitialized = (0, react_1.useRef)(false);
    (0, react_1.useImperativeHandle)(ref, function () { return ({
        scrollTo: function (id, alignment) {
            if (alignment === void 0) { alignment = 'smart'; }
            var index = items.findIndex(function (item) { return item.id === id; });
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
        scrollToTop: function () {
            var _a;
            (_a = list.current) === null || _a === void 0 ? void 0 : _a.scrollTo(0);
        },
        getScrolledItem: function () {
            if (scrollContainer.current) {
                var offset = scrollContainer.current.scrollTop;
                var index = list.current.getStartIndexForOffset(offset);
                return items[index].id;
            }
            return 0;
        },
        setRowAnimation: function (flag) {
            var _a;
            (_a = list.current) === null || _a === void 0 ? void 0 : _a.setRowAnimation(flag);
        },
        edit: function (id, field, shouldScroll) {
            onEdit(id, field);
            if (id && shouldScroll) {
                // @ts-expect-error this should not be possible
                ref.scrollTo(id);
            }
        },
        anchor: function () {
            var _a;
            (_a = list.current) === null || _a === void 0 ? void 0 : _a.anchor();
        },
        unanchor: function () {
            var _a;
            (_a = list.current) === null || _a === void 0 ? void 0 : _a.unanchor();
        },
        isAnchored: function () {
            return list.current && list.current.isAnchored();
        },
    }); });
    (0, react_1.useLayoutEffect)(function () {
        var _a;
        // We wait for the list to mount because AutoSizer needs to run
        // before it's mounted
        if (!listInitialized.current && listContainer.current) {
            // Animation is on by default
            (_a = list.current) === null || _a === void 0 ? void 0 : _a.setRowAnimation(true);
            listInitialized.current = true;
        }
        if (scrollContainer.current && saveScrollWidth) {
            setTimeout(saveScrollDelayed, 200);
        }
    });
    function saveScrollDelayed() {
        var _a, _b;
        saveScrollWidth(((_a = scrollContainer.current) === null || _a === void 0 ? void 0 : _a.offsetParent)
            ? (_b = scrollContainer.current) === null || _b === void 0 ? void 0 : _b.offsetParent.clientWidth
            : 0, scrollContainer.current ? scrollContainer.current.clientWidth : 0);
    }
    function renderRow(_a) {
        var index = _a.index, style = _a.style, key = _a.key;
        var item = items[index];
        var editing = editingId === item.id;
        var selected = isSelected && isSelected(item.id);
        var row = renderItem({
            item: item,
            editing: editing,
            focusedField: editing && focusedField,
            onEdit: onEdit,
            index: index,
            position: style.top,
        });
        // TODO: Need to also apply zIndex if item is selected
        // * Port over ListAnimation to Table
        // * Move highlighted functionality into here
        return (<view_1.View key={key} style={__assign(__assign({}, rowStyle), { zIndex: editing || selected ? 101 : 'auto', transform: 'translateY(var(--pos))' })} nativeStyle={{ '--pos': "".concat(style.top - 1, "px") }} data-focus-key={item.id}>
          {row}
        </view_1.View>);
    }
    function getScrollOffset(height, index) {
        return (index * (rowHeight - 1) +
            (rowHeight - 1) / 2 -
            height / 2 +
            (rowHeight - 1) * 2);
    }
    function onItemsRendered(_a) {
        var overscanStopIndex = _a.overscanStopIndex;
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
        return (<view_1.View style={{
                justifyContent: 'center',
                alignItems: 'center',
                fontStyle: 'italic',
                color: theme_1.theme.tableText,
                flex: 1,
            }}>
          {empty}
        </view_1.View>);
    }
    if (loading) {
        return (<view_1.View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: backgroundColor,
            }}>
          <AnimatedLoading_1.AnimatedLoading width={25} color={theme_1.theme.tableText}/>
        </view_1.View>);
    }
    var isEmpty = (count || items.length) === 0;
    return (<view_1.View style={__assign({ flex: 1, outline: 'none' }, style)} tabIndex={1} {...getNavigatorProps(props)} data-testid="table">
        {headers && (<TableHeader height={rowHeight} {...(Array.isArray(headers) ? { headers: headers } : { children: headers })}/>)}
        <view_1.View style={{
            flex: "1 1 ".concat(rowHeight * Math.max(2, items.length), "px"),
            backgroundColor: backgroundColor,
        }}>
          {isEmpty ? (getEmptyContent(renderEmpty)) : (<react_virtualized_auto_sizer_1.default>
              {function (_a) {
                var width = _a.width, height = _a.height;
                if (width === 0 || height === 0) {
                    return null;
                }
                return (<useProperFocus_1.AvoidRefocusScrollProvider>
                    <FixedSizeList_1.FixedSizeList ref={list} header={contentHeader} innerRef={listContainer} outerRef={scrollContainer} width={width} height={height} renderRow={renderRow} itemCount={count || items.length} itemSize={rowHeight - 1} itemKey={getItemKey || (function (index) { return items[index].id; })} indexForKey={function (key) {
                        return items.findIndex(function (item) { return item.id === key; });
                    }} initialScrollOffset={initialScrollTo.current
                        ? getScrollOffset(height, initialScrollTo.current)
                        : 0} overscanCount={5} onItemsRendered={onItemsRendered} onScroll={onScroll}/>
                  </useProperFocus_1.AvoidRefocusScrollProvider>);
            }}
            </react_virtualized_auto_sizer_1.default>)}
        </view_1.View>
      </view_1.View>);
});
// @ts-expect-error fix me
exports.Table.displayName = 'Table';
function useTableNavigator(data, fields) {
    var getFields = typeof fields !== 'function' ? function () { return fields; } : fields;
    var _a = (0, react_1.useState)(null), editingId = _a[0], setEditingId = _a[1];
    var _b = (0, react_1.useState)(null), focusedField = _b[0], setFocusedField = _b[1];
    var containerRef = (0, react_1.useRef)(null);
    // See `onBlur` for why we need this
    var modalState = (0, useModalState_1.useModalState)();
    var modalStackLength = (0, react_1.useRef)(modalState.modalStack.length);
    // onEdit is passed to children, so make sure it maintains identity
    var onEdit = (0, react_1.useCallback)(function (id, field) {
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
        setTimeout(function () {
            onEdit(editingId, focusedField);
        }, 100);
    }
    function onFocusPrevious() {
        var idx = data.findIndex(function (item) { return item.id === editingId; });
        if (idx > 0) {
            var item = data[idx - 1];
            var fields_1 = getFields(item);
            onEdit(item.id, fields_1[fields_1.length - 1]);
        }
        else {
            flashInput();
        }
    }
    function onFocusNext() {
        var idx = data.findIndex(function (item) { return item.id === editingId; });
        if (idx < data.length - 1) {
            var item = data[idx + 1];
            var fields_2 = getFields(item);
            onEdit(item.id, fields_2[0]);
        }
        else {
            flashInput();
        }
    }
    function moveHorizontally(dir) {
        if (editingId) {
            var fields_3 = getFields(data.find(function (item) { return item.id === editingId; }));
            var idx = fields_3.indexOf(focusedField) + dir;
            if (idx < 0) {
                onFocusPrevious();
            }
            else if (idx >= fields_3.length) {
                onFocusNext();
            }
            else {
                setFocusedField(fields_3[idx]);
            }
        }
    }
    function moveVertically(dir) {
        if (editingId) {
            var idx = data.findIndex(function (item) { return item.id === editingId; });
            var nextIdx = idx;
            while (true) {
                nextIdx = nextIdx + dir;
                if (nextIdx >= 0 && nextIdx < data.length) {
                    var next = data[nextIdx];
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
        return __assign(__assign({}, userProps), { innerRef: containerRef, onKeyDown: function (e) {
                var _a;
                (_a = userProps === null || userProps === void 0 ? void 0 : userProps.onKeyDown) === null || _a === void 0 ? void 0 : _a.call(userProps, e);
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
            }, onBlur: function (e) {
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
                var prevNumModals = modalStackLength.current;
                var numModals = modalState.modalStack.length;
                if (document.hasFocus() &&
                    (e.relatedTarget == null ||
                        !containerRef.current.contains(e.relatedTarget) ||
                        containerRef.current === e.relatedTarget) &&
                    prevNumModals === numModals) {
                    onEdit(null);
                }
            } });
    }
    return { onEdit: onEdit, editingId: editingId, focusedField: focusedField, getNavigatorProps: getNavigatorProps };
}
