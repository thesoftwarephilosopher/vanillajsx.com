import monaco from '@imlib/monaco-esm';
import monacoTypes from 'monaco-editor';

export function setupTheme(rules: monacoTypes.editor.ITokenThemeRule[]) {
  monaco.editor.defineTheme('vsc2', {
    base: 'vs-dark',
    inherit: true,
    rules: rules,
    colors: {
      "editor.background": '#1b1f25',
    },
  });
}
