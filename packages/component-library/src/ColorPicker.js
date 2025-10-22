"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorPicker = ColorPicker;
var react_aria_components_1 = require("react-aria-components");
var css_1 = require("@emotion/css");
var Input_1 = require("./Input");
var Popover_1 = require("./Popover");
function ColorSwatch(props) {
    return (<react_aria_components_1.ColorSwatch {...props} style={function (_a) {
            var color = _a.color;
            return ({
                background: color.toString('hex'),
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.1)',
            });
        }}/>);
}
// colors from https://materialui.co/colors
var DEFAULT_COLOR_SET = [
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
function ColorSwatchPicker(_a) {
    var _b = _a.columns, columns = _b === void 0 ? 5 : _b, _c = _a.colorset, colorset = _c === void 0 ? DEFAULT_COLOR_SET : _c;
    var pickers = [];
    for (var l = 0; l < colorset.length / columns; l++) {
        var pickerItems = [];
        for (var c = 0; c < columns; c++) {
            var color = colorset[columns * l + c];
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
        pickers.push(<react_aria_components_1.ColorSwatchPicker key={"colorset-".concat(l)} style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
            }}>
        {pickerItems}
      </react_aria_components_1.ColorSwatchPicker>);
    }
    return pickers;
}
var isColor = function (value) { return /^#[0-9a-fA-F]{6}$/.test(value); };
function ColorPicker(_a) {
    var _b;
    var children = _a.children, columns = _a.columns, colorset = _a.colorset, props = __rest(_a, ["children", "columns", "colorset"]);
    var onInput = function (value) {
        var _a;
        if (!isColor(value)) {
            return;
        }
        var color = (0, react_aria_components_1.parseColor)(value);
        if (color) {
            (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, color);
        }
    };
    return (<react_aria_components_1.ColorPicker defaultValue={(_b = props.defaultValue) !== null && _b !== void 0 ? _b : '#690CB0'} {...props}>
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
            <react_aria_components_1.ColorField onInput={function (_a) {
            var value = _a.target.value;
            return onInput(value);
        }}>
              <Input_1.Input placeholder="#RRGGBB" style={{ width: '100px' }}/>
            </react_aria_components_1.ColorField>
          </react_aria_components_1.Dialog>
        </Popover_1.Popover>
      </react_aria_components_1.DialogTrigger>
    </react_aria_components_1.ColorPicker>);
}
