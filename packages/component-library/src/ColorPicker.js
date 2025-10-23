"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorPicker = ColorPicker;
const react_aria_components_1 = require("react-aria-components");
const css_1 = require("@emotion/css");
const Input_1 = require("./Input");
const Popover_1 = require("./Popover");
function ColorSwatch(props) {
    return (<react_aria_components_1.ColorSwatch {...props} style={({ color }) => ({
            background: color.toString('hex'),
            width: '32px',
            height: '32px',
            borderRadius: '4px',
            boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.1)',
        })}/>);
}
// colors from https://materialui.co/colors
const DEFAULT_COLOR_SET = [
    '#690CB0',
    '#D32F2F',
    '#C2185B',
    '#7B1FA2',
    '#512DA8',
    '#303F9F',
    '#1976D2',
    '#0288D1',
    '#0097A7',
    '#00796B',
    '#388E3C',
    '#689F38',
    '#AFB42B',
    '#FBC02D',
    '#FFA000',
    '#F57C00',
    '#E64A19',
    '#5D4037',
    '#616161',
    '#455A64',
];
function ColorSwatchPicker({ columns = 5, colorset = DEFAULT_COLOR_SET, }) {
    const pickers = [];
    for (let l = 0; l < colorset.length / columns; l++) {
        const pickerItems = [];
        for (let c = 0; c < columns; c++) {
            const color = colorset[columns * l + c];
            if (!color) {
                break;
            }
            pickerItems.push(<react_aria_components_1.ColorSwatchPickerItem key={color} color={color} className={(0, css_1.css)({
                    position: 'relative',
                    outline: 'none',
                    borderRadius: '4px',
                    width: 'fit-content',
                    forcedColorAdjust: 'none',
                    cursor: 'pointer',
                    '&[data-selected]::after': {
                        // eslint-disable-next-line actual/typography
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        border: '2px solid black',
                        outline: '2px solid white',
                        outlineOffset: '-4px',
                        borderRadius: 'inherit',
                    },
                })}>
          <ColorSwatch />
        </react_aria_components_1.ColorSwatchPickerItem>);
        }
        pickers.push(<react_aria_components_1.ColorSwatchPicker key={`colorset-${l}`} style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
            }}>
        {pickerItems}
      </react_aria_components_1.ColorSwatchPicker>);
    }
    return pickers;
}
const isColor = (value) => /^#[0-9a-fA-F]{6}$/.test(value);
function ColorPicker({ children, columns, colorset, ...props }) {
    const onInput = (value) => {
        if (!isColor(value)) {
            return;
        }
        const color = (0, react_aria_components_1.parseColor)(value);
        if (color) {
            props.onChange?.(color);
        }
    };
    return (<react_aria_components_1.ColorPicker defaultValue={props.defaultValue ?? '#690CB0'} {...props}>
      <react_aria_components_1.DialogTrigger>
        {children}
        <Popover_1.Popover>
          <react_aria_components_1.Dialog style={{
            outline: 'none',
            padding: '15px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minWidth: '192px',
            maxHeight: 'inherit',
            boxSizing: 'border-box',
            overflow: 'auto',
        }}>
            <ColorSwatchPicker columns={columns} colorset={colorset}/>
            <react_aria_components_1.ColorField onInput={({ target: { value } }) => onInput(value)}>
              <Input_1.Input placeholder="#RRGGBB" style={{ width: '100px' }}/>
            </react_aria_components_1.ColorField>
          </react_aria_components_1.Dialog>
        </Popover_1.Popover>
      </react_aria_components_1.DialogTrigger>
    </react_aria_components_1.ColorPicker>);
}
