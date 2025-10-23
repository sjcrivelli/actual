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
exports.SvgFilter2 = void 0;
const React = __importStar(require("react"));
const SvgFilter2 = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{
        color: 'inherit',
        ...props.style,
    }}>
    <path d="M23.894.552A1 1 0 0 0 23 0H1a1 1 0 0 0-.8 1.6L9 13.423V22a2.015 2.015 0 0 0 2 2 1.993 1.993 0 0 0 1.2-.4l2-1.5a2.007 2.007 0 0 0 .8-1.6v-7.077L23.8 1.6a1 1 0 0 0 .094-1.048ZM5.417 2.2l3.939 5.25a.5.5 0 0 1 .1.3V9a.5.5 0 0 1-.9.3L3.62 2.8a.5.5 0 0 1 .4-.8h1a.5.5 0 0 1 .397.2Z" fill="currentColor"/>
  </svg>);
exports.SvgFilter2 = SvgFilter2;
