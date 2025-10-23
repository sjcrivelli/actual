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
exports.SvgDownAndRightArrow = void 0;
const React = __importStar(require("react"));
const SvgDownAndRightArrow = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style={{
        color: 'inherit',
        ...props.style,
    }}>
    <path d="M4.092 3.658 1.267 6.484l.708.708.708.708 1.609-1.608L5.9 4.684V7.4c.001 2.838.022 3.466.132 3.96.393 1.766 1.732 2.972 3.985 3.59.238.065.53.133.65.151.119.018 1.229.055 2.466.082 1.238.028 2.458.06 2.712.072l.462.021-1.561 1.562-1.562 1.562.708.708.708.708 2.7-2.699 2.7-2.7v-.5l-2.7-2.7-2.7-2.7-.7.7-.7.699 1.675 1.679 1.675 1.678-.617-.019c-.339-.011-1.584-.043-2.766-.071-1.191-.028-2.232-.067-2.334-.087a6.822 6.822 0 0 1-1.283-.426c-.754-.356-1.201-.777-1.447-1.365-.167-.399-.17-.463-.17-3.649V4.684L9.55 6.3l1.617 1.616.708-.708.708-.708L9.75 3.667 6.917.833 4.092 3.658" fill="currentColor"/>
  </svg>);
exports.SvgDownAndRightArrow = SvgDownAndRightArrow;
