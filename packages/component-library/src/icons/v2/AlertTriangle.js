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
exports.SvgAlertTriangle = void 0;
const React = __importStar(require("react"));
const SvgAlertTriangle = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{
        color: 'inherit',
        ...props.style,
    }}>
    <path d="M23.119 20 13.772 2.15a2 2 0 0 0-3.543 0L.881 20a2 2 0 0 0 1.772 2.928h18.694A2 2 0 0 0 23.119 20ZM11 8.423a1 1 0 0 1 2 0v6a1 1 0 1 1-2 0Zm1.05 11.51h-.028a1.528 1.528 0 0 1-1.522-1.47 1.476 1.476 0 0 1 1.448-1.53h.028A1.527 1.527 0 0 1 13.5 18.4a1.475 1.475 0 0 1-1.45 1.533Z" fill="currentColor"/>
  </svg>);
exports.SvgAlertTriangle = SvgAlertTriangle;
