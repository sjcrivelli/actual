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
exports.TagEditor = void 0;
var button_1 = require("@actual-app/components/button");
var color_picker_1 = require("@actual-app/components/color-picker");
var useTagCSS_1 = require("@desktop-client/hooks/useTagCSS");
var redux_1 = require("@desktop-client/redux");
var tagsSlice_1 = require("@desktop-client/tags/tagsSlice");
var TagEditor = function (_a) {
    var _b;
    var tag = _a.tag, ref = _a.ref;
    var dispatch = (0, redux_1.useDispatch)();
    var getTagCSS = (0, useTagCSS_1.useTagCSS)();
    var formattedTag = <>#{tag.tag}</>;
    return (<color_picker_1.ColorPicker value={(_b = tag.color) !== null && _b !== void 0 ? _b : undefined} onChange={function (color) {
            dispatch((0, tagsSlice_1.updateTag)(__assign(__assign({}, tag), { color: color.toString('hex') })));
        }}>
      <button_1.Button variant="bare" className={getTagCSS(tag.tag)} ref={ref}>
        {formattedTag}
      </button_1.Button>
    </color_picker_1.ColorPicker>);
};
exports.TagEditor = TagEditor;
