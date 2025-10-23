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
exports.SvgLoading = void 0;
const react_1 = __importStar(require("react"));
const SvgLoading = (props) => {
    const { color = 'currentColor' } = props;
    const [gradientId] = (0, react_1.useState)('gradient-' + Math.random());
    return (<svg {...props} viewBox="0 0 38 38" style={{ ...props.style }}>
      <defs>
        <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id={gradientId}>
          <stop stopColor={color} stopOpacity={0} offset="0%"/>
          <stop stopColor={color} stopOpacity={0.631} offset="63.146%"/>
          <stop stopColor={color} offset="100%"/>
        </linearGradient>
      </defs>
      <g transform="translate(1 2)" fill="none" fillRule="evenodd">
        <path d="M36 18c0-9.94-8.06-18-18-18" stroke={'url(#' + gradientId + ')'} strokeWidth={2} fill="none"/>
        <circle fill={color} cx={36} cy={18} r={1}/>
      </g>
    </svg>);
};
exports.SvgLoading = SvgLoading;
