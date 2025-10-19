import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgRemove, SvgSearchAlternate } from '@actual-app/components/icons/v2';
import { baseInputStyle, Input } from '@actual-app/components/input';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { css } from '@emotion/css';
export function Search({ inputRef, value, onChange, placeholder, isInModal = false, width = 250, height, style, }) {
    const { t } = useTranslation();
    const [focused, setFocused] = useState(false);
    const clearButtonPadding = ((height ?? 24) - 8) / 2;
    return (_jsxs(View, { style: {
            ...baseInputStyle,
            padding: 0,
            flexDirection: 'row',
            alignItems: 'center',
            width,
            height,
            flex: '',
            borderColor: isInModal ? undefined : 'transparent',
            backgroundColor: isInModal ? undefined : theme.formInputBackground,
            ...style,
            ...(focused && {
                boxShadow: '0 0 0 1px ' + theme.formInputShadowSelected,
                ...(isInModal
                    ? {}
                    : { backgroundColor: theme.formInputBackgroundSelected }),
            }),
        }, children: [_jsx(SvgSearchAlternate, { style: {
                    width: 13,
                    height: 13,
                    flexShrink: 0,
                    color: value ? theme.menuItemTextSelected : 'inherit',
                    margin: 5,
                    marginRight: 0,
                } }), _jsx(Input, { ref: inputRef, value: value, placeholder: placeholder, onEscape: () => onChange(''), onChangeValue: onChange, className: css({
                    width: '100%',
                    '::placeholder': {
                        color: theme.formInputTextPlaceholder,
                        transition: 'color .25s',
                    },
                    '&[data-focused]': isInModal
                        ? {}
                        : {
                            '::placeholder': {
                                color: theme.formInputTextPlaceholderSelected,
                            },
                        },
                    flex: 1,
                    '&, &[data-focused], &[data-hovered]': {
                        border: 0,
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        color: 'inherit',
                    },
                }), onFocus: () => {
                    setFocused(true);
                }, onBlur: () => {
                    setFocused(false);
                } }), value && (_jsx(View, { title: t('Clear search term'), children: _jsx(Button, { variant: "bare", style: {
                        padding: `${clearButtonPadding}px 8px ${clearButtonPadding}px ${clearButtonPadding}px`,
                    }, onPress: () => onChange(''), children: _jsx(SvgRemove, { style: { width: 8, height: 8 } }) }) }))] }));
}
