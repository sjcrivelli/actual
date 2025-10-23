"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Popover = void 0;
const react_1 = require("react");
const react_aria_components_1 = require("react-aria-components");
const css_1 = require("@emotion/css");
const styles_1 = require("./styles");
const Popover = ({ style = {}, shouldCloseOnInteractOutside, ...props }) => {
    const ref = (0, react_1.useRef)(null);
    const handleFocus = (0, react_1.useCallback)((e) => {
        if (!ref.current?.contains(e.relatedTarget)) {
            props.onOpenChange?.(false);
        }
    }, [props]);
    (0, react_1.useEffect)(() => {
        if (!props.isNonModal)
            return;
        if (props.isOpen) {
            ref.current?.addEventListener('focusout', handleFocus);
        }
        else {
            ref.current?.removeEventListener('focusout', handleFocus);
        }
    }, [handleFocus, props.isNonModal, props.isOpen]);
    return (<react_aria_components_1.Popover ref={ref} placement="bottom end" offset={1} className={(0, css_1.css)({
            ...styles_1.styles.tooltip,
            ...styles_1.styles.lightScrollbar,
            padding: 0,
            userSelect: 'none',
            ...style,
        })} shouldCloseOnInteractOutside={element => {
            if (shouldCloseOnInteractOutside) {
                return shouldCloseOnInteractOutside(element);
            }
            return true;
        }} {...props}/>);
};
exports.Popover = Popover;
