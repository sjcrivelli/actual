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
exports.SvgPiggyBank = void 0;
const React = __importStar(require("react"));
const SvgPiggyBank = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style={{
        color: 'inherit',
        ...props.style,
    }}>
    <g clipPath="url(#a)">
      <path fill="currentColor" d="M1.857 7.612H.98a.98.98 0 0 0-.98.98v2.224c0 .449.184.857.51 1.163.612.551 1.816 1.49 3.735 2.368a.571.571 0 0 1 .306.346l.939 3.286a.484.484 0 0 0 .469.347h1.47a.479.479 0 0 0 .469-.367l.47-1.817a.262.262 0 0 1 .326-.183c.571.122 1.183.163 1.795.163.613 0 1.225-.061 1.796-.163.143-.02.286.06.327.183l.47 1.817a.502.502 0 0 0 .468.367h1.47a.484.484 0 0 0 .47-.347l1.224-4.245a.487.487 0 0 1 .122-.224c.919-.98 1.53-2.163 1.735-3.47h.49c.53 0 .959-.448.938-.979-.02-.51-.47-.918-.98-.918h-.448C18.06 4.673 14.632 2 10.489 2c-1.775 0-3.428.49-4.755 1.326-.591-.408-1.469-.734-2.693-.632-.49.04-.715.612-.388.959.408.429.796 1 .877 1.735L1.857 7.612Zm3.122.98a.862.862 0 0 1-.857-.858c0-.469.388-.857.857-.857.47 0 .858.388.858.857 0 .47-.388.858-.858.858Z"/>
    </g>
    <defs>
      <clipPath id="a">
        <path fill="currentColor" d="M0 0h20v20H0z"/>
      </clipPath>
    </defs>
  </svg>);
exports.SvgPiggyBank = SvgPiggyBank;
