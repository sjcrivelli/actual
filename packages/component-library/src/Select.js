"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Select = Select;
var react_1 = require("react");
var Button_1 = require("./Button");
var v0_1 = require("./icons/v0");
var Menu_1 = require("./Menu");
var Popover_1 = require("./Popover");
var View_1 = require("./View");
function isValueOption(option) {
    return option !== Menu_1.Menu.line;
}
/**
 * @param {Array<[string, string]>} options - An array of options value-label pairs.
 * @param {string} value - The currently selected option value.
 * @param {string} [defaultLabel] - The label to display when the selected value is not in the options.
 * @param {function} [onChange] - A callback function invoked when the selected value changes.
 * @param {CSSProperties} [style] - Custom styles to apply to the selected button.
 * @param {string[]} [disabledKeys] - An array of option values to disable.
 *
 * @example
 * // Usage:
 * // <Select options={[['1', 'Option 1'], ['2', 'Option 2']]} value="1" onChange={handleOnChange} />
 * // <Select options={[['1', 'Option 1'], ['2', 'Option 2']]} value="3" defaultLabel="Select an option"  onChange={handleOnChange} />
 */
function Select(_a) {
    var id = _a.id, bare = _a.bare, options = _a.options, value = _a.value, _b = _a.defaultLabel, defaultLabel = _b === void 0 ? '' : _b, onChange = _a.onChange, _c = _a.disabled, disabled = _c === void 0 ? false : _c, _d = _a.disabledKeys, disabledKeys = _d === void 0 ? [] : _d, _e = _a.style, style = _e === void 0 ? {} : _e, _f = _a.popoverStyle, popoverStyle = _f === void 0 ? {} : _f, className = _a.className;
    var targetOption = options
        .filter(isValueOption)
        .find(function (option) { return option[0] === value; });
    var triggerRef = (0, react_1.useRef)(null);
    var _g = (0, react_1.useState)(false), isOpen = _g[0], setIsOpen = _g[1];
    return (<>
      <Button_1.Button ref={triggerRef} id={id} variant={bare ? 'bare' : 'normal'} isDisabled={disabled} onPress={function () {
            setIsOpen(true);
        }} style={style} className={className}>
        <View_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 5,
            width: '100%',
        }}>
          <span style={{
            textAlign: 'left',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: 'calc(100% - 7px)',
        }}>
            {targetOption ? targetOption[1] : defaultLabel}
          </span>
          <v0_1.SvgExpandArrow style={{
            width: 7,
            height: 7,
            color: 'inherit',
        }}/>
        </View_1.View>
      </Button_1.Button>

      <Popover_1.Popover triggerRef={triggerRef} placement="bottom start" isOpen={isOpen} onOpenChange={function () { return setIsOpen(false); }} style={popoverStyle}>
        <Menu_1.Menu onMenuSelect={function (item) {
            onChange === null || onChange === void 0 ? void 0 : onChange(item);
            setIsOpen(false);
        }} items={options.map(function (item) {
            return item === Menu_1.Menu.line
                ? Menu_1.Menu.line
                : {
                    name: item[0],
                    text: item[1],
                    disabled: disabledKeys.includes(item[0]),
                };
        })} getItemStyle={function (option) {
            if (targetOption && targetOption[0] === option.name) {
                return { fontWeight: 'bold' };
            }
            return {};
        }}/>
      </Popover_1.Popover>
    </>);
}
