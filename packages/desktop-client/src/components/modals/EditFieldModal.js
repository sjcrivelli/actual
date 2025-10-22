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
exports.EditFieldModal = EditFieldModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var input_1 = require("@actual-app/components/input");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var date_fns_1 = require("date-fns");
var months_1 = require("loot-core/shared/months");
var util_1 = require("loot-core/shared/util");
var Modal_1 = require("@desktop-client/components/common/Modal");
var forms_1 = require("@desktop-client/components/forms");
var DateSelect_1 = require("@desktop-client/components/select/DateSelect");
var useDateFormat_1 = require("@desktop-client/hooks/useDateFormat");
var itemStyle = {
    fontSize: 17,
    fontWeight: 400,
    paddingTop: 8,
    paddingBottom: 8,
};
function EditFieldModal(_a) {
    var name = _a.name, onSubmit = _a.onSubmit, onClose = _a.onClose;
    var t = (0, react_i18next_1.useTranslation)().t;
    var dateFormat = (0, useDateFormat_1.useDateFormat)() || 'MM/dd/yyyy';
    var noteInputRef = (0, react_1.useRef)(null);
    function onSelectNote(value, mode) {
        if (value != null) {
            onSubmit(name, value, mode);
        }
    }
    function onSelect(value) {
        if (value != null) {
            // Process the value if needed
            if (name === 'amount') {
                if (typeof value === 'string') {
                    var parsed = (0, util_1.currencyToInteger)(value);
                    if (parsed === null) {
                        alert(t('Invalid amount value'));
                        return;
                    }
                    value = parsed;
                }
                else if (typeof value === 'number') {
                    value = (0, util_1.amountToInteger)(value);
                }
            }
            onSubmit(name, value);
        }
    }
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var label;
    var editor;
    var minWidth;
    var inputStyle = __assign({}, (isNarrowWidth && itemStyle));
    var _b = (0, react_1.useState)('replace'), noteAmend = _b[0], onChangeMode = _b[1];
    switch (name) {
        case 'date':
            var today_1 = (0, months_1.currentDay)();
            label = t('Date');
            minWidth = 350;
            editor = function (_a) {
                var close = _a.close;
                return (<DateSelect_1.DateSelect value={(0, date_fns_1.format)((0, date_fns_1.parseISO)(today_1), dateFormat)} dateFormat={dateFormat} embedded={true} onUpdate={function () { }} onSelect={function (date) {
                        onSelect((0, months_1.dayFromDate)((0, date_fns_1.parse)(date, 'yyyy-MM-dd', new Date())));
                        close();
                    }}/>);
            };
            break;
        case 'notes':
            label = t('Notes');
            editor = function (_a) {
                var close = _a.close;
                return (<>
          <view_1.View style={{
                        flexDirection: 'row',
                        marginTop: 5,
                        marginBottom: 5,
                        marginLeft: 8,
                        marginRight: 4,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
            <button_1.Button style={__assign(__assign({ padding: '5px 10px', width: '33.33%', backgroundColor: theme_1.theme.menuBackground, marginRight: 5, fontSize: 'inherit' }, (noteAmend === 'prepend' && {
                        backgroundColor: theme_1.theme.buttonPrimaryBackground,
                        color: theme_1.theme.buttonPrimaryText,
                        ':hover': {
                            backgroundColor: theme_1.theme.buttonPrimaryBackgroundHover,
                            color: theme_1.theme.buttonPrimaryTextHover,
                        },
                    })), (noteAmend !== 'prepend' && {
                        backgroundColor: theme_1.theme.buttonNormalBackground,
                        color: theme_1.theme.buttonNormalText,
                        ':hover': {
                            backgroundColor: theme_1.theme.buttonNormalBackgroundHover,
                            color: theme_1.theme.buttonNormalTextHover,
                        },
                    }))} onPress={function () {
                        var _a;
                        onChangeMode('prepend');
                        (_a = noteInputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
                    }}>
              <react_i18next_1.Trans>Prepend</react_i18next_1.Trans>
            </button_1.Button>
            <button_1.Button style={__assign(__assign({ padding: '5px 10px', width: '33.34%', backgroundColor: theme_1.theme.menuBackground, marginRight: 5, fontSize: 'inherit' }, (noteAmend === 'replace' && {
                        backgroundColor: theme_1.theme.buttonPrimaryBackground,
                        color: theme_1.theme.buttonPrimaryText,
                        ':hover': {
                            backgroundColor: theme_1.theme.buttonPrimaryBackgroundHover,
                            color: theme_1.theme.buttonPrimaryTextHover,
                        },
                    })), (noteAmend !== 'replace' && {
                        backgroundColor: theme_1.theme.buttonNormalBackground,
                        color: theme_1.theme.buttonNormalText,
                        ':hover': {
                            backgroundColor: theme_1.theme.buttonNormalBackgroundHover,
                            color: theme_1.theme.buttonNormalTextHover,
                        },
                    }))} onPress={function () {
                        var _a;
                        onChangeMode('replace');
                        (_a = noteInputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
                    }}>
              <react_i18next_1.Trans>Replace</react_i18next_1.Trans>
            </button_1.Button>
            <button_1.Button style={__assign(__assign({ padding: '5px 10px', width: '33.33%', backgroundColor: theme_1.theme.menuBackground, marginRight: 5, fontSize: 'inherit' }, (noteAmend === 'append' && {
                        backgroundColor: theme_1.theme.buttonPrimaryBackground,
                        color: theme_1.theme.buttonPrimaryText,
                        ':hover': {
                            backgroundColor: theme_1.theme.buttonPrimaryBackgroundHover,
                            color: theme_1.theme.buttonPrimaryTextHover,
                        },
                    })), (noteAmend !== 'append' && {
                        backgroundColor: theme_1.theme.buttonNormalBackground,
                        color: theme_1.theme.buttonNormalText,
                        ':hover': {
                            backgroundColor: theme_1.theme.buttonNormalBackgroundHover,
                            color: theme_1.theme.buttonNormalTextHover,
                        },
                    }))} onPress={function () {
                        var _a;
                        onChangeMode('append');
                        (_a = noteInputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
                    }}>
              <react_i18next_1.Trans>Append</react_i18next_1.Trans>
            </button_1.Button>
          </view_1.View>
          <input_1.Input ref={noteInputRef} autoFocus onEnter={function (value) {
                        onSelectNote(value, noteAmend);
                        close();
                    }} style={inputStyle}/>
        </>);
            };
            break;
        case 'amount':
            label = t('Amount');
            editor = function (_a) {
                var close = _a.close;
                return (<input_1.Input onEnter={function (value) {
                        onSelect(value);
                        close();
                    }} style={inputStyle}/>);
            };
            break;
        default:
    }
    return (<Modal_1.Modal name="edit-field" noAnimation={!isNarrowWidth} onClose={onClose} containerProps={{
            style: __assign(__assign({ height: isNarrowWidth
                    ? 'calc(var(--visual-viewport-height) * 0.85)'
                    : 275, padding: '15px 10px' }, (minWidth && { minWidth: minWidth })), { backgroundColor: theme_1.theme.menuAutoCompleteBackground }),
        }}>
      {function (_a) {
            var close = _a.state.close;
            return (<>
          {isNarrowWidth && (<Modal_1.ModalHeader title={label} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>)}
          <view_1.View>
            {!isNarrowWidth && (<forms_1.SectionLabel title={label} style={{
                        alignSelf: 'center',
                        color: theme_1.theme.menuAutoCompleteText,
                        marginBottom: 10,
                    }}/>)}
            <view_1.View style={{ flex: 1 }}>{editor({ close: close })}</view_1.View>
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
