import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function PieProgress({ style, progress, color, backgroundColor, }) {
    const radius = 4;
    const circum = 2 * Math.PI * radius;
    const dash = progress * circum;
    const gap = circum;
    return (_jsxs("svg", { viewBox: "0 0 20 20", style: style, children: [_jsx("circle", { r: "10", cx: "10", cy: "10", fill: backgroundColor }), _jsx("circle", { r: radius, cx: "10", cy: "10", fill: "none", stroke: color, strokeWidth: radius * 2, strokeDasharray: `${dash} ${gap}`, transform: "rotate(-90) translate(-20)" }), ' '] }));
}
