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
exports.SvgPencilWriteAlternate = void 0;
const React = __importStar(require("react"));
const SvgPencilWriteAlternate = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{
        color: 'inherit',
        ...props.style,
    }}>
    <path d="M20 11.491a1 1 0 0 0-1 1v8.5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-17a1 1 0 0 1 1-1h10a1 1 0 0 0 0-2H3a3 3 0 0 0-3 3v17a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-8.5a1 1 0 0 0-1-1Z" fill="currentColor"/>
    <path d="M18.818 3.051a.516.516 0 0 0-.707 0L10.3 10.865a.5.5 0 0 0-.111.168l-1.416 3.535a.5.5 0 0 0 .111.539.519.519 0 0 0 .539.11l3.535-1.417a.5.5 0 0 0 .168-.111L20.94 5.88a.5.5 0 0 0 0-.707ZM23.415.577a2.047 2.047 0 0 0-2.828 0l-1.061 1.06a.5.5 0 0 0 0 .707l2.12 2.121a.5.5 0 0 0 .707 0l1.061-1.06a2 2 0 0 0 0-2.828Z" fill="currentColor"/>
  </svg>);
exports.SvgPencilWriteAlternate = SvgPencilWriteAlternate;
