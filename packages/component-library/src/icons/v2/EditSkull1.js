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
exports.SvgEditSkull1 = void 0;
const React = __importStar(require("react"));
const SvgEditSkull1 = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{
        color: 'inherit',
        ...props.style,
    }}>
    <path fill="currentColor" d="M12 0a10.286 10.286 0 0 0-6.243 18.45 1.714 1.714 0 0 1 .672 1.36v1.619A2.571 2.571 0 0 0 9 24a1.714 1.714 0 0 0 1.714-1.714V21a1.286 1.286 0 0 1 2.572 0v1.286A1.714 1.714 0 0 0 15 24a2.571 2.571 0 0 0 2.571-2.571V19.81a1.714 1.714 0 0 1 .672-1.36A10.286 10.286 0 0 0 12 0ZM7.714 12.429a2.143 2.143 0 1 1 2.143-2.143 2.143 2.143 0 0 1-2.143 2.143Zm8.572 0a2.143 2.143 0 1 1 2.143-2.143 2.143 2.143 0 0 1-2.143 2.143Z"/>
  </svg>);
exports.SvgEditSkull1 = SvgEditSkull1;
