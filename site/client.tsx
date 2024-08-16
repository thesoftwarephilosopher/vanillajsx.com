import { Em } from "./em.js";

document.querySelector('#root')?.replaceChildren(<>
  <p>Hello from the <Em>browser</Em>.</p>
</>);
