"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-strict-ignore
const path_1 = __importDefault(require("path"));
function indexTemplate(filePaths) {
    const exportEntries = filePaths.map(({ path: filePath }) => {
        const basename = path_1.default.basename(filePath, path_1.default.extname(filePath));
        const exportName = `Svg${basename}`;
        return `export { ${exportName} } from './${basename}'`;
    });
    return exportEntries.join('\n');
}
module.exports = indexTemplate;
