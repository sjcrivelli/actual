import { useRef, useState, type MouseEvent, type TouchEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useSpring, animated, config } from 'react-spring';

import { Button } from '@actual-app/components/button';
import {
  SvgBookmark,
  SvgTrash,
  SvgEditPencil,
} from '@actual-app/components/icons/v1';
import { SpaceBetween } from '@actual-app/components/space-between';
import { theme } from '@actual-app/components/theme';

import { type PayeeEntity } from 'loot-core/types/models';

import { PayeeRuleCountLabel } from '@desktop-client/components/payees/PayeeRuleCountLabel';

type PayeesListItemProps = {
  payee: PayeeEntity;
  ruleCount: number;
  onPress: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
};

export function PayeesListItem({
  payee,
  ruleCount,
  onPress,
  onDelete,
  onEdit,
}: PayeesListItemProps) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const currentDragOffset = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const springProps = useSpring({
    transform: `translateX(${dragOffset}px)`,
    config: config.wobbly,
  });

  const handleDragStart = (
    e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>,
  ) => {
    if (!onDelete && !onEdit) return;

    // Prevent default to avoid text selection
    e.preventDefault();

    // Get the initial X position from either mouse or touch event
    const startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const startOffset = dragOffset;
    let hasMoved = false;

    // Determine if this is a touch or mouse event
    const isTouch = 'touches' in e;
    const moveEvent = isTouch ? 'touchmove' : 'mousemove';
    const endEvent = isTouch ? 'touchend' : 'mouseup';

    const handleMove = (e: globalThis.MouseEvent | globalThis.TouchEvent) => {
      e.preventDefault();
      // Get current X position from either mouse or touch event
      const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const deltaX = currentX - startX;
      const newOffset = Math.min(0, Math.max(-160, startOffset + deltaX)); // Increased max for two buttons
      setDragOffset(newOffset);
      currentDragOffset.current = newOffset;
      setIsDragging(true);
      hasMoved = true;
    };

    const handleEnd = (e?: globalThis.MouseEvent | globalThis.TouchEvent) => {
      if (e) e.preventDefault();

      if (hasMoved) {
        // Use the current drag offset from the ref
        const currentOffset = currentDragOffset.current;

        // Keep the element offset if dragged far enough, otherwise snap back
        if (Math.abs(currentOffset) > 20) {
          // Keep the current offset to show the buttons
          setDragOffset(-160);
        } else {
          // Snap back if not dragged far enough
          setDragOffset(0);
        }
      }
      setIsDragging(false);
      document.removeEventListener(moveEvent, handleMove);
      document.removeEventListener(endEvent, handleEnd);
    };

    // Add event listeners with passive: false to allow preventDefault
    document.addEventListener(moveEvent, handleMove, { passive: false });
    document.addEventListener(endEvent, handleEnd, { passive: false });
  };

  return (
    <div
      style={{
        minHeight: 56,
        width: '100%',
        borderRadius: 0,
        borderWidth: '0 0 1px 0',
        borderColor: theme.tableBorder,
        borderStyle: 'solid',
        backgroundColor: theme.tableBackground,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Unified animated block with content and action buttons */}
      <animated.div
        ref={ref}
        style={{
          ...springProps,
          cursor:
            onDelete || onEdit ? (isDragging ? 'grabbing' : 'grab') : 'default',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
        }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        {/* Main content */}
        <div
          style={{
            minHeight: 56,
            width: '100%',
            borderRadius: 0,
            borderWidth: 0,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '12px 16px',
            gap: 5,
            pointerEvents: isDragging ? 'none' : 'auto',
            flexShrink: 0,
          }}
          onClick={e => {
            // If buttons are visible, close them instead of triggering onPress
            if (Math.abs(dragOffset) > 0) {
              e.preventDefault();
              setDragOffset(0);
            } else {
              onPress();
            }
          }}
        >
          {payee.favorite && (
            <SvgBookmark
              width={15}
              height={15}
              style={{
                color: theme.pageText,
                flexShrink: 0,
              }}
            />
          )}
          <SpaceBetween
            style={{
              justifyContent: 'space-between',
              flex: 1,
              alignItems: 'flex-start',
            }}
          >
            <span
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: payee.transfer_acct
                  ? theme.pageTextSubdued
                  : theme.pageText,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
                textAlign: 'left',
              }}
              title={payee.name}
            >
              {(payee.transfer_acct ? t('Transfer: ') : '') + payee.name}
            </span>

            <span
              style={{
                borderRadius: 4,
                padding: '3px 6px',
                backgroundColor: theme.noticeBackground,
                border: '1px solid ' + theme.noticeBackground,
                color: theme.noticeTextDark,
                fontSize: 12,
                flexShrink: 0,
              }}
            >
              <PayeeRuleCountLabel count={ruleCount} style={{ fontSize: 12 }} />
            </span>
          </SpaceBetween>
        </div>

        {/* Action buttons */}
        {(onDelete || onEdit) && (
          <div
            style={{
              height: '100%',
              width: 160,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              flexShrink: 0,
            }}
          >
            {/* Edit button */}
            {onEdit && (
              <Button
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  height: '100%',
                  width: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 0,
                }}
                onPress={() => {
                  console.log('Edit payee:', payee.name);
                  onEdit();
                }}
              >
                <SvgEditPencil width={16} height={16} />
              </Button>
            )}

            {/* Delete button */}
            {onDelete && (
              <Button
                style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  height: '100%',
                  width: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 0,
                }}
                onPress={onDelete}
              >
                <SvgTrash width={16} height={16} />
              </Button>
            )}
          </div>
        )}
      </animated.div>
    </div>
  );
}
