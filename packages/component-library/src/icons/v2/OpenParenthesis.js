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
exports.SvgOpenParenthesis = void 0;
const React = __importStar(require("react"));
const SvgOpenParenthesis = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 56.7" preserveAspectRatio="none" style={{
        color: 'inherit',
        ...props.style,
    }}>
    <path d="M15.1,54.5L15.1,54.5c-1.3-0.2-2.4-0.7-3.4-1.5c-0.8-0.8-1.5-1.8-2-2.9c-0.9-2.3-3.1-8.4-3.1-21.8S8.8,8.9,9.8,6.6
	c0.5-1.1,1.2-2.1,2-2.9c1-0.8,2.1-1.3,3.3-1.5h0.1c0.4-0.1,0.6-0.4,0.6-0.8c-0.1-0.3-0.3-0.6-0.6-0.6c-1.6-0.2-3.2,0.1-4.7,0.8
	C9,2.4,7.8,3.5,6.8,4.8c-1.7,2.6-2.9,5.4-3.6,8.4l-0.1,0.3c-2.5,9.7-2.5,19.8,0,29.5l0.1,0.3c0.7,3,1.9,5.8,3.6,8.4
	c0.9,1.3,2.2,2.4,3.6,3.2c1.5,0.7,3.1,0.9,4.7,0.8c0.4,0,0.7-0.4,0.6-0.7C15.7,54.8,15.5,54.5,15.1,54.5L15.1,54.5z" fill="currentColor"/>
  </svg>);
exports.SvgOpenParenthesis = SvgOpenParenthesis;
