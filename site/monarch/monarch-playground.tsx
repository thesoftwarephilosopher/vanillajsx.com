import monaco from '@imlib/monaco-esm';
import { jsxlib } from '../jsxlib.js';
import { setupTheme } from '../theme.js';
import { rules } from '../token-provider.js';

monaco.languages.typescript.typescriptDefaults.addExtraLib(jsxlib(), `ts:filename/jsx.d.ts`);
monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  jsx: monaco.languages.typescript.JsxEmit.ReactNative,
  target: monaco.languages.typescript.ScriptTarget.ESNext,
});

setupTheme(rules);

const file1 = await fetch('/token-provider.ts').then(res => res.text());
const file2 = await fetch('/monarch/samplecode.tsx').then(res => res.text());

const model1 = monaco.editor.createModel(file1, 'javascript', monaco.Uri.parse('ts:filename/file1.js'));
const model2 = monaco.editor.createModel(file2, 'typescript', monaco.Uri.parse('ts:filename/file2.tsx'));

const editorContainer1 = <div /> as HTMLDivElement;
const editorContainer2 = <div /> as HTMLDivElement;

document.getElementById('root')?.append(<>
  {editorContainer1}
  {editorContainer2}
</>);

const status = <div style='opacity:0.5' /> as HTMLDivElement;

document.body.append(status);

const editor1 = monaco.editor.create(editorContainer1, {
  lineNumbers: 'off',
  fontSize: 12,
  lineDecorationsWidth: 0,
  minimap: { enabled: false },
  guides: { indentation: false },
  folding: false,
  theme: "vsc2",
  model: model1,
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
  model: model2,
  scrollBeyondLastLine: false,
  renderLineHighlightOnlyWhenFocus: true,
  tabSize: 2,
});

editor1.layout({ width: 900, height: 1200 });
editor2.layout({ width: 900, height: 1200 });

_updateTokenProvider();
editor1.onDidChangeModelContent(throttle(200, _updateTokenProvider));

async function _updateTokenProvider() {
  const code = editor1.getModel()!.getValue();
  const blob = new Blob([code], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);

  try {
    const mod = await import(url);
    URL.revokeObjectURL(url);

    monaco.languages.setMonarchTokensProvider('typescript', mod.tokenProvider);
    setupTheme(mod.rules);

    status.textContent = '';
  }
  catch (e: any) {
    status.textContent = e.message;
  }
}

window.onbeforeunload = (e) => {
  if (!confirm('Lose progress!?')) e.preventDefault();
}

function throttle(ms: number, fn: () => void) {
  let timer: any;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, ms);
  };
}
