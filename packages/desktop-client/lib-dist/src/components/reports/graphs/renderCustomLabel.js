import { jsx as _jsx } from "react/jsx-runtime";
import { theme } from '@actual-app/components/theme';
import { PrivacyFilter } from '@desktop-client/components/PrivacyFilter';
export const renderCustomLabel = (calcX, calcY, textAnchor, display, textSize, showLabel, showLabelThreshold, fill = theme.pageText) => {
    return !showLabel || Math.abs(showLabel) > showLabelThreshold ? (_jsx("text", { x: calcX, y: calcY, fill: fill, textAnchor: textAnchor, dominantBaseline: "middle", fontSize: textSize, children: _jsx(PrivacyFilter, { children: display }) }, fill + display)) : (_jsx("text", {}));
};
