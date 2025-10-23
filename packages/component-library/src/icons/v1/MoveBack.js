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
exports.SvgMoveBack = void 0;
const React = __importStar(require("react"));
const SvgMoveBack = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{
        color: 'inherit',
        ...props.style,
    }}>
    <path d="M5.418 16.414a1 1 0 0 0 1.707-.707v-3.291a.25.25 0 0 1 .25-.25h13.542a.25.25 0 0 1 .25.25v5.208a1.25 1.25 0 0 0 2.5 0v-6.708a1.25 1.25 0 0 0-1.25-1.25H7.375a.25.25 0 0 1-.25-.25V6.124a1 1 0 0 0-1.707-.707L.626 10.209a1 1 0 0 0 0 1.414Z" fill="currentColor"/>
  </svg>);
exports.SvgMoveBack = SvgMoveBack;
