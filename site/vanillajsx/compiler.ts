import * as swc from '@swc/core';

export class Compiler {

  compile(code: string, realFilePath?: string, browserFilePath?: string) {
    let prefix = '';
    if (browserFilePath && !browserFilePath.startsWith('/@imlib/')) {
      const levels = browserFilePath.match(/\//g)!.length - 1;
      prefix = '.' + '/..'.repeat(levels);
    }

    const opts: swc.Options = {
      sourceMaps: 'inline',
      module: { type: 'es6' },
      plugin: (program) => {
        return this.#renameImports(program, browserFilePath);
      },
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: true,
        },
        target: 'esnext',
        transform: {
          react: {
            runtime: 'automatic',
            importSource: '/@imlib',
            throwIfNamespace: false,
          }
        }
      }
    };

    if (realFilePath) {
      opts.module!.type = 'commonjs';
      opts.sourceFileName = realFilePath;
      // options.sourceMapOptions = { compiledFilename: realFilePath };
      // options.filePath = pathToFileURL(realFilePath).href;
    }
    const result = swc.transformSync(code, opts);
    if (realFilePath) {
      result.code = result.code.replace(/"\/@imlib\/jsx-runtime"/g, `"/@imlib/jsx-node.js"`);
    }
    else {
      result.code = result.code.replace(/"\/@imlib\/jsx-runtime"/g, `"${prefix}/@imlib/jsx-browser.js"`);
    }
    return result;
  }

  #renameImports(program: swc.Program, browserFilePath?: string): swc.Program {
    if (browserFilePath) {
      for (const imp of program.body) {
        if (imp.type === 'ImportDeclaration') {
          const dep = imp.source.value;
          if (!dep.match(/^[./]/)) {
            delete imp.source.raw;
            imp.source.value = `https://cdn.jsdelivr.net/npm/${dep}/+esm`;
          }
        }
      }
    }
    return program;
  }

}
