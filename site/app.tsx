import monaco from '@imlib/monaco-esm';

document.querySelector('#root')?.replaceChildren(<>

  <h3>What if JSX just returned DOM elements?</h3>

  <ShowSample which="sample1" />

</>);

function ShowSample(attrs: { which: string }) {
  const div = <div /> as HTMLDivElement;

  fetch(`./lib/${attrs.which}.tsx`).then(res => res.text()).then(code => {
    const codeEl = <code data-lang='text/typescript'>{code}</code> as HTMLElement;

    div.append(<>
      <pre class='sample-code'>
        {codeEl}
      </pre>
    </>);

    monaco.editor.colorizeElement(codeEl, { theme: 'vs-dark' });
  });

  import(`./lib/${attrs.which}.js`).then(mod => {
    console.log(mod.default)
    div.append(<>
      <div class='sample-output'>
        <mod.default />
      </div>
    </>);
  });

  return div;
}
