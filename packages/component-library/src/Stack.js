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
exports.Stack = void 0;
// @ts-strict-ignore
const react_1 = __importStar(require("react"));
const Text_1 = require("./Text");
const View_1 = require("./View");
function getChildren(key, children) {
    return react_1.Children.toArray(children).reduce((list, child) => {
        if (child) {
            if (typeof child === 'object' &&
                'type' in child &&
                child.type === react_1.Fragment) {
                return list.concat(getChildren(child.key, typeof child.props === 'object' && 'children' in child.props
                    ? child.props.children
                    : []));
            }
            list.push({ key: key + child['key'], child });
            return list;
        }
        return list;
    }, []);
}
exports.Stack = (0, react_1.forwardRef)(({ direction = 'column', align, justify, spacing = 3, children, debug, style, ...props }, ref) => {
    const isReversed = direction.endsWith('reverse');
    const isHorizontal = direction.startsWith('row');
    const validChildren = getChildren('', children);
    return (<View_1.View style={{
            flexDirection: direction,
            alignItems: align,
            justifyContent: justify,
            ...style,
        }} innerRef={ref} {...props}>
        {validChildren.map(({ key, child }, index) => {
            const isLastChild = validChildren.length === index + 1;
            let marginProp;
            if (isHorizontal) {
                marginProp = isReversed ? 'marginLeft' : 'marginRight';
            }
            else {
                marginProp = isReversed ? 'marginTop' : 'marginBottom';
            }
            return (0, react_1.cloneElement)(typeof child === 'string' ? <Text_1.Text>{child}</Text_1.Text> : child, {
                key,
                style: {
                    ...(debug && { borderWidth: 1, borderColor: 'red' }),
                    ...(isLastChild ? null : { [marginProp]: spacing * 5 }),
                    ...(child.props ? child.props.style : null),
                },
            });
        })}
      </View_1.View>);
});
exports.Stack.displayName = 'Stack';
