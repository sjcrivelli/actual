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
exports.useUndo = useUndo;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var redux_1 = require("@desktop-client/redux");
var undo_1 = require("@desktop-client/undo");
var timeout = 10000;
function useUndo() {
    var dispatch = (0, redux_1.useDispatch)();
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var t = (0, react_i18next_1.useTranslation)().t;
    var showUndoNotification = (0, react_1.useCallback)(function (notification) {
        if (!isNarrowWidth) {
            return;
        }
        dispatch((0, notificationsSlice_1.addNotification)({
            notification: __assign({ type: 'message', timeout: timeout, button: {
                    title: t('Undo'),
                    action: undo_1.undo,
                } }, notification),
        }));
    }, [dispatch, isNarrowWidth, t]);
    var showRedoNotification = (0, react_1.useCallback)(function (notification) {
        if (!isNarrowWidth) {
            return;
        }
        dispatch((0, notificationsSlice_1.addNotification)({
            notification: __assign({ type: 'message', timeout: timeout, button: {
                    title: t('Redo'),
                    action: undo_1.redo,
                } }, notification),
        }));
    }, [dispatch, isNarrowWidth, t]);
    return {
        undo: undo_1.undo,
        redo: undo_1.redo,
        showUndoNotification: showUndoNotification,
        showRedoNotification: showRedoNotification,
    };
}
