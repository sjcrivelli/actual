import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, } from 'react';
import { Button } from '@actual-app/components/button';
import { Input } from '@actual-app/components/input';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { Toggle } from '@actual-app/components/toggle';
import { css } from '@emotion/css';
export function FieldLabel({ title, flush, style }) {
    return (_jsx(Text, { style: {
            marginBottom: 5,
            marginTop: flush ? 0 : 25,
            fontSize: 14,
            color: theme.tableRowHeaderText,
            padding: `0 ${styles.mobileEditingPadding}px`,
            userSelect: 'none',
            ...style,
        }, children: title }));
}
const valueStyle = {
    borderWidth: 1,
    borderColor: theme.formInputBorder,
    marginLeft: 8,
    marginRight: 8,
    height: styles.mobileMinHeight,
};
export const InputField = forwardRef(({ disabled, style, onUpdate, ...props }, ref) => {
    return (_jsx(Input, { ref: ref, autoCorrect: "false", autoCapitalize: "none", disabled: disabled, onUpdate: onUpdate, style: {
            ...valueStyle,
            ...style,
            color: disabled ? theme.tableTextInactive : theme.tableText,
            backgroundColor: disabled
                ? theme.formInputTextReadOnlySelection
                : theme.tableBackground,
        }, ...props }));
});
InputField.displayName = 'InputField';
const defaultTapFieldStyle = ({ isDisabled, isPressed, isHovered }) => ({
    ...valueStyle,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.tableBackground,
    ...(isDisabled && {
        backgroundColor: theme.formInputTextReadOnlySelection,
    }),
    ...(isPressed
        ? {
            opacity: 0.5,
            boxShadow: 'none',
        }
        : {}),
    ...(isHovered
        ? {
            boxShadow: 'none',
        }
        : {}),
});
export const TapField = forwardRef(({ value, children, rightContent, style, textStyle, ...props }, ref) => {
    return (_jsxs(Button, { ref: ref, bounce: false, style: renderProps => ({
            ...defaultTapFieldStyle(renderProps),
            ...(typeof style === 'function' ? style(renderProps) : style),
        }), ...props, children: [children ? (children) : (_jsx(Text, { style: {
                    flex: 1,
                    userSelect: 'none',
                    textAlign: 'left',
                    ...textStyle,
                }, children: value })), !props.isDisabled && rightContent] }));
});
TapField.displayName = 'TapField';
export function ToggleField({ id, isOn, onToggle, style, className, isDisabled = false, }) {
    return (_jsx(Toggle, { id: id, isOn: isOn, isDisabled: isDisabled, onToggle: onToggle, style: style, className: String(css([
            {
                '& [data-toggle-container]': {
                    width: 50,
                    height: 24,
                },
                '& [data-toggle]': {
                    width: 20,
                    height: 20,
                },
            },
            className,
        ])) }));
}
