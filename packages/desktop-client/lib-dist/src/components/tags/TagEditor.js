import { Fragment as _Fragment, jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Button } from '@actual-app/components/button';
import { ColorPicker } from '@actual-app/components/color-picker';
import { useTagCSS } from '@desktop-client/hooks/useTagCSS';
import { useDispatch } from '@desktop-client/redux';
import { updateTag } from '@desktop-client/tags/tagsSlice';
export const TagEditor = ({ tag, ref }) => {
    const dispatch = useDispatch();
    const getTagCSS = useTagCSS();
    const formattedTag = _jsxs(_Fragment, { children: ["#", tag.tag] });
    return (_jsx(ColorPicker, { value: tag.color ?? undefined, onChange: color => {
            dispatch(updateTag({ ...tag, color: color.toString('hex') }));
        }, children: _jsx(Button, { variant: "bare", className: getTagCSS(tag.tag), ref: ref, children: formattedTag }) }));
};
