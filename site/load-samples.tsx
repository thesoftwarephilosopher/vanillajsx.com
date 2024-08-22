import monaco from '@imlib/monaco-esm';
import type monacoTypes from 'monaco-editor';
import { jsxlib } from './jsxlib.js';
import { setupTheme } from './theme.js';
import { rules, tokenProvider } from './token-provider.js';
import { Mod, modules } from './vanillajsx/compiler.js';

monaco.languages.typescript.typescriptDefaults.addExtraLib(jsxlib(), `ts:filename/jsx.d.ts`);
monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  jsx: monaco.languages.typescript.JsxEmit.ReactNative,
  target: monaco.languages.typescript.ScriptTarget.ESNext,
});

setupTheme(rules);

monaco.languages.setMonarchTokensProvider('typescript', tokenProvider as monacoTypes.languages.IMonarchLanguage);

for (const sample of document.querySelectorAll<HTMLElement>('.sample')) {
  const code = sample.querySelector('.sample-code>pre')!.textContent!.trim();
  const filename = `./${sample.dataset['sample']}.js`;
  const container = sample.querySelector('.sample-output') as HTMLElement;

  const codeEl = sample.querySelector('.sample-code') as HTMLElement;
  const rect = codeEl.getBoundingClientRect();
  codeEl.innerHTML = '';

  const uri = monaco.Uri.parse(`ts:filename/${sample.dataset['sample']}.tsx`);
  const model = monaco.editor.createModel(code, 'typescript', uri);

  const editor = monaco.editor.create(codeEl, {
    lineNumbers: 'off',
    fontSize: 12,
    lineDecorationsWidth: 0,
    minimap: { enabled: false },
    guides: { indentation: false },
    folding: false,
    theme: "vsc2",
    scrollBeyondLastLine: false,
    renderLineHighlightOnlyWhenFocus: true,
    model,
    tabSize: 2,
  });

  rect.width -= 40;
  rect.height -= 40;
  editor.layout(rect);

  const mod = new Mod(code, filename, container);

  const rerun = throttled(500, () => {
    mod.update(model.getValue());
  });

  model.onDidChangeContent(rerun);
}

for (const mod of modules.values()) {
  mod.run();
}

function throttled(ms: number, fn: () => void) {
  let timer: any;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, ms);
  };
}
