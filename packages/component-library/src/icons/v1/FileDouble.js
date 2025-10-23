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
exports.SvgFileDouble = void 0;
const React = __importStar(require("react"));
const SvgFileDouble = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{
        color: 'inherit',
        ...props.style,
    }}>
    <path d="M21.941 3.607 18.87.554A1.912 1.912 0 0 0 17.527 0H8.9A1.9 1.9 0 0 0 7 1.9V5H3.4a1.9 1.9 0 0 0-1.9 1.9v15.21A1.9 1.9 0 0 0 3.4 24h11.7a1.9 1.9 0 0 0 1.9-1.895V19h3.6a1.9 1.9 0 0 0 1.9-1.895V4.949a1.882 1.882 0 0 0-.559-1.342ZM14.5 22H4a.5.5 0 0 1-.5-.5v-14A.5.5 0 0 1 4 7h7.784a.5.5 0 0 1 .35.143L14.85 9.8a.5.5 0 0 1 .15.357V21.5a.5.5 0 0 1-.5.5Zm5.5-5h-2.75a.25.25 0 0 1-.25-.25v-6.8a1.892 1.892 0 0 0-.558-1.341L13.37 5.554A1.9 1.9 0 0 0 12.028 5H9.25A.25.25 0 0 1 9 4.75V2.5a.5.5 0 0 1 .5-.5l7.756-.026a.5.5 0 0 1 .351.143L20.35 4.8a.5.5 0 0 1 .15.357V16.5a.5.5 0 0 1-.5.5Z" fill="currentColor"/>
  </svg>);
exports.SvgFileDouble = SvgFileDouble;
