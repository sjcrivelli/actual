import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-strict-ignore
import { Children, } from 'react';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { View } from '@actual-app/components/view';
import { css } from '@emotion/css';
import { usePrivacyMode } from '@desktop-client/hooks/usePrivacyMode';
export function ConditionalPrivacyFilter({ children, privacyFilter, defaultPrivacyFilterProps, }) {
    const renderPrivacyFilter = (children, mergedProps) => (_jsx(PrivacyFilter, { ...mergedProps, children: children }));
    return privacyFilter ? (typeof privacyFilter === 'boolean' ? (_jsx(PrivacyFilter, { ...defaultPrivacyFilterProps, children: children })) : (renderPrivacyFilter(children, mergeConditionalPrivacyFilterProps(defaultPrivacyFilterProps, privacyFilter)))) : (_jsx(_Fragment, { children: Children.toArray(children) }));
}
export function PrivacyFilter({ activationFilters, children, ...props }) {
    const privacyMode = usePrivacyMode();
    // Limit mobile support for now.
    const { isNarrowWidth } = useResponsive();
    const activate = privacyMode &&
        !isNarrowWidth &&
        (!activationFilters ||
            activationFilters.every(value => typeof value === 'boolean' ? value : value()));
    return !activate ? (_jsx(_Fragment, { children: Children.toArray(children) })) : (_jsx(PrivacyOverlay, { ...props, children: children }));
}
function PrivacyOverlay({ children, ...props }) {
    const { style, ...restProps } = props;
    return (_jsxs(View, { className: css([
            {
                display: 'inline-flex',
                flexGrow: 1,
                position: 'relative',
                ' > div:first-child': {
                    opacity: 0,
                },
                ' > div:nth-child(2)': {
                    display: 'flex',
                },
                '&:hover': {
                    ' > div:first-child': {
                        opacity: 1,
                    },
                    ' > div:nth-child(2)': {
                        display: 'none',
                    },
                },
            },
        ], style), ...restProps, children: [_jsx("div", { className: css([
                    {
                        display: 'flex',
                        flexGrow: 1,
                    },
                ]), children: children }), _jsx("div", { "aria-hidden": "true", className: css({
                    flexDirection: 'column',
                    fontFamily: 'Redacted Script',
                    height: '100%',
                    inset: 0,
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    position: 'absolute',
                    width: '100%',
                }), children: children })] }));
}
export function mergeConditionalPrivacyFilterProps(defaultPrivacyFilterProps = {}, privacyFilter) {
    if (privacyFilter == null || privacyFilter === false) {
        return privacyFilter;
    }
    if (privacyFilter === true) {
        return defaultPrivacyFilterProps;
    }
    return merge(defaultPrivacyFilterProps, privacyFilter);
}
function merge(initialValue, ...objects) {
    return objects.reduce((prev, current) => {
        Object.keys(current).forEach(key => {
            const pValue = prev[key];
            const cValue = current[key];
            if (Array.isArray(pValue) && Array.isArray(cValue)) {
                prev[key] = pValue.concat(...cValue);
            }
            else if (isObject(pValue) && isObject(cValue)) {
                prev[key] = merge(pValue, cValue);
            }
            else {
                prev[key] = cValue;
            }
        });
        return prev;
    }, initialValue);
}
function isObject(obj) {
    return obj && typeof obj === 'object';
}
