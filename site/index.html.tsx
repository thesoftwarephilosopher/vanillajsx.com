import { Em } from "./em.js";

function Html(attrs: any, children: any) {
  return <>
    {`<!doctype html>`}
    <html>
      <head />
      <body>
        {children}
      </body>
    </html>
  </>;
}

export default <Html>
  <link rel='stylesheet' href='style.css' />
  <script type='module' src='client.js' />
  <p>Hello from the <Em>SSG</Em>.</p>
  <div id='root' />
</Html>;
