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
exports.SvgCheckCircleHollow = void 0;
const React = __importStar(require("react"));
const SvgCheckCircleHollow = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{
        color: 'inherit',
        ...props.style,
    }}>
    <path d="M12 0C1.308 0-4.044 12.925 3.516 20.484 11.075 28.044 24 22.692 24 12 23.992 5.376 18.624.008 12 0zm.01 1.988c5.521.007 9.995 4.48 10.002 10.002 0 8.912-10.774 13.373-17.075 7.072-6.3-6.3-1.839-17.074 7.073-17.074zm6.234 4.588a1 1 0 0 0-.928.442l-6.226 8.45-4.076-3.261a1 1 0 1 0-1.25 1.563l4.888 3.908a1.011 1.011 0 0 0 1.43-.19L18.928 8.2a1 1 0 0 0-.684-1.623z" fill="currentColor"/>
  </svg>);
exports.SvgCheckCircleHollow = SvgCheckCircleHollow;
