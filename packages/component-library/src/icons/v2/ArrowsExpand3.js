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
exports.SvgArrowsExpand3 = void 0;
const React = __importStar(require("react"));
const SvgArrowsExpand3 = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{
        color: 'inherit',
        ...props.style,
    }}>
    <path fill="currentColor" d="M19.611 2.571h-3.754a1.286 1.286 0 1 1 0-2.571h6.857A1.286 1.286 0 0 1 24 1.286v6.857a1.286 1.286 0 0 1-2.571 0V4.39L15.48 10.34a1.286 1.286 0 0 1-1.817-1.817l5.948-5.95ZM1.286 14.571a1.286 1.286 0 0 1 1.285 1.286v3.754l5.949-5.946a1.286 1.286 0 0 1 1.817 1.817L4.39 21.429h3.753a1.285 1.285 0 1 1 0 2.571H1.286A1.286 1.286 0 0 1 0 22.714v-6.857a1.286 1.286 0 0 1 1.286-1.286Z"/>
  </svg>);
exports.SvgArrowsExpand3 = SvgArrowsExpand3;
