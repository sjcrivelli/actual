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
exports.DropHighlightPosContext = void 0;
exports.useDraggable = useDraggable;
exports.useDroppable = useDroppable;
exports.DropHighlight = DropHighlight;
// @ts-strict-ignore
var react_1 = require("react");
var react_dnd_1 = require("react-dnd");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var useDragRef_1 = require("@desktop-client/hooks/useDragRef");
var useMergedRefs_1 = require("@desktop-client/hooks/useMergedRefs");
function useDraggable(_a) {
    var item = _a.item, type = _a.type, canDrag = _a.canDrag, onDragChange = _a.onDragChange;
    var _onDragChange = (0, react_1.useRef)(onDragChange);
    var _b = (0, react_dnd_1.useDrag)({
        type: type,
        item: function () {
            _onDragChange.current({ state: 'start-preview', type: type, item: item });
            setTimeout(function () {
                _onDragChange.current({ state: 'start' });
            }, 0);
            return { type: type, item: item };
        },
        collect: function (monitor) { return ({ isDragging: monitor.isDragging() }); },
        end: function (dragState) {
            _onDragChange.current({ state: 'end', type: type, item: dragState.item });
        },
        canDrag: function () {
            return canDrag;
        },
    }), dragRef = _b[1];
    (0, react_1.useLayoutEffect)(function () {
        _onDragChange.current = onDragChange;
    });
    return { dragRef: dragRef };
}
function useDroppable(_a) {
    var types = _a.types, id = _a.id, onDrop = _a.onDrop, onLongHover = _a.onLongHover;
    var ref = (0, react_1.useRef)(null);
    var _b = (0, react_1.useState)(null), dropPos = _b[0], setDropPos = _b[1];
    var _c = (0, react_dnd_1.useDrop)({
        accept: types,
        drop: function (_a) {
            var item = _a.item;
            onDrop(item.id, dropPos, id);
        },
        hover: function (_, monitor) {
            var hoverBoundingRect = ref.current.getBoundingClientRect();
            var hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            var clientOffset = monitor.getClientOffset();
            var hoverClientY = clientOffset.y - hoverBoundingRect.top;
            var pos = hoverClientY < hoverMiddleY ? 'top' : 'bottom';
            setDropPos(pos);
        },
        collect: function (monitor) {
            return { isOver: monitor.isOver() };
        },
    }), isOver = _c[0].isOver, dropRef = _c[1];
    var handleDropRef = (0, useDragRef_1.useDragRef)(dropRef);
    (0, react_1.useEffect)(function () {
        var timeout;
        if (onLongHover && isOver) {
            timeout = setTimeout(onLongHover, 700);
        }
        return function () { return timeout && clearTimeout(timeout); };
    }, [isOver]);
    return {
        dropRef: (0, useMergedRefs_1.useMergedRefs)(handleDropRef, ref),
        dropPos: isOver ? dropPos : null,
    };
}
exports.DropHighlightPosContext = (0, react_1.createContext)(null);
function DropHighlight(_a) {
    var pos = _a.pos, offset = _a.offset;
    var itemPos = (0, react_1.useContext)(exports.DropHighlightPosContext);
    if (pos == null) {
        return null;
    }
    var topOffset = (itemPos === 'first' ? 2 : 0) + ((offset === null || offset === void 0 ? void 0 : offset.top) || 0);
    var bottomOffset = (itemPos === 'last' ? 2 : 0) + ((offset === null || offset === void 0 ? void 0 : offset.bottom) || 0);
    var posStyle = pos === 'top' ? { top: -2 + topOffset } : { bottom: -1 + bottomOffset };
    return (<view_1.View style={__assign({ position: 'absolute', left: 2, right: 2, borderRadius: 3, height: 3, background: theme_1.theme.pageTextLink, zIndex: 10000, pointerEvents: 'none' }, posStyle)}/>);
}
