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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notifications = Notifications;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_spring_1 = require("react-spring");
var react_swipeable_1 = require("react-swipeable");
var button_1 = require("@actual-app/components/button");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var AnimatedLoading_1 = require("@actual-app/components/icons/AnimatedLoading");
var v0_1 = require("@actual-app/components/icons/v0");
var stack_1 = require("@actual-app/components/stack");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var Link_1 = require("./common/Link");
var Modal_1 = require("./common/Modal");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var redux_1 = require("@desktop-client/redux");
function compileMessage(message, actions, setLoading, onRemove) {
    var _this = this;
    return (<stack_1.Stack spacing={2}>
      {message.split(/\n\n/).map(function (paragraph, idx) {
            var parts = paragraph.split(/(\[[^\]]*\]\([^)]*\))/g);
            return (<text_1.Text key={idx} style={{ lineHeight: '1.4em' }}>
            {parts.map(function (part, idx) {
                    var match = part.match(/\[([^\]]*)\]\(([^)]*)\)/);
                    if (match) {
                        var _1 = match[0], text = match[1], href = match[2];
                        if (href[0] === '#') {
                            var actionName_1 = href.slice(1);
                            return (<Link_1.Link variant="text" key={idx} onClick={function (e) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                e.preventDefault();
                                                if (!actions[actionName_1]) return [3 /*break*/, 2];
                                                setLoading(true);
                                                return [4 /*yield*/, actions[actionName_1]()];
                                            case 1:
                                                _a.sent();
                                                onRemove();
                                                _a.label = 2;
                                            case 2: return [2 /*return*/];
                                        }
                                    });
                                }); }}>
                      {text}
                    </Link_1.Link>);
                        }
                        return (<Link_1.Link variant="external" linkColor="purple" key={idx} to={match[2]}>
                    {match[1]}
                  </Link_1.Link>);
                    }
                    return <text_1.Text key={idx}>{part}</text_1.Text>;
                })}
          </text_1.Text>);
        })}
    </stack_1.Stack>);
}
function Notification(_a) {
    var _this = this;
    var notification = _a.notification, onRemove = _a.onRemove;
    var t = (0, react_i18next_1.useTranslation)().t;
    var type = notification.type, title = notification.title, message = notification.message, pre = notification.pre, messageActions = notification.messageActions, sticky = notification.sticky, internal = notification.internal, button = notification.button, timeout = notification.timeout;
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(false), overlayLoading = _c[0], setOverlayLoading = _c[1];
    (0, react_1.useEffect)(function () {
        if (type === 'error' && internal) {
            console.error('Internal error:', internal);
        }
        if (!sticky) {
            setTimeout(onRemove, timeout || 6500);
        }
    }, []);
    var positive = type === 'message';
    var error = type === 'error';
    var processedMessage = (0, react_1.useMemo)(function () { return compileMessage(message, messageActions, setOverlayLoading, onRemove); }, [message, messageActions]);
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var narrowStyle = isNarrowWidth
        ? { minHeight: styles_1.styles.mobileMinHeight }
        : {};
    var _d = (0, react_1.useState)(false), isSwiped = _d[0], setIsSwiped = _d[1];
    var _e = (0, react_spring_1.useSpring)(function () { return ({ x: 0, opacity: 1 }); }), spring = _e[0], api = _e[1];
    var swipeHandlers = (0, react_swipeable_1.useSwipeable)({
        onSwiping: function (_a) {
            var deltaX = _a.deltaX;
            if (!isSwiped) {
                api.start({ x: deltaX });
            }
        },
        onSwiped: function (_a) {
            var velocity = _a.velocity, deltaX = _a.deltaX;
            // Distance to trigger deletion
            var threshold = 100;
            var direction = deltaX > 0 ? 1 : -1;
            if (Math.abs(deltaX) > threshold || velocity > 0.5) {
                // Animate out & remove item after animation
                api.start({
                    x: direction * 1000,
                    opacity: 0,
                    onRest: onRemove,
                });
                setIsSwiped(true);
            }
            else {
                // Reset position if not swiped far enough
                api.start({ x: 0 });
            }
        },
        trackMouse: true,
    });
    return (<react_spring_1.animated.div role="alert" style={__assign(__assign({}, spring), { marginTop: 10, color: positive
                ? theme_1.theme.noticeText
                : error
                    ? theme_1.theme.errorTextDark
                    : theme_1.theme.warningTextDark, 
            // Prevents scrolling conflicts
            touchAction: 'none' })} {...swipeHandlers}>
      <stack_1.Stack align="center" justify="space-between" direction="row" style={__assign(__assign(__assign(__assign({ padding: '14px 14px' }, styles_1.styles.mediumText), { backgroundColor: positive
                ? theme_1.theme.noticeBackgroundLight
                : error
                    ? theme_1.theme.errorBackground
                    : theme_1.theme.warningBackground, borderTop: "3px solid ".concat(positive
                ? theme_1.theme.noticeBorder
                : error
                    ? theme_1.theme.errorBorder
                    : theme_1.theme.warningBorder) }), styles_1.styles.shadowLarge), { maxWidth: 550, '& a': { color: 'currentColor' } })}>
        <stack_1.Stack align="flex-start">
          {title && (<view_1.View style={__assign(__assign({}, styles_1.styles.mediumText), { fontWeight: 700, marginBottom: 10 })}>
              {title}
            </view_1.View>)}
          <view_1.View>{processedMessage}</view_1.View>
          {pre
            ? pre.split('\n\n').map(function (text, idx) { return (<view_1.View key={idx} style={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    fontSize: 12,
                    backgroundColor: 'rgba(0, 0, 0, .05)',
                    padding: 10,
                    borderRadius: 4,
                }}>
                  {text}
                </view_1.View>); })
            : null}
          {button && (<button_1.ButtonWithLoading variant="bare" isLoading={loading} onPress={function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setLoading(true);
                            return [4 /*yield*/, button.action()];
                        case 1:
                            _a.sent();
                            onRemove();
                            setLoading(false);
                            return [2 /*return*/];
                    }
                });
            }); }} className={(0, css_1.css)(__assign(__assign(__assign({ backgroundColor: 'transparent', border: "1px solid ".concat(positive
                    ? theme_1.theme.noticeBorder
                    : error
                        ? theme_1.theme.errorBorder
                        : theme_1.theme.warningBorder), color: 'currentColor' }, styles_1.styles.mediumText), { flexShrink: 0, '&[data-hovered], &[data-pressed]': {
                    backgroundColor: positive
                        ? theme_1.theme.noticeBackground
                        : error
                            ? theme_1.theme.errorBackground
                            : theme_1.theme.warningBackground,
                } }), narrowStyle))}>
              {button.title}
            </button_1.ButtonWithLoading>)}
        </stack_1.Stack>
        <button_1.Button variant="bare" aria-label={t('Close')} style={{ padding: 10, color: 'currentColor' }} onPress={onRemove}>
          <v0_1.SvgDelete style={{ width: 10, height: 10 }}/>
        </button_1.Button>
      </stack_1.Stack>
      {overlayLoading && (<view_1.View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: theme_1.theme.tableBackground,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
          <AnimatedLoading_1.AnimatedLoading style={{ width: 20, height: 20, color: 'currentColor' }}/>
        </view_1.View>)}
    </react_spring_1.animated.div>);
}
function Notifications(_a) {
    var style = _a.style;
    var dispatch = (0, redux_1.useDispatch)();
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var notifications = (0, redux_1.useSelector)(function (state) { return state.notifications.notifications; });
    var notificationInset = (0, redux_1.useSelector)(function (state) { return state.notifications.inset; });
    return (<view_1.View style={__assign({ position: 'fixed', bottom: (notificationInset === null || notificationInset === void 0 ? void 0 : notificationInset.bottom) || 20, top: notificationInset === null || notificationInset === void 0 ? void 0 : notificationInset.top, right: (notificationInset === null || notificationInset === void 0 ? void 0 : notificationInset.right) || 13, left: (notificationInset === null || notificationInset === void 0 ? void 0 : notificationInset.left) || (isNarrowWidth ? 13 : undefined), zIndex: Modal_1.MODAL_Z_INDEX - 1 }, style)}>
      {notifications.map(function (note) { return (<Notification key={note.id} notification={note} onRemove={function () {
                if (note.onClose) {
                    note.onClose();
                }
                dispatch((0, notificationsSlice_1.removeNotification)({ id: note.id }));
            }}/>); })}
    </view_1.View>);
}
