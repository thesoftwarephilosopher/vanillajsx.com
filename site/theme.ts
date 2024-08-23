import monaco from '@imlib/monaco-esm';

export function setupTheme(rules: monaco.editor.ITokenThemeRule[]) {
  monaco.editor.defineTheme('vsc2', {
    base: 'vs-dark',
    inherit: true,
    rules: rules,
    colors: {
      "editor.background": '#1b1f25',
    },
  });
}
