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
exports.SvgDownloadThickBottom = void 0;
const React = __importStar(require("react"));
const SvgDownloadThickBottom = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{
        color: 'inherit',
        ...props.style,
    }}>
    <path d="M8.616 1.741A1.455 1.455 0 0 1 10.07.287h3.392a1.455 1.455 0 0 1 1.453 1.454v8.228a.25.25 0 0 0 .25.25h2.9a1.138 1.138 0 0 1 .827 2l-6.1 6.1a1.489 1.489 0 0 1-2.056 0l-6.1-6.1a1.137 1.137 0 0 1 .827-2h2.9a.249.249 0 0 0 .25-.25Z" fill="currentColor"/>
    <path d="M0 19.677a4.039 4.039 0 0 0 4.035 4.035h15.93A4.039 4.039 0 0 0 24 19.677V17.8a1.225 1.225 0 0 0-2.449 0v1.874a1.588 1.588 0 0 1-1.586 1.586H4.035a1.588 1.588 0 0 1-1.586-1.586V17.8A1.225 1.225 0 0 0 0 17.8Z" fill="currentColor"/>
  </svg>);
exports.SvgDownloadThickBottom = SvgDownloadThickBottom;
