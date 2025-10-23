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
exports.SvgArrowsSynchronize = void 0;
const React = __importStar(require("react"));
const SvgArrowsSynchronize = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{
        color: 'inherit',
        ...props.style,
    }}>
    <g fill="#000">
      <path d="m23.962 17.457-.82-3.297a1.287 1.287 0 0 0-1.56-.934l-3.294.823a1.286 1.286 0 0 0-.343 2.35L19 17.03A9.538 9.538 0 0 1 12 20.604a8.652 8.652 0 0 1-8.085-5.667 1.286 1.286 0 0 0-2.415.884A11.232 11.232 0 0 0 12 23.175a12.108 12.108 0 0 0 9.214-4.8l.839.503a1.286 1.286 0 0 0 1.91-1.415ZM2.422 10.774l3.295-.823a1.286 1.286 0 0 0 .352-2.35l-.972-.583A9.588 9.588 0 0 1 12 3.396a8.652 8.652 0 0 1 8.085 5.667A1.286 1.286 0 0 0 22.5 8.18 11.232 11.232 0 0 0 12 .825 12.242 12.242 0 0 0 2.866 5.68l-.919-.552a1.286 1.286 0 0 0-1.91 1.414l.82 3.297a1.287 1.287 0 0 0 1.246.974 1.311 1.311 0 0 0 .32-.04Z" fill="currentColor"/>
    </g>
  </svg>);
exports.SvgArrowsSynchronize = SvgArrowsSynchronize;
