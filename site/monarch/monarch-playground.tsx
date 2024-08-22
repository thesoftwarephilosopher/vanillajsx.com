import monaco from '@imlib/monaco-esm';
import { setupTheme } from '../theme.js';
import { rules } from '../token-provider.js';

setupTheme(rules);

// monaco.languages.typescript.typescriptDefaults.addExtraLib(jsxlib(), `ts:filename/jsx.d.ts`);
monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  jsx: monaco.languages.typescript.JsxEmit.ReactNative,
  target: monaco.languages.typescript.ScriptTarget.ESNext,
});

const root = document.getElementById('root') as HTMLDivElement;

const file1 = await fetch('/token-provider.ts').then(res => res.text());
const file2 = await fetch('/monarch/samplecode.tsx').then(res => res.text());

const editorContainer1 = <div /> as HTMLDivElement;
const editorContainer2 = <div /> as HTMLDivElement;

root.append(editorContainer1);
root.append(editorContainer2);

const editor1 = monaco.editor.create(editorContainer1, {
  lineNumbers: 'off',
  fontSize: 12,
  lineDecorationsWidth: 0,
  minimap: { enabled: false },
  guides: { indentation: false },
  folding: false,
  theme: "vsc2",
  value: file1,
  language: 'javascript',
  scrollBeyondLastLine: false,
  renderLineHighlightOnlyWhenFocus: true,
  tabSize: 2,
});

const editor2 = monaco.editor.create(editorContainer2, {
  lineNumbers: 'off',
  fontSize: 12,
  lineDecorationsWidth: 0,
  minimap: { enabled: false },
  guides: { indentation: false },
  folding: false,
  theme: "vsc2",
  value: file2,
  language: 'typescript',
  scrollBeyondLastLine: false,
  renderLineHighlightOnlyWhenFocus: true,
  tabSize: 2,
});

editor1.layout({ width: 700, height: 1250 });
editor2.layout({ width: 700, height: 1250 });

updateTokenProvider();
editor1.onDidChangeModelContent(updateTokenProvider);

async function updateTokenProvider() {
  const code = editor1.getModel()!.getValue();
  const blob = new Blob([code], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const mod = await import(url);
  URL.revokeObjectURL(url);

  monaco.languages.setMonarchTokensProvider('typescript', mod.tokenProvider);
  setupTheme(mod.rules);
}
