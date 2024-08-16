import { createHighlighter } from 'shiki';

const highlighter = await createHighlighter({
  themes: ['dark-plus'],
  langs: ['tsx'],
});

for (const sample of document.querySelectorAll<HTMLElement>('.sample')) {
  import(`./samples/${sample.dataset['sample']}.js`).then(mod => {
    sample.querySelector('.sample-output')!.append(<mod.default />);
  });

  const pre = sample.querySelector('pre')!;
  const code = pre.textContent!;
  pre.outerHTML = highlighter.codeToHtml(code, {
    lang: 'tsx',
    theme: 'dark-plus',
  });
}
