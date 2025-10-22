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
exports.ReportCard = ReportCard;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var v1_1 = require("@actual-app/components/icons/v1");
var menu_1 = require("@actual-app/components/menu");
var popover_1 = require("@actual-app/components/popover");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var constants_1 = require("./constants");
var useContextMenu_1 = require("@desktop-client/hooks/useContextMenu");
var useIsInViewport_1 = require("@desktop-client/hooks/useIsInViewport");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
function ReportCard(_a) {
    var isEditing = _a.isEditing, disableClick = _a.disableClick, to = _a.to, menuItems = _a.menuItems, onMenuSelect = _a.onMenuSelect, children = _a.children, _b = _a.size, size = _b === void 0 ? 1 : _b, style = _a.style;
    var ref = (0, react_1.useRef)(null);
    var isInViewport = (0, useIsInViewport_1.useIsInViewport)(ref);
    var navigate = (0, useNavigate_1.useNavigate)();
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var containerProps = {
        flex: isNarrowWidth ? '1 1' : "0 0 calc(".concat(size * 100, "% / 3 - 20px)"),
    };
    var layoutProps = {
        isEditing: isEditing,
        menuItems: menuItems,
        onMenuSelect: onMenuSelect,
    };
    var content = (<view_1.View ref={ref} style={__assign(__assign(__assign(__assign({ backgroundColor: theme_1.theme.tableBackground, borderBottomLeftRadius: 2, borderBottomRightRadius: 2, width: '100%', height: '100%', boxShadow: '0 2px 6px rgba(0, 0, 0, .15)', transition: 'box-shadow .25s' }, (isEditing
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
            })), { ':hover': __assign(__assign({}, (to ? { boxShadow: '0 4px 6px rgba(0, 0, 0, .15)' } : null)), (isEditing ? { cursor: 'move', filter: 'grayscale(0)' } : null)) }), (to ? null : containerProps)), style)}>
      {/* we render the content only if it is in the viewport
        this reduces the amount of concurrent server api calls and thus
        has a better performance */}
      {isInViewport ? children : null}
    </view_1.View>);
    if (to) {
        return (<Layout {...layoutProps}>
        <view_1.View role="button" onClick={isEditing || disableClick ? undefined : function () { return navigate(to); }} style={{
                height: '100%',
                width: '100%',
                ':hover': {
                    cursor: 'pointer',
                },
            }}>
          {content}
        </view_1.View>
      </Layout>);
    }
    return <Layout {...layoutProps}>{content}</Layout>;
}
function Layout(_a) {
    var children = _a.children, isEditing = _a.isEditing, menuItems = _a.menuItems, onMenuSelect = _a.onMenuSelect;
    var t = (0, react_i18next_1.useTranslation)().t;
    var triggerRef = (0, react_1.useRef)(null);
    var viewRef = (0, react_1.useRef)(null);
    var _b = (0, useContextMenu_1.useContextMenu)(), setMenuOpen = _b.setMenuOpen, menuOpen = _b.menuOpen, handleContextMenu = _b.handleContextMenu, resetPosition = _b.resetPosition, position = _b.position, asContextMenu = _b.asContextMenu;
    return (<view_1.View ref={viewRef} onContextMenu={handleContextMenu} style={{
            display: 'block',
            height: '100%',
            '& .hover-visible': {
                opacity: 0,
                transition: 'opacity .25s',
            },
            '&:hover .hover-visible': {
                opacity: 1,
            },
        }}>
      {menuItems && (<>
          {isEditing && (<view_1.View className={[
                    menuOpen ? undefined : 'hover-visible',
                    constants_1.NON_DRAGGABLE_AREA_CLASS_NAME,
                ].join(' ')} style={{
                    position: 'absolute',
                    top: 7,
                    right: 3,
                    zIndex: 1,
                }}>
              <button_1.Button ref={triggerRef} variant="bare" aria-label={t('Menu')} onPress={function () {
                    resetPosition();
                    setMenuOpen(true);
                }}>
                <v1_1.SvgDotsHorizontalTriple width={15} height={15} style={{ transform: 'rotateZ(90deg)' }}/>
              </button_1.Button>
            </view_1.View>)}

          <popover_1.Popover triggerRef={asContextMenu ? viewRef : triggerRef} isOpen={Boolean(menuOpen)} onOpenChange={function () { return setMenuOpen(false); }} isNonModal placement={asContextMenu ? 'bottom start' : 'bottom end'} {...position}>
            <menu_1.Menu className={constants_1.NON_DRAGGABLE_AREA_CLASS_NAME} onMenuSelect={onMenuSelect} items={menuItems}/>
          </popover_1.Popover>
        </>)}

      {children}
    </view_1.View>);
}
