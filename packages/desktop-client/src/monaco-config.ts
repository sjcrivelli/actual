import { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

self.MonacoEnvironment = {
  getWorker(_, _label) {
    return new editorWorker();
  },
};

loader.config({ monaco });

loader.init();
