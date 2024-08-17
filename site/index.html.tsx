import files from './samples/';

export default <>
  {`<!DOCTYPE html>`}
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel='stylesheet' href='style.css' />
      <script type='module' src='client.js' />
      <title>Vanilla JSX</title>
    </head>
    <body>

      <div id='root'>
        <h1>A case for vanilla JSX</h1>

        <Q>What if JSX just returned DOM elements?</Q>
        <Sample which="sample1" />

        <Q>Would they be reusable?</Q>
        <Q>Could they keep their own state?</Q>
        <Sample which="sample2" />

        <Q>How would they work together?</Q>
        <Q>Could they create an interactive DOM tree?</Q>
        <Sample which="sample3" />

        <Q>How would they handle large data?</Q>
        <Q>Could they be convenient without a virtual dom?</Q>
        <Sample which="sample4" />

        <Q>How would they manage complex state?</Q>
        <Q>How could parent components react to children?</Q>
        <Sample which="sample5" />

        <p>This came out of my work on <a href="https://github.com/sdegutis/imlib">imlib</a>.</p>
      </div>

    </body>
  </html>
</>;

function Q(attrs: any, children: any) {
  return <p class='q'>{children}</p>;
}

function Sample(attrs: { which: string }) {
  const file = files.find(f => f.path.includes(attrs.which))!;
  const src = `https://github.com/sdegutis/vanillajsx.com/blob/main/site/samples/${attrs.which}.tsx`;
  return (
    <div class='sample' data-sample={attrs.which}>
      <div class='sample-code'>
        <p><a target='_blank' href={src}>View source</a></p>
        <pre>
          <code>
            {file.module!.source.replace(/</g, '&lt;')}
          </code>
        </pre>
      </div>
      <div class='sample-output' />
    </div>
  );
}
