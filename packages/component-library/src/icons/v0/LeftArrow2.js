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
exports.SvgLeftArrow2 = void 0;
const React = __importStar(require("react"));
const SvgLeftArrow2 = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 91 51" style={{
        color: 'inherit',
        ...props.style,
    }}>
    <path fill="currentColor" d="M30.256 48.614a3.14 3.14 0 0 0-.989-2.153L10.803 29.063h76.915a3.2 3.2 0 0 0 .315 0c1.584-.084 2.95-1.64 2.867-3.266-.082-1.625-1.598-3.028-3.182-2.943H10.803L29.267 5.49c1.284-1.099 1.456-3.057.385-4.373a2.972 2.972 0 0 0-4.48-.187L.971 23.695a3.163 3.163 0 0 0 0 4.56l24.2 22.766a2.98 2.98 0 0 0 2.205.84c1.669-.08 2.958-1.534 2.88-3.247Z"/>
  </svg>);
exports.SvgLeftArrow2 = SvgLeftArrow2;
