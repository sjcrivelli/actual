import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useState, useEffect, } from 'react';
import { Input } from '@actual-app/components/input';
import { evalArithmetic } from 'loot-core/shared/arithmetic';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { useMergedRefs } from '@desktop-client/hooks/useMergedRefs';
const clampToPercent = (value) => Math.max(Math.min(value, 100), 0);
export function PercentInput({ id, inputRef, value: initialValue = 0, onFocus, onBlur, onChangeValue, onUpdatePercent, style, focused, disabled = false, }) {
    const format = useFormat();
    const [value, setValue] = useState(() => format(clampToPercent(initialValue), 'percentage'));
    useEffect(() => {
        const clampedInitialValue = clampToPercent(initialValue);
        if (clampedInitialValue !== initialValue) {
            setValue(format(clampedInitialValue, 'percentage'));
            onUpdatePercent?.(clampedInitialValue);
        }
    }, [initialValue, onUpdatePercent, format]);
    const ref = useRef(null);
    const mergedRef = useMergedRefs(inputRef, ref);
    useEffect(() => {
        if (focused) {
            ref.current?.focus();
        }
    }, [focused]);
    function onSelectionChange() {
        if (!ref.current) {
            return;
        }
        const selectionStart = ref.current.selectionStart;
        const selectionEnd = ref.current.selectionEnd;
        if (selectionStart === selectionEnd &&
            selectionStart !== null &&
            selectionStart >= ref.current.value.length) {
            ref.current.setSelectionRange(ref.current.value.length - 1, ref.current.value.length - 1);
        }
    }
    function onInputTextChange(val) {
        const number = val.replace(/[^0-9.]/g, '');
        setValue(number ? format(number, 'percentage') : '');
        onChangeValue?.(number);
    }
    function fireUpdate() {
        const clampedValue = clampToPercent(evalArithmetic(value.replace('%', ''), 0) ?? 0);
        onUpdatePercent?.(clampedValue);
        onInputTextChange(String(clampedValue));
    }
    function onInputAmountBlur(e) {
        if (!ref.current?.contains(e.relatedTarget)) {
            fireUpdate();
        }
        onBlur?.(e);
    }
    return (_jsx(Input, { id: id, ref: mergedRef, inputMode: "decimal", value: value, disabled: disabled, style: { flex: 1, alignItems: 'stretch', ...style }, onEnter: fireUpdate, onChangeValue: onInputTextChange, onBlur: onInputAmountBlur, onFocus: onFocus, onSelect: onSelectionChange }));
}
