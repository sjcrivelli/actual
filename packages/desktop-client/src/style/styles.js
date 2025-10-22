"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasHiddenScrollbars = void 0;
// @ts-strict-ignore
var styles_1 = require("@actual-app/components/styles");
var Platform = require("loot-core/shared/platform");
var hiddenScrollbars = false;
// need both styles defined for primary and secondary colors
// e.g. transaction table and sidebar
// lightScrollbar => primary
// darkScrollbar => secondary
function onScrollbarChange() {
    styles_1.styles.horizontalScrollbar = !hiddenScrollbars && {
        '::-webkit-scrollbar': {
            backgroundColor: 'inherit',
            height: 12,
        },
        '::-webkit-scrollbar-thumb': {
            width: 7,
            borderRadius: 30,
            backgroundClip: 'padding-box',
            border: '2px solid rgba(0, 0, 0, 0)',
            backgroundColor: '#d0d0d0',
        },
    };
    styles_1.styles.lightScrollbar = !hiddenScrollbars && {
        '& ::-webkit-scrollbar': {
            width: 11,
            backgroundColor: 'rgba(200, 200, 200, .2)',
        },
        '& ::-webkit-scrollbar-thumb': {
            width: 7,
            borderRadius: 30,
            backgroundClip: 'padding-box',
            border: '2px solid rgba(0, 0, 0, 0)',
        },
        '& ::-webkit-scrollbar-thumb:vertical': {
            backgroundColor: '#d0d0d0',
        },
    };
    styles_1.styles.darkScrollbar = !hiddenScrollbars && {
        '& ::-webkit-scrollbar': {
            width: 11,
            backgroundColor: 'rgba(0, 0, 0, 0)',
        },
        '& ::-webkit-scrollbar-thumb:vertical': {
            width: 7,
            borderRadius: 30,
            backgroundClip: 'padding-box',
            backgroundColor: 'rgba(200, 200, 200, .5)',
        },
    };
    styles_1.styles.scrollbarWidth = hiddenScrollbars ? 0 : 13;
}
if (Platform.env === 'web') {
    function testScrollbars() {
        var el = document.createElement('div');
        el.innerHTML =
            '<div style="width:100px;height:100px;overflow:scroll;position:absolute;top:-9999px;"/>';
        document.body.appendChild(el);
        var testNode = el.childNodes[0];
        if (testNode.offsetWidth === testNode.clientWidth) {
            return true;
        }
        return false;
    }
    hiddenScrollbars = testScrollbars();
    onScrollbarChange();
    window.addEventListener('focus', function () {
        hiddenScrollbars = testScrollbars();
        onScrollbarChange();
    });
}
var hasHiddenScrollbars = function () { return hiddenScrollbars; };
exports.hasHiddenScrollbars = hasHiddenScrollbars;
