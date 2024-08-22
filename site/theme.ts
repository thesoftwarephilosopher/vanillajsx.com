import monaco from '@imlib/monaco-esm';

export function setupTheme() {
  monaco.editor.defineTheme('vsc2', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      // { token: "identifier.ts", foreground: "9CDCFE" },
      { token: "property.ts", foreground: "9CDCFE" },
      { token: "function.ts", foreground: "DCDCAA" },
      { token: "method.ts", foreground: "DCDCAA" },
      // { token: "delimiter.ts", foreground: "569CD6" },
    ],
    colors: {
      "editor.background": '#1b1f25',
    },
  });
}
