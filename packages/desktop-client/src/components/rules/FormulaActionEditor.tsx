import React from 'react';

import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

import { FormulaEditor } from '@desktop-client/components/reports/reports/formula/FormulaEditor';

type FormulaActionEditorProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function FormulaActionEditor({
  value,
  onChange,
  disabled = false,
}: FormulaActionEditorProps) {
  // Enforce single-line: replace newlines with spaces
  const handleChange = (newValue: string) => {
    const singleLineValue = newValue.replace(/[\r\n]+/g, ' ');
    onChange(singleLineValue);
  };

  return (
    <View
      style={{
        flex: 1,
        border: `1px solid ${theme.formInputBorder}`,
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: disabled
          ? theme.formInputBackgroundSelection
          : theme.tableBackground,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <FormulaEditor
        value={value}
        onChange={handleChange}
        mode="transaction"
        disabled={disabled}
        singleLine={true}
        showLineNumbers={false}
      />
    </View>
  );
}
