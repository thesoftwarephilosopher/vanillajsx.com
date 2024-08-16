import * as path from 'path';
import files from './samples/';

export default (files
  .filter(f => f.module !== undefined) // todo: fix usage of ts 5.5 fix
  .map(f => {
    return ['samples/' + path.basename(f.path.slice(0, -3)), f.module!.source];
  })
);
