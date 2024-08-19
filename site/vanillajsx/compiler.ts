import babel from '@babel/standalone';
import { names } from '../data.js';

const data = new Map(
  Map.groupBy(names(), s => s)
    .entries()
    .map(([k, v]) => [k, v.length])
);

export const modules = new Map<string, Mod>();

export class Mod {

  #run;
  #exports?: any;

  constructor(
    public code: string,
    public filename: string,
    public container: HTMLElement,
  ) {
    this.#run = compile(this.filename, this.code);
    modules.set(filename, this);
  }

  async run() {
    try {
      await this.require();
      this.container.replaceChildren(this.#exports.default());
    }
    catch (e) {
      console.log('error')
      console.error(e)
    }
  }

  async require() {
    if (!this.#exports) {
      this.#exports = await this.#run();
    }
    return this.#exports;
  }

}

function compile(filename: string, code: string) {
  const result = babel.transform(code, {
    filename: filename,
    plugins: [
      babel.availablePlugins["transform-modules-amd"]!,
      [babel.availablePlugins["transform-typescript"]!, { isTSX: true }],
      [babel.availablePlugins["transform-react-jsx"]!, {
        runtime: 'automatic',
        importSource: '/@imlib',
      }],
    ],
  });

  const AynscFunction = (async function () { }.constructor as {
    new(...paramsAndCode: string[]): (...args: any[]) => Promise<any>;
  });

  const runCode = new AynscFunction('define', 'data', 'return await ' + result.code!);
  return () => runCode(define, data);
}

async function define(params: string[], fn: (...args: any[]) => void) {
  const exports = Object.create(null);
  const args: any[] = [];

  for (const param of params) {
    if (param === 'exports') {
      args.push(exports);
    }
    else if (param === '/@imlib/jsx-runtime') {
      args.push(await import('/@imlib/jsx-browser.js' as any));
    }
    else if (param.match(/^[./]/)) {
      try {
        args.push(await import(param));
      }
      catch {
        args.push(await modules.get(param)!.require());
      }
    }
    else {
      args.push(await import(`https://cdn.jsdelivr.net/npm/${param}/+esm`));
    }
  }

  fn(...args);

  return exports;
}
