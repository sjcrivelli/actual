import React from 'react';

import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { type editor } from 'monaco-editor';

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
  function handleEditorReady(editor: editor.IStandaloneCodeEditor) {
    editor.focus();

    const model = editor.getModel();
    if (model) {
      const lastLine = model.getLineCount();
      const lastColumn = model.getLineMaxColumn(lastLine);
      editor.setPosition({ lineNumber: lastLine, column: lastColumn });
    }
  }

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
        height: 32,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <FormulaEditor
        value={value}
        onChange={onChange}
        mode="transaction"
        height="32px"
        disabled={disabled}
        onEditorReady={handleEditorReady}
        editorOptions={{
          fontSize: 13,
          wordWrap: 'off',
          scrollbar: {
            vertical: 'hidden',
            horizontal: 'auto',
            horizontalScrollbarSize: 6,
          },
          contextmenu: false,
          padding: { top: 7, bottom: 7 },
          suggest: {
            showWords: false,
            showKeywords: false,
          },
          quickSuggestions: {
            other: true,
            comments: false,
            strings: false,
          },
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          tabCompletion: 'on',
          wordBasedSuggestions: 'off',
          parameterHints: {
            enabled: true,
            cycle: true,
          },
          hover: {
            enabled: true,
            delay: 300,
          },
        }}
      />
    </View>
  );
}
