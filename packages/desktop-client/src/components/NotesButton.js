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
exports.NotesButton = NotesButton;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v2_1 = require("@actual-app/components/icons/v2");
var popover_1 = require("@actual-app/components/popover");
var theme_1 = require("@actual-app/components/theme");
var tooltip_1 = require("@actual-app/components/tooltip");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var fetch_1 = require("loot-core/platform/client/fetch");
var Notes_1 = require("./Notes");
var useNotes_1 = require("@desktop-client/hooks/useNotes");
function NotesButton(_a) {
    var id = _a.id, _b = _a.width, width = _b === void 0 ? 12 : _b, _c = _a.height, height = _c === void 0 ? 12 : _c, _d = _a.defaultColor, defaultColor = _d === void 0 ? theme_1.theme.buttonNormalText : _d, _e = _a.tooltipPosition, tooltipPosition = _e === void 0 ? 'bottom start' : _e, _f = _a.showPlaceholder, showPlaceholder = _f === void 0 ? false : _f, style = _a.style;
    var t = (0, react_i18next_1.useTranslation)().t;
    var triggerRef = (0, react_1.useRef)(null);
    var _g = (0, react_1.useState)(false), isOpen = _g[0], setIsOpen = _g[1];
    var note = (0, useNotes_1.useNotes)(id) || '';
    var hasNotes = note && note !== '';
    var _h = (0, react_1.useState)(note), tempNotes = _h[0], setTempNotes = _h[1];
    (0, react_1.useEffect)(function () { return setTempNotes(note); }, [note, id]);
    var onOpenChange = (0, react_1.useCallback)(function (isOpen) {
        if (!isOpen) {
            if (tempNotes !== note) {
                void (0, fetch_1.send)('notes-save', { id: id, note: tempNotes });
            }
            setIsOpen(false);
        }
    }, [id, note, tempNotes]);
    return (<tooltip_1.Tooltip content={<Notes_1.Notes notes={note}/>} placement={tooltipPosition} triggerProps={{
            isDisabled: !hasNotes || isOpen,
        }}>
      <view_1.View style={{ flexShrink: 0 }}>
        <button_1.Button ref={triggerRef} variant="bare" aria-label={t('View notes')} className={(0, css_1.cx)((0, css_1.css)(__assign(__assign(__assign(__assign({ color: defaultColor }, style), (showPlaceholder && {
            opacity: hasNotes || isOpen ? 1 : 0.3,
        })), (isOpen && { color: theme_1.theme.buttonNormalText })), { '&:hover': { opacity: 1 } })), !hasNotes && !isOpen && !showPlaceholder ? 'hover-visible' : '')} data-placeholder={showPlaceholder} onPress={function () {
            setIsOpen(true);
        }}>
          <v2_1.SvgCustomNotesPaper style={{ width: width, height: height, flexShrink: 0 }}/>
        </button_1.Button>
      </view_1.View>

      <popover_1.Popover triggerRef={triggerRef} isOpen={isOpen} onOpenChange={onOpenChange} placement={tooltipPosition} style={{ padding: 4 }}>
        <Notes_1.Notes notes={tempNotes} editable focused onChange={setTempNotes}/>
      </popover_1.Popover>
    </tooltip_1.Tooltip>);
}
