import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { SvgDotsHorizontalTriple } from '@actual-app/components/icons/v1';
import { Menu } from '@actual-app/components/menu';
import { Popover } from '@actual-app/components/popover';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { NON_DRAGGABLE_AREA_CLASS_NAME } from './constants';
import { useContextMenu } from '@desktop-client/hooks/useContextMenu';
import { useIsInViewport } from '@desktop-client/hooks/useIsInViewport';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
export function ReportCard({ isEditing, disableClick, to, menuItems, onMenuSelect, children, size = 1, style, }) {
    const ref = useRef(null);
    const isInViewport = useIsInViewport(ref);
    const navigate = useNavigate();
    const { isNarrowWidth } = useResponsive();
    const containerProps = {
        flex: isNarrowWidth ? '1 1' : `0 0 calc(${size * 100}% / 3 - 20px)`,
    };
    const layoutProps = {
        isEditing,
        menuItems,
        onMenuSelect,
    };
    const content = (_jsx(View, { ref: ref, style: {
            backgroundColor: theme.tableBackground,
            borderBottomLeftRadius: 2,
            borderBottomRightRadius: 2,
            width: '100%',
            height: '100%',
            boxShadow: '0 2px 6px rgba(0, 0, 0, .15)',
            transition: 'box-shadow .25s',
            ...(isEditing
                ? {
                    '& .recharts-surface:hover': {
                        cursor: 'move',
                        ':active': { cursor: 'grabbing' },
                    },
                    ':active': { cursor: 'grabbing' },
                    filter: 'grayscale(1)',
                }
                : {
                    '& .recharts-surface:hover': {
                        cursor: 'pointer',
                    },
                }),
            ':hover': {
                ...(to ? { boxShadow: '0 4px 6px rgba(0, 0, 0, .15)' } : null),
                ...(isEditing ? { cursor: 'move', filter: 'grayscale(0)' } : null),
            },
            ...(to ? null : containerProps),
            ...style,
        }, children: isInViewport ? children : null }));
    if (to) {
        return (_jsx(Layout, { ...layoutProps, children: _jsx(View, { role: "button", onClick: isEditing || disableClick ? undefined : () => navigate(to), style: {
                    height: '100%',
                    width: '100%',
                    ':hover': {
                        cursor: 'pointer',
                    },
                }, children: content }) }));
    }
    return _jsx(Layout, { ...layoutProps, children: content });
}
function Layout({ children, isEditing, menuItems, onMenuSelect }) {
    const { t } = useTranslation();
    const triggerRef = useRef(null);
    const viewRef = useRef(null);
    const { setMenuOpen, menuOpen, handleContextMenu, resetPosition, position, asContextMenu, } = useContextMenu();
    return (_jsxs(View, { ref: viewRef, onContextMenu: handleContextMenu, style: {
            display: 'block',
            height: '100%',
            '& .hover-visible': {
                opacity: 0,
                transition: 'opacity .25s',
            },
            '&:hover .hover-visible': {
                opacity: 1,
            },
        }, children: [menuItems && (_jsxs(_Fragment, { children: [isEditing && (_jsx(View, { className: [
                            menuOpen ? undefined : 'hover-visible',
                            NON_DRAGGABLE_AREA_CLASS_NAME,
                        ].join(' '), style: {
                            position: 'absolute',
                            top: 7,
                            right: 3,
                            zIndex: 1,
                        }, children: _jsx(Button, { ref: triggerRef, variant: "bare", "aria-label": t('Menu'), onPress: () => {
                                resetPosition();
                                setMenuOpen(true);
                            }, children: _jsx(SvgDotsHorizontalTriple, { width: 15, height: 15, style: { transform: 'rotateZ(90deg)' } }) }) })), _jsx(Popover, { triggerRef: asContextMenu ? viewRef : triggerRef, isOpen: Boolean(menuOpen), onOpenChange: () => setMenuOpen(false), isNonModal: true, placement: asContextMenu ? 'bottom start' : 'bottom end', ...position, children: _jsx(Menu, { className: NON_DRAGGABLE_AREA_CLASS_NAME, onMenuSelect: onMenuSelect, items: menuItems }) })] })), children] }));
}
