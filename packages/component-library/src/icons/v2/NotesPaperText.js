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
exports.SvgNotesPaperText = void 0;
const React = __importStar(require("react"));
const SvgNotesPaperText = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{
        color: 'inherit',
        ...props.style,
    }}>
    <path d="m18.707 9.207 1-1a1 1 0 1 0-1.414-1.414l-1 1a1 1 0 0 1-1.415 0 3.072 3.072 0 0 0-4.242 0 1 1 0 0 1-1.414 0 3.073 3.073 0 0 0-4.243 0l-1 1a1 1 0 0 0 1.415 1.414l1-1a1.024 1.024 0 0 1 1.414 0 3 3 0 0 0 4.242 0 1.024 1.024 0 0 1 1.414 0 3 3 0 0 0 4.243 0ZM11.636 13.793a1 1 0 0 1-1.414 0 3.073 3.073 0 0 0-4.243 0l-1 1a1 1 0 0 0 1.415 1.414l1-1a1.024 1.024 0 0 1 1.414 0 3 3 0 0 0 4.242 0 1 1 0 0 0-1.414-1.414Z" fill="currentColor"/>
    <path d="M24 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h14a1 1 0 0 0 .707-.293l7-7A1 1 0 0 0 24 16ZM2 2.5a.5.5 0 0 1 .5-.5h19a.5.5 0 0 1 .5.5V15a.5.5 0 0 1-.5.5h-4a2 2 0 0 0-2 2v4a.5.5 0 0 1-.5.5H2.5a.5.5 0 0 1-.5-.5Z" fill="currentColor"/>
  </svg>);
exports.SvgNotesPaperText = SvgNotesPaperText;
