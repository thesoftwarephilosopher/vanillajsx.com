import monaco from '@imlib/monaco-esm';
import { tokenProvider } from './token-provider.js';
import { Mod, modules } from './vanillajsx/compiler.js';

monaco.languages.typescript.typescriptDefaults.addExtraLib(jsxlib(), `ts:filename/jsx.d.ts`);
monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  jsx: monaco.languages.typescript.JsxEmit.ReactNative,
  target: monaco.languages.typescript.ScriptTarget.ESNext,
});

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

monaco.languages.setMonarchTokensProvider('typescript', tokenProvider);

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

function jsxlib() {
  return `
declare namespace JSX {
  type EventHandler<T extends Event> = (e: T) => any;

  export type ElementAttrs = {

    [attr: string]: string | boolean | EventHandler<any>;

    id?: string;
    class?: string;
    style?: string;
    title?: string;
    innerHTML?: string;
    hidden?: boolean;

    onclick?: string | EventHandler<MouseEvent>,
    onmousedown?: string | EventHandler<MouseEvent>,
    onmouseenter?: string | EventHandler<MouseEvent>,
    onmouseleave?: string | EventHandler<MouseEvent>,
    onmousemove?: string | EventHandler<MouseEvent>,
    onmouseover?: string | EventHandler<MouseEvent>,
    onmouseup?: string | EventHandler<MouseEvent>,

    oninput?: string | EventHandler<Event>,
    onchange?: string | EventHandler<Event>,

    onkeydown?: string | EventHandler<KeyboardEvent>,
    onkeyup?: string | EventHandler<KeyboardEvent>,

    onload?: string | EventHandler<Event>,

  };

  export type HtmlAttrs = { lang?: string };
  export type AnchorAttrs = ElementAttrs & { href?: string; rel?: 'noopener'; target?: string };
  export type MetaAttrs = { 'http-equiv'?: string; content?: string; name?: string; charset?: string; property?: string; };
  export type LinkAttrs = { href?: string } & (
    { rel?: 'stylesheet' } |
    { rel?: 'icon'; type?: string; sizes?: string } |
    { rel?: 'apple-touch-icon'; sizes?: string } |
    { rel?: 'preload'; as?: 'font'; type?: 'font/woff'; crossorigin?: boolean } |
    { rel?: 'manifest' });
  export type ScriptAttrs = ElementAttrs & { type?: 'module'; src?: string };
  export type ImgAttrs = ElementAttrs & { src?: string; loading?: 'lazy', alt?: '' };
  export type FormAttrs = ElementAttrs & { method?: string; action?: string };
  export type ButtonAttrs = ElementAttrs & { type?: string };
  export type InputAttrs = ElementAttrs & { type?: string; name?: string; value?: string; checked?: boolean; autofocus?: boolean; placeholder?: string; autocomplete?: string };
  export type TextAreaAttrs = ElementAttrs & { name?: string; rows?: string };
  export type SelectAttrs = ElementAttrs & { name?: string };
  export type OptionAttrs = ElementAttrs & { value?: string; selected?: boolean };
  export type OptgroupAttrs = ElementAttrs & { label?: string };
  export type IFrameAttrs = ElementAttrs & { src?: string; allowfullscreen?: boolean | 'allowfullscreen' | ''; width?: string; height?: string; frameborder?: string; loading?: 'lazy'; allow?: string };
  export type SvgAttrs = ElementAttrs & { viewBox?: string; height?: string };
  export type PathAttrs = ElementAttrs & { d?: string };

  type IntrinsicElements = {

    [tag: string]: Record<string, string | boolean | Function>;

    html: HtmlAttrs, head: ElementAttrs, body: ElementAttrs, title: {},
    meta: MetaAttrs, link: LinkAttrs, script: ScriptAttrs, iframe: IFrameAttrs, style: {},
    a: AnchorAttrs, b: ElementAttrs, i: ElementAttrs, span: ElementAttrs, em: ElementAttrs, small: ElementAttrs,
    img: ImgAttrs, hr: ElementAttrs, br: ElementAttrs,
    div: ElementAttrs, p: ElementAttrs, blockquote: ElementAttrs, li: ElementAttrs, ul: ElementAttrs, ol: ElementAttrs,
    header: ElementAttrs, footer: ElementAttrs, main: ElementAttrs, section: ElementAttrs, aside: ElementAttrs, nav: ElementAttrs, details: ElementAttrs, summary: ElementAttrs,
    form: FormAttrs, button: ButtonAttrs, input: InputAttrs, textarea: TextAreaAttrs, select: SelectAttrs, option: OptionAttrs, label: ElementAttrs, optgroup: OptgroupAttrs,
    h1: ElementAttrs, h2: ElementAttrs, h3: ElementAttrs, h4: ElementAttrs, h5: ElementAttrs, h6: ElementAttrs,
    svg: SvgAttrs, path: PathAttrs,

  };

  export type Element = HTMLElement | SVGElement | DocumentFragment | string;
  export type Component<T extends Record<string, any> = {}> = (attrs: T, children: any) => Element;
}

  `.trim();
}
