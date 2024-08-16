import { createHighlighter } from 'shiki';

const highlighter = createHighlighter({
  themes: ['dark-plus'],
  langs: ['tsx'],
});

document.querySelector('#root')?.replaceChildren(<>
  <h1>A case for vanilla JSX</h1>

  <Q>What if JSX just returned DOM elements?</Q>
  <Sample which="sample1" />

  <Q>Would they be reusable?</Q>
  <Q>Could they keep their own state?</Q>
  <Sample which="sample2" />

  <Q>How would they interact?</Q>
  <Q>Could they create an interactive DOM tree?</Q>
  <Sample which="sample3" />

  <Q>How would they handle large data?</Q>
  <Q>Could they be convenient without a virtual dom?</Q>
  <Sample which="sample4" />

  <Q>That's why I wrote <a href='https://code.immaculatalibrary.com/'>imlib</a></Q>
</>);

function Q(attrs: any, children: any) {
  return <p class='q'>{children}</p>;
}

function Sample(attrs: { which: string }) {
  const div = <div class='sample'>
    <div class='sample-code'>
      <p>
        <a target='_blank' href={`https://github.com/sdegutis/vanillajsx.com/blob/main/site/samples/${attrs.which}.tsx`}>
          View source
        </a>
      </p>
    </div>
    <div class='sample-output' />
  </div> as HTMLDivElement;

  fetch(`./samples/${attrs.which}.tsx`).then(res => res.text()).then(code => {
    const el = <div>
      <pre><code>{code.trim()}</code></pre>
    </div> as HTMLDivElement;
    div.querySelector('.sample-code')!.append(el);
    highlighter.then(hl => {
      el.innerHTML = hl.codeToHtml(code.trim(), {
        lang: 'tsx',
        theme: 'dark-plus',
      }).trim();
    });
  });

  import(`./samples/${attrs.which}.js`).then(mod => {
    div.querySelector('.sample-output')!.append(<mod.default />);
  });

  return div;
}
