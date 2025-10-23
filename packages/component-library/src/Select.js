"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Select = Select;
const react_1 = require("react");
const Button_1 = require("./Button");
const v0_1 = require("./icons/v0");
const Menu_1 = require("./Menu");
const Popover_1 = require("./Popover");
const View_1 = require("./View");
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
function Select({ id, bare, options, value, defaultLabel = '', onChange, disabled = false, disabledKeys = [], style = {}, popoverStyle = {}, className, }) {
    const targetOption = options
        .filter(isValueOption)
        .find(option => option[0] === value);
    const triggerRef = (0, react_1.useRef)(null);
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    return (<>
      <Button_1.Button ref={triggerRef} id={id} variant={bare ? 'bare' : 'normal'} isDisabled={disabled} onPress={() => {
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

      <Popover_1.Popover triggerRef={triggerRef} placement="bottom start" isOpen={isOpen} onOpenChange={() => setIsOpen(false)} style={popoverStyle}>
        <Menu_1.Menu onMenuSelect={item => {
            onChange?.(item);
            setIsOpen(false);
        }} items={options.map(item => item === Menu_1.Menu.line
            ? Menu_1.Menu.line
            : {
                name: item[0],
                text: item[1],
                disabled: disabledKeys.includes(item[0]),
            })} getItemStyle={option => {
            if (targetOption && targetOption[0] === option.name) {
                return { fontWeight: 'bold' };
            }
            return {};
        }}/>
      </Popover_1.Popover>
    </>);
}
