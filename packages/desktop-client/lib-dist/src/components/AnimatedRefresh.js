import { jsx as _jsx } from "react/jsx-runtime";
import { SvgRefresh } from '@actual-app/components/icons/v1';
import { View } from '@actual-app/components/view';
import { keyframes } from '@emotion/css';
const spin = keyframes({
    '0%': { transform: 'rotateZ(0deg)' },
    '100%': { transform: 'rotateZ(360deg)' },
});
export function AnimatedRefresh({ animating, iconStyle, width, height, }) {
    return (_jsx(View, { style: { animation: animating ? `${spin} 1s infinite linear` : null }, children: _jsx(SvgRefresh, { width: width ? width : 14, height: height ? height : 14, style: iconStyle }) }));
}
