import React, { useMemo, useRef, useState, useCallback } from 'react';

import Editor, { type Monaco } from '@monaco-editor/react';
import { type editor } from 'monaco-editor';

import { registerExcelFormulaLanguage } from './registerExcelFormulaLanguage';

import { useTheme } from '@desktop-client/style/theme';

type FormulaMode = 'transaction' | 'query';

type FormulaEditorProps = {
  value: string;
  onChange: (value: string) => void;
  mode: FormulaMode;
  height?: string;
  disabled?: boolean;
  editorOptions?: editor.IStandaloneEditorConstructionOptions;
  onEditorReady?: (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) => void;
  onBeforeMount?: (monaco: Monaco) => void;
};

export function FormulaEditor({
  value,
  onChange,
  mode,
  height = '100%',
  disabled = false,
  editorOptions = {},
  onEditorReady,
  onBeforeMount,
}: FormulaEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [activeTheme] = useTheme();
  const [languageId, setLanguageId] = useState(`excelFormula-${mode}`);

  const isDarkTheme = useMemo(() => {
    if (activeTheme === 'dark' || activeTheme === 'midnight') {
      return true;
    }
    if (activeTheme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }, [activeTheme]);

  const handleEditorWillMount = useCallback(
    (monaco: Monaco) => {
      monacoRef.current = monaco;
      const id = registerExcelFormulaLanguage(monaco, mode);
      setLanguageId(id);
      onBeforeMount?.(monaco);
    },
    [mode, onBeforeMount],
  );

  const handleEditorDidMount = useCallback(
    (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
      monacoRef.current = monaco;
      editorRef.current = editor;
      onEditorReady?.(editor, monaco);
    },
    [onEditorReady],
  );

  const defaultOptions: editor.IStandaloneEditorConstructionOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'off',
    glyphMargin: false,
    folding: false,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 0,
    renderLineHighlight: 'none',
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    automaticLayout: true,
    fixedOverflowWidgets: true,
    readOnly: disabled,
  };

  const mergedOptions = {
    ...defaultOptions,
    ...editorOptions,
  };

  return (
    <Editor
      height={height}
      defaultLanguage={languageId}
      language={languageId}
      value={value}
      onChange={newValue => onChange(newValue || '')}
      beforeMount={handleEditorWillMount}
      onMount={handleEditorDidMount}
      theme={isDarkTheme ? 'excelFormulaDark' : 'excelFormulaLight'}
      options={mergedOptions}
    />
  );
}
