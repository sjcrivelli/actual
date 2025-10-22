"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SheetNameProvider = SheetNameProvider;
exports.useSheetName = useSheetName;
// @ts-strict-ignore
var react_1 = require("react");
function unresolveName(name) {
    var idx = name.indexOf('!');
    if (idx !== -1) {
        return {
            sheet: name.slice(0, idx),
            name: name.slice(idx + 1),
        };
    }
    return { sheet: null, name: name };
}
var SheetNameContext = (0, react_1.createContext)(undefined);
function SheetNameProvider(_a) {
    var children = _a.children, name = _a.name;
    return (<SheetNameContext.Provider value={name}>
      {children}
    </SheetNameContext.Provider>);
}
function useSheetName(binding) {
    if (!binding) {
        throw new Error('Sheet binding is required');
    }
    var isStringBinding = typeof binding === 'string';
    var bindingName = isStringBinding ? binding : binding.name;
    if (global.IS_TESTING && !isStringBinding && !bindingName) {
        bindingName = binding.value.toString();
    }
    if (bindingName == null) {
        throw new Error('Binding name is now required');
    }
    // Get the current sheet name, and unresolve the binding name if
    // necessary (you might pass a fully resolved name like foo!name)
    var sheetName = (0, react_1.useContext)(SheetNameContext) || '__global';
    var unresolved = unresolveName(bindingName);
    if (unresolved.sheet) {
        sheetName = unresolved.sheet;
        bindingName = unresolved.name;
    }
    return {
        sheetName: sheetName,
        bindingName: bindingName,
        fullSheetName: "".concat(sheetName, "!").concat(bindingName),
    };
}
