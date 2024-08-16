import monaco from '@imlib/monaco-esm';

document.querySelector('#root')?.replaceChildren(<>
  <h1>A case for vanilla JSX</h1>

  <Q>What if JSX just returned DOM elements?</Q>
  <Sample which="sample1" />

  <Q>Could they still keep their own state?</Q>
  <Sample which="sample2" />

  <Q>Could they still be complex?</Q>
  <Sample which="sample3" />

  <Q>Could they still be composable?</Q>
  <Sample which="sample4" />

  <Q>That's why I wrote <a href='https://code.immaculatalibrary.com/'>imlib</a></Q>
</>);

function Q(attrs: any, children: any) {
  return <p class='q'>{children}</p>;
}

function Sample(attrs: { which: string }) {
  const div = <div class='sample'>
    <pre class='sample-code'>
      <p>
        <a href={`https://github.com/sdegutis/vanillajsx.com/blob/main/site/lib/${attrs.which}.tsx`}>
          View source
        </a>
      </p>
    </pre>
    <div class='sample-output' />
  </div> as HTMLDivElement;

  fetch(`./lib/${attrs.which}.tsx`).then(res => res.text()).then(code => {
    const codeEl = <code>{code.trim()}</code> as HTMLElement;
    monaco.editor.colorizeElement(codeEl, {
      theme: 'vs-dark',
      mimeType: 'text/typescript',
    });
    div.querySelector('.sample-code')!.append(codeEl);
  });

  import(`./lib/${attrs.which}.js`).then(mod => {
    div.querySelector('.sample-output')!.append(<mod.default />);
  });

  return div;
}
