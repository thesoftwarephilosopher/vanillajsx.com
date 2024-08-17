import { createHighlighter } from 'shiki';

const highlighter = await createHighlighter({
  themes: ['dark-plus'],
  langs: ['tsx'],
});

for (const sample of document.querySelectorAll<HTMLElement>('.sample')) {
  const pre = sample.querySelector('pre')!;
  pre.outerHTML = highlighter.codeToHtml(pre.textContent!, {
    lang: 'tsx',
    theme: 'dark-plus',
  });
}
