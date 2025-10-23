"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tooltip = void 0;
const react_1 = __importStar(require("react"));
const react_aria_components_1 = require("react-aria-components");
const styles_1 = require("./styles");
const View_1 = require("./View");
const Tooltip = ({ children, content, triggerProps = {}, ...props }) => {
    const triggerRef = (0, react_1.useRef)(null);
    const [isHovered, setIsHover] = (0, react_1.useState)(false);
    const hoverTimeoutRef = (0, react_1.useRef)(null);
    const closeTimeoutRef = (0, react_1.useRef)(null);
    const handlePointerEnter = (0, react_1.useCallback)(() => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
        }
        const timeout = setTimeout(() => {
            setIsHover(true);
        }, triggerProps.delay ?? 300);
        hoverTimeoutRef.current = timeout;
    }, [triggerProps.delay]);
    const handlePointerLeave = (0, react_1.useCallback)(() => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        closeTimeoutRef.current = setTimeout(() => {
            setIsHover(false);
        }, triggerProps.closeDelay ?? 0);
    }, [triggerProps.closeDelay]);
    // Force closing the tooltip whenever the disablement state changes
    (0, react_1.useEffect)(() => {
        setIsHover(false);
    }, [triggerProps.isDisabled]);
    return (<View_1.View style={{ minHeight: 'auto', flexShrink: 0, maxWidth: '100%' }} ref={triggerRef} onMouseEnter={handlePointerEnter} onMouseLeave={handlePointerLeave}>
      <react_aria_components_1.TooltipTrigger isOpen={isHovered && !triggerProps.isDisabled} {...triggerProps}>
        {children}

        <react_aria_components_1.Tooltip triggerRef={triggerRef} style={styles_1.styles.tooltip} {...props}>
          {content}
        </react_aria_components_1.Tooltip>
      </react_aria_components_1.TooltipTrigger>
    </View_1.View>);
};
exports.Tooltip = Tooltip;
