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
  pre.outerHTML = highlighter.codeToHtml(pre.textContent!, {
    lang: 'tsx',
    theme: 'dark-plus',
  });
}
