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
exports.SvgCloudUpload = void 0;
const React = __importStar(require("react"));
const SvgCloudUpload = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{
        color: 'inherit',
        ...props.style,
    }}>
    <path d="M24 10.413a5.817 5.817 0 0 0-1.772-4.167 5.711 5.711 0 0 0-3.447-1.585.249.249 0 0 1-.191-.12 7.684 7.684 0 0 0-14.1 2.294.251.251 0 0 1-.227.2A4.59 4.59 0 0 0 0 11.609a4.324 4.324 0 0 0 1.236 3.21A5.519 5.519 0 0 0 4.841 16.2a1 1 0 0 0-.03-2 3.288 3.288 0 0 1-2.172-.8A2.374 2.374 0 0 1 2 11.609 2.576 2.576 0 0 1 2.954 9.6a2.6 2.6 0 0 1 2.167-.527 1 1 0 0 0 1.2-.919 5.686 5.686 0 0 1 10.82-2.088.962.962 0 0 0 .941.57 3.7 3.7 0 0 1 2.758 1.051A3.752 3.752 0 0 1 22 10.413a3.835 3.835 0 0 1-3.438 3.787 1 1 0 0 0 .132 1.992.961.961 0 0 0 .131-.009A5.807 5.807 0 0 0 24 10.413Z" fill="currentColor"/>
    <path d="M12.707 8.989a1 1 0 0 0-1.414 0l-3.5 3.5A1 1 0 0 0 8.5 14.2h1.75a.249.249 0 0 1 .25.25v7.25a1.5 1.5 0 0 0 3 0v-7.25a.249.249 0 0 1 .25-.25h1.75a1 1 0 0 0 .707-1.707Z" fill="currentColor"/>
  </svg>);
exports.SvgCloudUpload = SvgCloudUpload;
