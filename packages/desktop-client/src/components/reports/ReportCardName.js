"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportCardName = void 0;
var react_1 = require("react");
var block_1 = require("@actual-app/components/block");
var initial_focus_1 = require("@actual-app/components/initial-focus");
var input_1 = require("@actual-app/components/input");
var styles_1 = require("@actual-app/components/styles");
var constants_1 = require("./constants");
var ReportCardName = function (_a) {
    var name = _a.name, isEditing = _a.isEditing, onChange = _a.onChange, onClose = _a.onClose;
    if (isEditing) {
        return (<initial_focus_1.InitialFocus>
        <input_1.Input className={constants_1.NON_DRAGGABLE_AREA_CLASS_NAME} defaultValue={name} onEnter={onChange} onUpdate={onChange} onEscape={onClose} style={__assign(__assign({}, styles_1.styles.mediumText), { marginTop: -6, marginBottom: -1, marginLeft: -6, width: Math.max(20, name.length) + 'ch' })}/>
      </initial_focus_1.InitialFocus>);
    }
    return (<block_1.Block style={__assign(__assign({}, styles_1.styles.mediumText), { marginBottom: 5 })} role="heading">
      {name}
    </block_1.Block>);
};
exports.ReportCardName = ReportCardName;
