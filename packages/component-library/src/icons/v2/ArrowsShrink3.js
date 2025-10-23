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
exports.SvgArrowsShrink3 = void 0;
const React = __importStar(require("react"));
const SvgArrowsShrink3 = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{
        color: 'inherit',
        ...props.style,
    }}>
    <path fill="currentColor" d="M14.143 1.714A1.286 1.286 0 0 1 15.429 3v3.753L21.806.377a1.286 1.286 0 0 1 1.817 1.817l-6.376 6.377H21a1.286 1.286 0 1 1 0 2.572h-6.857a1.286 1.286 0 0 1-1.286-1.286V3a1.286 1.286 0 0 1 1.286-1.286ZM9.857 22.286A1.285 1.285 0 0 1 8.571 21v-3.753l-6.377 6.376a1.286 1.286 0 0 1-1.817-1.817l6.376-6.377H3a1.286 1.286 0 0 1 0-2.572h6.857a1.286 1.286 0 0 1 1.286 1.286V21a1.286 1.286 0 0 1-1.286 1.286Z"/>
  </svg>);
exports.SvgArrowsShrink3 = SvgArrowsShrink3;
