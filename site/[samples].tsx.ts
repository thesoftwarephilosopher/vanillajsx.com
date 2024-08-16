import * as path from 'path';
import files from './samples/';

export default (files.map(f => ['samples/' + path.basename(f.path.slice(0, -3)), f.module!.source]));
