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
exports.SvgExpandArrow = void 0;
const React = __importStar(require("react"));
const SvgExpandArrow = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 15" style={{
        color: 'inherit',
        ...props.style,
    }}>
    <path fill="currentColor" d="M24.483.576c-.309-.327-.674-.49-1.097-.49H1.56C1.137.086.771.25.463.576A1.635 1.635 0 0 0 0 1.737c0 .448.154.834.463 1.161l10.913 11.558c.31.327.675.49 1.097.49.422 0 .788-.163 1.096-.49L24.483 2.898c.308-.327.463-.713.463-1.16 0-.448-.155-.835-.463-1.162Z"/>
  </svg>);
exports.SvgExpandArrow = SvgExpandArrow;
