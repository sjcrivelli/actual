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
exports.LoadComponent = LoadComponent;
var react_1 = require("react");
var block_1 = require("@actual-app/components/block");
var AnimatedLoading_1 = require("@actual-app/components/icons/AnimatedLoading");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var promise_retry_1 = require("promise-retry");
var errors_1 = require("loot-core/shared/errors");
function LoadComponent(props) {
    // need to set `key` so the component is reloaded when the name changes
    // otherwise the old component will be rendered while the new one is being loaded
    return <LoadComponentInner key={props.name} {...props}/>;
}
function LoadComponentInner(_a) {
    var name = _a.name, message = _a.message, importer = _a.importer;
    var _b = (0, react_1.useState)(null), Component = _b[0], setComponent = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    (0, react_1.useEffect)(function () {
        var isUnmounted = false;
        setError(null);
        setComponent(null);
        // Load the module; if it fails - retry with exponential backoff
        (0, promise_retry_1.default)(function (retry) {
            return importer()
                .then(function (module) {
                // Handle possibly being unmounted while retrying.
                if (!isUnmounted) {
                    setComponent(function () { return module[name]; });
                }
            })
                .catch(retry);
        }, {
            retries: 5,
        }).catch(function (e) {
            if (!isUnmounted) {
                setError(e);
            }
        });
        return function () {
            isUnmounted = true;
        };
    }, [name, importer]);
    if (error) {
        throw new errors_1.LazyLoadFailedError(name, error);
    }
    if (!Component) {
        return (<view_1.View style={__assign({ flex: 1, gap: 20, justifyContent: 'center', alignItems: 'center' }, styles_1.styles.delayedFadeIn)}>
        {message && (<block_1.Block style={{ marginBottom: 20, fontSize: 18 }}>{message}</block_1.Block>)}
        <AnimatedLoading_1.AnimatedLoading width={25} color={theme_1.theme.pageTextDark}/>
      </view_1.View>);
    }
    return <Component />;
}
