"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useModalState = useModalState;
var react_1 = require("react");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
function useModalState() {
    var modalStack = (0, redux_1.useSelector)(function (state) { return state.modals.modalStack; });
    var isHidden = (0, redux_1.useSelector)(function (state) { return state.modals.isHidden; });
    var dispatch = (0, redux_1.useDispatch)();
    var popModalCallback = (0, react_1.useCallback)(function () {
        dispatch((0, modalsSlice_1.popModal)());
    }, [dispatch]);
    var lastModal = modalStack[modalStack.length - 1];
    var isActive = (0, react_1.useCallback)(function (name) {
        if (!lastModal || name === lastModal.name) {
            return true;
        }
        return false;
    }, [lastModal]);
    return {
        onClose: popModalCallback,
        modalStack: modalStack,
        activeModal: lastModal === null || lastModal === void 0 ? void 0 : lastModal.name,
        isActive: isActive,
        isHidden: isHidden,
    };
}
