import { jsx as _jsx } from "react/jsx-runtime";
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { css } from '@emotion/css';
export const SectionLabel = ({ title, style }) => {
    return (_jsx(View, { style: {
            fontWeight: 500,
            textTransform: 'uppercase',
            color: theme.formLabelText,
            marginBottom: 5,
            lineHeight: '1em',
            ...style,
        }, children: title }));
};
const defaultLabelStyle = {
    fontSize: 13,
    marginBottom: 3,
    color: theme.tableText,
};
export const FormLabel = ({ style, title, id, htmlFor }) => {
    return (_jsx(Text, { style: {
            ...defaultLabelStyle,
            ...style,
        }, children: _jsx("label", { htmlFor: htmlFor, id: id, children: title }) }));
};
export const FormTextLabel = ({ style, title, id, }) => {
    return (_jsx(Text, { style: {
            ...defaultLabelStyle,
            cursor: 'default',
            ...style,
        }, children: _jsx("span", { id: id, children: title }) }));
};
export const FormField = ({ style, children }) => {
    return _jsx(View, { style: style, children: children });
};
export const Checkbox = (props) => {
    return (_jsx("input", { type: "checkbox", ...props, className: css([
            {
                position: 'relative',
                margin: 0,
                flexShrink: 0,
                marginRight: 6,
                width: 15,
                height: 15,
                appearance: 'none',
                outline: 0,
                border: '1px solid ' + theme.formInputBorder,
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.checkboxText,
                backgroundColor: theme.tableBackground,
                ':checked': {
                    border: '1px solid ' + theme.checkboxBorderSelected,
                    backgroundColor: theme.checkboxBackgroundSelected,
                    '::after': {
                        display: 'block',
                        background: theme.checkboxBackgroundSelected +
                            // eslint-disable-next-line actual/typography
                            ' url(\'data:image/svg+xml; utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="white" d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>\') 9px 9px',
                        width: 9,
                        height: 9,
                        // eslint-disable-next-line actual/typography
                        content: '" "',
                    },
                },
                ':disabled': {
                    border: '1px solid ' + theme.buttonNormalDisabledBorder,
                    backgroundColor: theme.buttonNormalDisabledBorder,
                },
                ':checked:disabled': {
                    border: '1px solid ' + theme.buttonNormalDisabledBorder,
                    backgroundColor: theme.buttonNormalDisabledBorder,
                    '::after': {
                        backgroundColor: theme.buttonNormalDisabledBorder,
                    },
                },
                '&:focus-visible': {
                    '::before': {
                        position: 'absolute',
                        top: -5,
                        bottom: -5,
                        left: -5,
                        right: -5,
                        border: '2px solid ' + theme.checkboxBorderSelected,
                        borderRadius: 6,
                        // eslint-disable-next-line actual/typography
                        content: '" "',
                    },
                },
            },
            props.style,
        ]) }));
};
