import { Mod, modules } from './vanillajsx/compiler.js';

for (const sample of document.querySelectorAll<HTMLElement>('.sample')) {
  const code = sample.querySelector('.sample-code>pre')!.textContent!;
  const filename = `./${sample.dataset['sample']}.js`;
  const container = sample.querySelector('.sample-output') as HTMLElement;

  new Mod(code, filename, container);
}

for (const mod of modules.values()) {
  mod.run();
}
