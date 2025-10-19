import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@actual-app/components/button';
import { View } from '@actual-app/components/view';
import { useTagCSS } from '@desktop-client/hooks/useTagCSS';
export function DesktopTaggedNotes({ content, onPress, tag, separator, }) {
    const getTagCSS = useTagCSS();
    return (_jsxs(View, { style: { display: 'inline' }, children: [_jsx(Button, { variant: "bare", className: getTagCSS(tag), onPress: () => {
                    onPress?.(content);
                }, children: content }), separator] }));
}
