import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@actual-app/components/input';
import { Select } from '@actual-app/components/select';
export function CustomUpcomingLength({ onChange, tempValue, }) {
    const { t } = useTranslation();
    const options = [
        { value: 'day', label: t('Days') },
        { value: 'week', label: t('Weeks') },
        { value: 'month', label: t('Months') },
        { value: 'year', label: t('Years') },
    ];
    let timePeriod = [];
    if (tempValue === 'custom') {
        timePeriod = ['1', 'day'];
    }
    else {
        timePeriod = tempValue.split('-');
    }
    const [numValue, setNumValue] = useState(parseInt(timePeriod[0]));
    const [unit, setUnit] = useState(timePeriod[1]);
    useEffect(() => {
        onChange(`${numValue}-${unit}`);
    }, [numValue, onChange, unit]);
    return (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 5, marginTop: 10 }, children: [_jsx(Input, { id: "length", style: { width: 40 }, type: "number", min: 1, onChangeValue: value => setNumValue(parseInt(value)), defaultValue: numValue || 1 }), _jsx(Select, { options: options.map(x => [x.value, x.label]), value: unit, onChange: newValue => setUnit(newValue) })] }));
}
