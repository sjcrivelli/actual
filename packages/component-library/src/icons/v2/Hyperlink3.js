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
exports.SvgHyperlink3 = void 0;
const React = __importStar(require("react"));
const SvgHyperlink3 = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{
        color: 'inherit',
        ...props.style,
    }}>
    <path d="M10.458 18.374 7.721 21.11a2.853 2.853 0 0 1-3.942 0l-.892-.891a2.787 2.787 0 0 1 0-3.941l5.8-5.8a2.789 2.789 0 0 1 3.942 0l.893.892a1 1 0 0 0 1.418-1.418l-.893-.892a4.791 4.791 0 0 0-6.771 0l-5.8 5.8a4.787 4.787 0 0 0 0 6.77l.892.891a4.785 4.785 0 0 0 6.771 0l2.736-2.735a1 1 0 1 0-1.414-1.415Z" fill="currentColor"/>
    <path d="m22.526 2.363-.892-.892a4.8 4.8 0 0 0-6.77 0l-2.905 2.9a1 1 0 0 0 1.414 1.414l2.9-2.9a2.79 2.79 0 0 1 3.941 0l.893.893a2.786 2.786 0 0 1 0 3.942l-5.8 5.8a2.769 2.769 0 0 1-1.971.817 2.766 2.766 0 0 1-1.969-.816 1 1 0 1 0-1.415 1.412 4.751 4.751 0 0 0 3.384 1.4 4.752 4.752 0 0 0 3.385-1.4l5.8-5.8a4.786 4.786 0 0 0 0-6.771Z" fill="currentColor"/>
  </svg>);
exports.SvgHyperlink3 = SvgHyperlink3;
