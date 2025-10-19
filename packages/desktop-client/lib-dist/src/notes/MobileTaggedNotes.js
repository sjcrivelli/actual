import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Text } from '@actual-app/components/text';
import { useTagCSS } from '@desktop-client/hooks/useTagCSS';
export function MobileTaggedNotes({ content, tag, separator, }) {
    const getTagCSS = useTagCSS();
    return (_jsxs(_Fragment, { children: [_jsx(Text, { className: getTagCSS(tag, { compact: true }), children: content }), separator] }));
}
