"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toggle = void 0;
const react_1 = __importDefault(require("react"));
const css_1 = require("@emotion/css");
const theme_1 = require("./theme");
const View_1 = require("./View");
const Toggle = ({ id, isOn, isDisabled = false, onToggle, className, style, }) => {
    return (<View_1.View style={style} className={className}>
      <input id={id} checked={isOn} disabled={isDisabled} onChange={e => onToggle?.(e.target.checked)} className={(0, css_1.css)({
            height: 0,
            width: 0,
            visibility: 'hidden',
        })} type="checkbox"/>
      <label data-toggle-container data-on={isOn} className={String((0, css_1.css)({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            width: '32px',
            height: '16px',
            borderRadius: '100px',
            position: 'relative',
            transition: 'background-color .2s',
            backgroundColor: isOn
                ? theme_1.theme.checkboxToggleBackgroundSelected
                : theme_1.theme.checkboxToggleBackground,
        }))} htmlFor={id}>
        <span data-toggle data-on={isOn} className={(0, css_1.css)({
            // eslint-disable-next-line actual/typography
            content: '" "',
            position: 'absolute',
            top: '2px',
            left: '2px',
            width: '12px',
            height: '12px',
            borderRadius: '100px',
            transition: '0.2s',
            boxShadow: '0 0 2px 0 rgba(10, 10, 10, 0.29)',
            backgroundColor: isDisabled
                ? theme_1.theme.checkboxToggleDisabled
                : '#fff',
        }, isOn && {
            left: 'calc(100% - 2px)',
            transform: 'translateX(-100%)',
        })}/>
      </label>
    </View_1.View>);
};
exports.Toggle = Toggle;
