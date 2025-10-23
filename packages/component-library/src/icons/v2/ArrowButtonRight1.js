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
exports.SvgArrowButtonRight1 = void 0;
const React = __importStar(require("react"));
const SvgArrowButtonRight1 = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{
        color: 'inherit',
        ...props.style,
    }}>
    <path d="M13.584 12a2.643 2.643 0 0 1-.775 1.875l-9.541 9.541a1.768 1.768 0 0 1-2.5-2.5l8.739-8.739a.25.25 0 0 0 0-.354L.768 3.084a1.768 1.768 0 0 1 2.5-2.5l9.541 9.541A2.643 2.643 0 0 1 13.584 12Z" fill="currentColor"/>
    <path d="M23.75 12a2.643 2.643 0 0 1-.775 1.875l-9.541 9.541a1.768 1.768 0 0 1-2.5-2.5l8.739-8.739a.25.25 0 0 0 0-.354l-8.739-8.739a1.768 1.768 0 0 1 2.5-2.5l9.541 9.541A2.643 2.643 0 0 1 23.75 12Z" fill="currentColor"/>
  </svg>);
exports.SvgArrowButtonRight1 = SvgArrowButtonRight1;
