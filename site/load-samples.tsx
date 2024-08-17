for (const sample of document.querySelectorAll<HTMLElement>('.sample')) {
  import(`./samples/${sample.dataset['sample']}.js`).then(mod => {
    sample.querySelector('.sample-output')!.append(<mod.default />);
  });
}
