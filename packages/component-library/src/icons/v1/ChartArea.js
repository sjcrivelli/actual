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
exports.SvgChartArea = void 0;
const React = __importStar(require("react"));
const SvgChartArea = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style={{
        color: 'inherit',
        ...props.style,
    }}>
    <path d="M 2.5 13 C 2 13.5 2 13.5 2 14 V 15 C 2 16 2 16 3 16 L 17 16 C 18 16 18 16 18 15 V 8.5 C 18 8 18 8 17.5 7.5 L 16 6 C 15.5 5.6 15.5 5.6 15 6 L 11 10 C 10.5 10.25 10.5 10.25 10 10 L 8 9 C 7.5 8.7 7.5 8.7 7 9 z M 0 5 c 0 -1.1 0.9 -2 2 -2 h 16 a 2 2 0 0 1 2 2 v 12 a 2 2 0 0 1 -2 2 H 2 a 2 2 0 0 1 -2 -2 V 4 z" fill="currentColor"/>
  </svg>);
exports.SvgChartArea = SvgChartArea;
