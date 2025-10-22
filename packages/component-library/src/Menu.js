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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menu = Menu;
var react_1 = require("react");
var Button_1 = require("./Button");
var Text_1 = require("./Text");
var theme_1 = require("./theme");
var Toggle_1 = require("./Toggle");
var View_1 = require("./View");
var MenuLine = Symbol('menu-line');
var MenuLabel = Symbol('menu-label');
Menu.line = MenuLine;
Menu.label = MenuLabel;
function Keybinding(_a) {
    var keyName = _a.keyName;
    return (<Text_1.Text style={{ fontSize: 10, color: theme_1.theme.menuKeybindingText }}>
      {keyName}
    </Text_1.Text>);
}
function isLabel(item) {
    return item.type === Menu.label;
}
function Menu(_a) {
    var header = _a.header, footer = _a.footer, allItems = _a.items, onMenuSelect = _a.onMenuSelect, style = _a.style, className = _a.className, getItemStyle = _a.getItemStyle, slot = _a.slot;
    var elRef = (0, react_1.useRef)(null);
    var items = allItems.filter(function (x) { return x; });
    var _b = (0, react_1.useState)(null), hoveredIndex = _b[0], setHoveredIndex = _b[1];
    (0, react_1.useEffect)(function () {
        var el = elRef.current;
        el === null || el === void 0 ? void 0 : el.focus();
        var onKeyDown = function (e) {
            var filteredItems = items.filter(function (item) { return item && item !== Menu.line && item.type !== Menu.label; });
            var currentIndex = filteredItems.indexOf(items[hoveredIndex || 0]);
            var transformIndex = function (idx) { return items.indexOf(filteredItems[idx]); };
            switch (e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    setHoveredIndex(hoveredIndex === null
                        ? 0
                        : transformIndex(Math.max(currentIndex - 1, 0)));
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    setHoveredIndex(hoveredIndex === null
                        ? 0
                        : transformIndex(Math.min(currentIndex + 1, filteredItems.length - 1)));
                    break;
                case 'Enter':
                    e.preventDefault();
                    var item = items[hoveredIndex || 0];
                    if (hoveredIndex !== null && item !== Menu.line && !isLabel(item)) {
                        onMenuSelect === null || onMenuSelect === void 0 ? void 0 : onMenuSelect(item.name);
                    }
                    break;
                default:
            }
        };
        el === null || el === void 0 ? void 0 : el.addEventListener('keydown', onKeyDown);
        return function () {
            el === null || el === void 0 ? void 0 : el.removeEventListener('keydown', onKeyDown);
        };
    }, [hoveredIndex]);
    return (<View_1.View className={className} style={__assign({ outline: 'none', borderRadius: 4, overflow: 'hidden' }, style)} tabIndex={1} innerRef={elRef}>
      {header}
      {items.map(function (item, idx) {
            if (item === Menu.line) {
                return (<View_1.View key={idx} style={{ margin: '3px 0px' }}>
              <View_1.View style={{ borderTop: '1px solid ' + theme_1.theme.menuBorder }}/>
            </View_1.View>);
            }
            else if (isLabel(item)) {
                return (<Text_1.Text key={idx} style={{
                        color: theme_1.theme.menuItemTextHeader,
                        fontSize: 11,
                        lineHeight: '1em',
                        textTransform: 'uppercase',
                        margin: '3px 9px',
                        marginTop: 5,
                    }}>
              {item.name}
            </Text_1.Text>);
            }
            var Icon = item.icon;
            return (<Button_1.Button key={String(item.name)} variant="bare" slot={slot} style={__assign(__assign(__assign({ cursor: 'default', padding: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', color: theme_1.theme.menuItemText }, (item.disabled && { color: theme_1.theme.buttonBareDisabledText })), (!item.disabled &&
                    hoveredIndex === idx && {
                    backgroundColor: theme_1.theme.menuItemBackgroundHover,
                    color: theme_1.theme.menuItemTextHover,
                })), (!isLabel(item) && (getItemStyle === null || getItemStyle === void 0 ? void 0 : getItemStyle(item))))} onHoverStart={function () { return setHoveredIndex(idx); }} onHoverEnd={function () { return setHoveredIndex(null); }} onPress={function () {
                    if (!item.disabled &&
                        item.toggle === undefined &&
                        !isLabel(item)) {
                        onMenuSelect === null || onMenuSelect === void 0 ? void 0 : onMenuSelect(item.name);
                    }
                }}>
            {/* Force it to line up evenly */}
            {item.toggle === undefined ? (<>
                {Icon && (<Icon width={item.iconSize || 10} height={item.iconSize || 10} style={{ marginRight: 7, width: item.iconSize || 10 }}/>)}
                <Text_1.Text title={item.tooltip}>{item.text}</Text_1.Text>
                <View_1.View style={{ flex: 1 }}/>
              </>) : (<View_1.View style={{
                        flexDirection: 'row',
                        flex: 1,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                <label htmlFor={String(item.name)} title={item.tooltip}>
                  {item.text}
                </label>
                <Toggle_1.Toggle id={String(item.name)} isOn={item.toggle} style={{ marginLeft: 5 }} onToggle={function () {
                        return !item.disabled &&
                            !isLabel(item) &&
                            item.toggle !== undefined &&
                            (onMenuSelect === null || onMenuSelect === void 0 ? void 0 : onMenuSelect(item.name));
                    }}/>
              </View_1.View>)}
            {item.key && <Keybinding keyName={item.key}/>}
          </Button_1.Button>);
        })}
      {footer}
    </View_1.View>);
}
