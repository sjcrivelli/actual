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
exports.SvgLogo = void 0;
const React = __importStar(require("react"));
const SvgLogo = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 32" style={{
        color: 'inherit',
        ...props.style,
    }}>
    <path fill="currentColor" d="m1.138 30.423 13.8-29.309a.32.32 0 0 1 .289-.184h.605a.32.32 0 0 1 .287.18l8.903 18.29 2.791-1.074a.32.32 0 0 1 .414.184l.742 1.932a.32.32 0 0 1-.183.413l-2.574.99 3.175 6.524a.32.32 0 0 1-.147.428l-1.861.905a.32.32 0 0 1-.428-.147l-3.277-6.733-21.98 8.453a.32.32 0 0 1-.415-.189l-.152-.418a.32.32 0 0 1 .01-.245ZM15.56 6.152 5.85 26.774l16.634-6.398L15.56 6.152Z"/>
    <path fill="currentColor" d="m21.777 14.568.932 2.544-21.203 7.775a.32.32 0 0 1-.41-.19l-.713-1.944a.32.32 0 0 1 .19-.41l21.204-7.775Z"/>
  </svg>);
exports.SvgLogo = SvgLogo;
