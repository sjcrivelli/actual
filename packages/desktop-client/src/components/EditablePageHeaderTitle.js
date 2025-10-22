"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditablePageHeaderTitle = EditablePageHeaderTitle;
var react_1 = require("react");
var button_1 = require("@actual-app/components/button");
var v2_1 = require("@actual-app/components/icons/v2");
var initial_focus_1 = require("@actual-app/components/initial-focus");
var input_1 = require("@actual-app/components/input");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
function EditablePageHeaderTitle(_a) {
    var initialTitle = _a.title, onSave = _a.onSave;
    var _b = (0, react_1.useState)(false), isEditing = _b[0], setIsEditing = _b[1];
    var _c = (0, react_1.useState)(initialTitle), title = _c[0], setTitle = _c[1];
    (0, react_1.useEffect)(function () { return setTitle(initialTitle); }, [initialTitle]);
    var onSaveValue = (0, react_1.useCallback)(function (newValue) {
        onSave(newValue);
        setTitle(newValue);
        setIsEditing(false);
    }, [onSave]);
    if (isEditing) {
        return (<initial_focus_1.InitialFocus>
        <input_1.Input defaultValue={title} onEnter={onSaveValue} onUpdate={onSaveValue} onEscape={function () { return setIsEditing(false); }} style={{
                fontSize: 25,
                fontWeight: 500,
                marginTop: -3,
                marginBottom: -3,
                marginLeft: -6,
                paddingTop: 2,
                paddingBottom: 2,
                width: Math.max(20, title.length) + 'ch',
            }}/>
      </initial_focus_1.InitialFocus>);
    }
    return (<view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 3,
            '& .hover-visible': {
                opacity: 0,
                transition: 'opacity .25s',
            },
            '&:hover .hover-visible': {
                opacity: 1,
            },
        }}>
      {title}

      <button_1.Button variant="bare" className="hover-visible" onPress={function () { return setIsEditing(true); }}>
        <v2_1.SvgPencil1 style={{
            width: 11,
            height: 11,
            color: theme_1.theme.pageTextSubdued,
        }}/>
      </button_1.Button>
    </view_1.View>);
}
