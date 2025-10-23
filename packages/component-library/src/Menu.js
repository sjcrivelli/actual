"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menu = Menu;
const react_1 = require("react");
const Button_1 = require("./Button");
const Text_1 = require("./Text");
const theme_1 = require("./theme");
const Toggle_1 = require("./Toggle");
const View_1 = require("./View");
const MenuLine = Symbol('menu-line');
const MenuLabel = Symbol('menu-label');
Menu.line = MenuLine;
Menu.label = MenuLabel;
function Keybinding({ keyName }) {
    return (<Text_1.Text style={{ fontSize: 10, color: theme_1.theme.menuKeybindingText }}>
      {keyName}
    </Text_1.Text>);
}
function isLabel(item) {
    return item.type === Menu.label;
}
function Menu({ header, footer, items: allItems, onMenuSelect, style, className, getItemStyle, slot, }) {
    const elRef = (0, react_1.useRef)(null);
    const items = allItems.filter(x => x);
    const [hoveredIndex, setHoveredIndex] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const el = elRef.current;
        el?.focus();
        const onKeyDown = (e) => {
            const filteredItems = items.filter(item => item && item !== Menu.line && item.type !== Menu.label);
            const currentIndex = filteredItems.indexOf(items[hoveredIndex || 0]);
            const transformIndex = (idx) => items.indexOf(filteredItems[idx]);
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
                    const item = items[hoveredIndex || 0];
                    if (hoveredIndex !== null && item !== Menu.line && !isLabel(item)) {
                        onMenuSelect?.(item.name);
                    }
                    break;
                default:
            }
        };
        el?.addEventListener('keydown', onKeyDown);
        return () => {
            el?.removeEventListener('keydown', onKeyDown);
        };
    }, [hoveredIndex]);
    return (<View_1.View className={className} style={{ outline: 'none', borderRadius: 4, overflow: 'hidden', ...style }} tabIndex={1} innerRef={elRef}>
      {header}
      {items.map((item, idx) => {
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
            const Icon = item.icon;
            return (<Button_1.Button key={String(item.name)} variant="bare" slot={slot} style={{
                    cursor: 'default',
                    padding: 10,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: theme_1.theme.menuItemText,
                    ...(item.disabled && { color: theme_1.theme.buttonBareDisabledText }),
                    ...(!item.disabled &&
                        hoveredIndex === idx && {
                        backgroundColor: theme_1.theme.menuItemBackgroundHover,
                        color: theme_1.theme.menuItemTextHover,
                    }),
                    ...(!isLabel(item) && getItemStyle?.(item)),
                }} onHoverStart={() => setHoveredIndex(idx)} onHoverEnd={() => setHoveredIndex(null)} onPress={() => {
                    if (!item.disabled &&
                        item.toggle === undefined &&
                        !isLabel(item)) {
                        onMenuSelect?.(item.name);
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
                <Toggle_1.Toggle id={String(item.name)} isOn={item.toggle} style={{ marginLeft: 5 }} onToggle={() => !item.disabled &&
                        !isLabel(item) &&
                        item.toggle !== undefined &&
                        onMenuSelect?.(item.name)}/>
              </View_1.View>)}
            {item.key && <Keybinding keyName={item.key}/>}
          </Button_1.Button>);
        })}
      {footer}
    </View_1.View>);
}
