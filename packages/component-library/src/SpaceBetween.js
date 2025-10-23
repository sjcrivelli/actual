"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaceBetween = void 0;
const react_1 = __importDefault(require("react"));
const View_1 = require("./View");
const SpaceBetween = ({ direction = 'horizontal', gap = 15, style, children, }) => {
    return (<View_1.View style={{
            flexWrap: 'wrap',
            flexDirection: direction === 'horizontal' ? 'row' : 'column',
            alignItems: 'center',
            gap,
            ...style,
        }}>
      {children}
    </View_1.View>);
};
exports.SpaceBetween = SpaceBetween;
