import { jsx as _jsx } from "react/jsx-runtime";
// @ts-strict-ignore
import { createContext, useEffect, useRef, useLayoutEffect, useState, useContext, } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { useDragRef } from '@desktop-client/hooks/useDragRef';
import { useMergedRefs } from '@desktop-client/hooks/useMergedRefs';
export function useDraggable({ item, type, canDrag, onDragChange, }) {
    const _onDragChange = useRef(onDragChange);
    const [, dragRef] = useDrag({
        type,
        item: () => {
            _onDragChange.current({ state: 'start-preview', type, item });
            setTimeout(() => {
                _onDragChange.current({ state: 'start' });
            }, 0);
            return { type, item };
        },
        collect: monitor => ({ isDragging: monitor.isDragging() }),
        end(dragState) {
            _onDragChange.current({ state: 'end', type, item: dragState.item });
        },
        canDrag() {
            return canDrag;
        },
    });
    useLayoutEffect(() => {
        _onDragChange.current = onDragChange;
    });
    return { dragRef };
}
export function useDroppable({ types, id, onDrop, onLongHover, }) {
    const ref = useRef(null);
    const [dropPos, setDropPos] = useState(null);
    const [{ isOver }, dropRef] = useDrop({
        accept: types,
        drop({ item }) {
            onDrop(item.id, dropPos, id);
        },
        hover(_, monitor) {
            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            const pos = hoverClientY < hoverMiddleY ? 'top' : 'bottom';
            setDropPos(pos);
        },
        collect(monitor) {
            return { isOver: monitor.isOver() };
        },
    });
    const handleDropRef = useDragRef(dropRef);
    useEffect(() => {
        let timeout;
        if (onLongHover && isOver) {
            timeout = setTimeout(onLongHover, 700);
        }
        return () => timeout && clearTimeout(timeout);
    }, [isOver]);
    return {
        dropRef: useMergedRefs(handleDropRef, ref),
        dropPos: isOver ? dropPos : null,
    };
}
export const DropHighlightPosContext = createContext(null);
export function DropHighlight({ pos, offset }) {
    const itemPos = useContext(DropHighlightPosContext);
    if (pos == null) {
        return null;
    }
    const topOffset = (itemPos === 'first' ? 2 : 0) + (offset?.top || 0);
    const bottomOffset = (itemPos === 'last' ? 2 : 0) + (offset?.bottom || 0);
    const posStyle = pos === 'top' ? { top: -2 + topOffset } : { bottom: -1 + bottomOffset };
    return (_jsx(View, { style: {
            position: 'absolute',
            left: 2,
            right: 2,
            borderRadius: 3,
            height: 3,
            background: theme.pageTextLink,
            zIndex: 10000,
            pointerEvents: 'none',
            ...posStyle,
        } }));
}
