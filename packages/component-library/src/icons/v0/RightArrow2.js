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
exports.SvgRightArrow2 = void 0;
const React = __importStar(require("react"));
const SvgRightArrow2 = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 91 51" style={{
        color: 'inherit',
        ...props.style,
    }}>
    <path fill="currentColor" d="M63.004.003a3 3 0 0 0-1.875 5.219L79.44 22.034H3.16a3.257 3.257 0 0 0-.313 0c-1.57.082-2.925 1.585-2.843 3.156.081 1.571 1.585 2.926 3.156 2.844H79.44L61.129 44.815a3 3 0 1 0 4.062 4.407l24-22a3 3 0 0 0 0-4.407l-24-22a3 3 0 0 0-2.187-.812Z"/>
  </svg>);
exports.SvgRightArrow2 = SvgRightArrow2;
