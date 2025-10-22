"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleActiveEditFormProvider = SingleActiveEditFormProvider;
exports.useSingleActiveEditForm = useSingleActiveEditForm;
// @ts-strict-ignore
var react_1 = require("react");
var SingleActiveEditFormContext = (0, react_1.createContext)(undefined);
function SingleActiveEditFormProvider(_a) {
    var formName = _a.formName, children = _a.children;
    var _b = (0, react_1.useState)(null), editingField = _b[0], setEditingField = _b[1];
    var cleanupRef = (0, react_1.useRef)(null);
    var runCleanup = function () {
        var editCleanup = cleanupRef.current;
        if (typeof editCleanup === 'function') {
            editCleanup === null || editCleanup === void 0 ? void 0 : editCleanup();
        }
        cleanupRef.current = null;
    };
    var runAction = function (action) {
        cleanupRef.current = action === null || action === void 0 ? void 0 : action();
    };
    var onClearActiveEdit = function (delayMs) {
        setTimeout(function () {
            runCleanup();
            setEditingField(null);
        }, delayMs);
    };
    var onActiveEdit = function (field, action) {
        runAction(action);
        setEditingField(field);
    };
    var onRequestActiveEdit = function (field, action, options) {
        if (editingField === field) {
            // Already active.
            return;
        }
        if (editingField) {
            onClearActiveEdit(options === null || options === void 0 ? void 0 : options.clearActiveEditDelayMs);
        }
        else {
            onActiveEdit(field, action);
        }
    };
    return (<SingleActiveEditFormContext.Provider value={{
            formName: formName,
            editingField: editingField,
            onRequestActiveEdit: onRequestActiveEdit,
            onClearActiveEdit: onClearActiveEdit,
        }}>
      {children}
    </SingleActiveEditFormContext.Provider>);
}
function useSingleActiveEditForm() {
    var context = (0, react_1.useContext)(SingleActiveEditFormContext);
    if (!context) {
        return null;
    }
    return {
        formName: context.formName,
        editingField: context.editingField,
        onRequestActiveEdit: context.onRequestActiveEdit,
        onClearActiveEdit: context.onClearActiveEdit,
    };
}
