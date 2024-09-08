import babel from '@babel/standalone';
import monaco from '@imlib/monaco-esm';
import { setupTheme } from '../theme.js';
import { rules, tokenProvider } from '../token-provider.js';
import { babelPluginVanillaJSX } from './vanillajsx.js';

monaco.languages.typescript.javascriptDefaults.addExtraLib(`
declare namespace JSX {

  const jsx: unique symbol;

  type Element = {
    [jsx]: string | any,
    children: any[],
    [attr: string]: any,
  };

}
`.trim(), `ts:filename/jsx.d.ts`);

setupTheme(rules);

const file1 = await fetch('/unity/samplecode.jsx').then(res => res.text());

const model1 = monaco.editor.createModel(file1, 'javascript', monaco.Uri.parse('ts:filename/file1.jsx'));
const model2 = monaco.editor.createModel('', 'javascript', monaco.Uri.parse('ts:filename/file2.jsx'));

await monaco.languages.typescript.getJavaScriptWorker();
monaco.languages.setMonarchTokensProvider('javascript', tokenProvider as any);

const editorContainer1 = <div /> as HTMLDivElement;
const editorContainer2 = <div /> as HTMLDivElement;

document.getElementById('editors1')?.append(<>
  {editorContainer1}
  {editorContainer2}
</>);

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
  automaticLayout: true,
});

const editor2 = monaco.editor.create(editorContainer2, {
  lineNumbers: 'off',
  readOnly: true,
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
  automaticLayout: true,
});

transformJsxInSecondEditor();
editor1.onDidChangeModelContent(throttle(20, transformJsxInSecondEditor));

async function transformJsxInSecondEditor() {
  const code = model1.getValue();
  try {
    const result = babel.transform(code, {
      filename: 'file2.jsx',
      plugins: [
        babel.availablePlugins["syntax-jsx"]!,
        babelPluginVanillaJSX,
      ],
    });
    model2.setValue(result.code!);
  }
  catch (e: any) {
    console.error(e)
  }
}

function throttle(ms: number, fn: () => void) {
  let timer: any;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, ms);
  };
}
