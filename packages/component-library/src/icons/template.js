var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
// @ts-strict-ignore
var tmpl = function (_a, _b) {
    var imports = _a.imports, interfaces = _a.interfaces, componentName = _a.componentName, props = _a.props, jsx = _a.jsx;
    var tpl = _b.tpl;
    return tpl(__makeTemplateObject(["\n", ";\n\n", ";\n\nexport const ", " = (", ") => (\n  ", "\n);\n"], ["\n", ";\n\n", ";\n\nexport const ", " = (", ") => (\n  ", "\n);\n"]), imports, interfaces, componentName, props, jsx);
};
module.exports = tmpl;
