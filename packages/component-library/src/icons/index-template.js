"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-strict-ignore
var path_1 = require("path");
function indexTemplate(filePaths) {
    var exportEntries = filePaths.map(function (_a) {
        var filePath = _a.path;
        var basename = path_1.default.basename(filePath, path_1.default.extname(filePath));
        var exportName = "Svg".concat(basename);
        return "export { ".concat(exportName, " } from './").concat(basename, "'");
    });
    return exportEntries.join('\n');
}
module.exports = indexTemplate;
