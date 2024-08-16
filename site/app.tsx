import monaco from '@imlib/monaco-esm';

document.querySelector('#root')?.replaceChildren(<>
  <h1>A case for vanilla JSX</h1>

  <p>What if JSX just returned DOM elements?</p>
  <ShowSample which="sample1" />

  <p>Could they still by dynamic?</p>
  <ShowSample which="sample2" />

  <p>That's why I wrote <a href='https://code.immaculatalibrary.com/'>imlib</a></p>
</>);

function ShowSample(attrs: { which: string }) {
  const div = <div /> as HTMLDivElement;

  fetch(`./lib/${attrs.which}.tsx`).then(res => res.text()).then(code => {
    const codeEl = <code>{code.trim()}</code> as HTMLElement;

    div.append(<>
      <pre class='sample-code'>
        {codeEl}
      </pre>
    </>);

    monaco.editor.colorizeElement(codeEl, {
      theme: 'vs-dark',
      mimeType: 'text/typescript',
    });
  });

  import(`./lib/${attrs.which}.js`).then(mod => {
    div.append(<>
      <div class='sample-output'>
        <mod.default />
      </div>
    </>);
  });

  return div;
}
