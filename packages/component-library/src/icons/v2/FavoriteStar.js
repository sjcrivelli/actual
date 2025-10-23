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
exports.SvgFavoriteStar = void 0;
const React = __importStar(require("react"));
const SvgFavoriteStar = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{
        color: 'inherit',
        ...props.style,
    }}>
    <path fill="currentColor" d="M23.91 9.113a1.785 1.785 0 0 0-1.453-1.227l-6.132-.926-2.714-5.506a1.863 1.863 0 0 0-3.222 0l-2.78 5.552-6.066.88a1.798 1.798 0 0 0-1 3.068l4.428 4.361-1.028 6.055a1.797 1.797 0 0 0 2.607 1.895l5.488-2.865 5.429 2.858a1.797 1.797 0 0 0 2.607-1.895l-1.011-6.128 4.394-4.286a1.786 1.786 0 0 0 .454-1.836Z"/>
  </svg>);
exports.SvgFavoriteStar = SvgFavoriteStar;
