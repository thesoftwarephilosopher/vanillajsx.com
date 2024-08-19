import { Compiler } from "./compiler.js";

export class File {

  constructor(
    public path: string,
    public content: Buffer | string,
    compiler: Compiler,
  ) {
    if (path.match(/\.tsx?$/)) {
      const code = content.toString('utf8');
      this.content = compiler.compile(code, path).code;
      this.path = convertTsExts(path);
    }
  }

}

export function convertTsExts(path: string) {
  return path.replace(/\.tsx?$/, '.js');
}
