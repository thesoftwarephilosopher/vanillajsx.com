import monaco from 'monaco-editor/esm/vs/editor/editor.api.js';

// Borrowed from https://github.com/microsoft/monaco-editor/blob/main/src/basic-languages/typescript/typescript.ts
// (I'll give it back when I'm done)

export const tokenProvider: monaco.languages.IMonarchLanguage = {
  defaultToken: 'invalid',
  tokenPostfix: '.ts',

  keywords: [
    'abstract', 'any', 'as', 'asserts', 'bigint', 'boolean', 'break', 'case', 'catch', 'class', 'continue', 'const', 'constructor', 'debugger', 'declare', 'default',
    'delete', 'do', 'else', 'enum', 'export', 'extends', 'false', 'finally', 'for', 'from', 'function', 'get', 'if', 'implements', 'import', 'in', 'infer', 'instanceof',
    'interface', 'is', 'keyof', 'let', 'module', 'namespace', 'never', 'new', 'null', 'number', 'object', 'out', 'package', 'private', 'protected', 'public', 'override',
    'readonly', 'require', 'global', 'return', 'satisfies', 'set', 'static', 'string', 'super', 'switch', 'symbol', 'this', 'throw', 'true', 'try', 'type', 'typeof',
    'undefined', 'unique', 'unknown', 'var', 'void', 'while', 'with', 'yield', 'async', 'await', 'of'],

  operators: [
    '<=', '>=', '==', '!=', '===', '!==', '=>', '+', '-', '**', '*', '/', '%', '++', '--', '<<', '</', '>>', '>>>', '&', '|', '^', '!', '~', '&&', '||',
    '??', '?', ':', '=', '+=', '-=', '*=', '**=', '/=', '%=', '<<=', '>>=', '>>>=', '&=', '|=', '^=', '@'
  ],

  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  digits: /\d+(_+\d+)*/,
  octaldigits: /[0-7]+(_+[0-7]+)*/,
  binarydigits: /[0-1]+(_+[0-1]+)*/,
  hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,

  regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
  regexpesc: /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,

  tokenizer: {
    root: [[/[{}]/, 'delimiter.bracket'], { include: 'common' }],

    common: [
      // ...spread
      [/\.\.\./, 'delimiter'],

      // foo(
      [/(#?[a-z_][\w\$]*)(\()/, ['method', 'delimiter']],

      // new Foo(
      [/(new\s+)([A-Z][\w\$]*)(\()/, ['keyword', 'type.identifier', 'delimiter']],

      // Foo(
      [/([A-Z][\w\$]*)(\()/, ['function', 'delimiter']],

      // .property
      [/(\.)(#?[\w\$]*)/, ['delimiter', 'property']],

      // class properties
      [/^ +(#?[\w\$]+)\s*(?=[:;=])/, 'property'],

      // identifiers and keywords
      [/#?[a-z_$][\w$]*/, { cases: { '@keywords': 'keyword', '@default': 'identifier' } }],
      [/[A-Z][\w\$]*/, 'type.identifier'],

      // whitespace
      { include: '@whitespace' },

      // regular expression: ensure it is terminated before beginning (otherwise it is an operator)
      [/\/(?=([^\\\/]|\\.)+\/([dgimsuy]*)(\s*)(\.|;|,|\)|\]|\}|$))/, { token: 'regexp', bracket: '@open', next: '@regexp' }],

      // type params (to avoid parsing them as jsx)
      [/</, 'delimiter', '@typeparams'],

      // delimiters and operators
      [/[()\[\]]/, '@brackets'],
      [/[<>](?!@symbols)/, '@brackets'],
      [/!(?=([^=]|$))/, 'delimiter'],
      [/@symbols/, { cases: { '@operators': 'delimiter', '@default': '' } }],

      // numbers
      [/(@digits)[eE]([\-+]?(@digits))?/, 'number.float'],
      [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, 'number.float'],
      [/0[xX](@hexdigits)n?/, 'number.hex'],
      [/0[oO]?(@octaldigits)n?/, 'number.octal'],
      [/0[bB](@binarydigits)n?/, 'number.binary'],
      [/(@digits)n?/, 'number'],

      // delimiter: after number because of .\d floats
      [/[;,.]/, 'delimiter'],

      // strings
      [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
      [/'([^'\\]|\\.)*$/, 'string.invalid'], // non-teminated string
      [/"/, 'string', '@string_double'],
      [/'/, 'string', '@string_single'],
      [/`/, 'string', '@string_backtick'],
    ],

    whitespace: [
      [/[ \t\r\n]+/, ''],
      [/\/\*\*(?!\/)/, 'comment.doc', '@jsdoc'],
      [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment'],
    ],

    comment: [
      [/[^\/*]+/, 'comment'],
      [/\*\//, 'comment', '@pop'],
      [/[\/*]/, 'comment'],
    ],

    jsdoc: [
      [/[^\/*]+/, 'comment.doc'],
      [/\*\//, 'comment.doc', '@pop'],
      [/[\/*]/, 'comment.doc'],
    ],

    // We match regular expression quite precisely
    regexp: [
      [/(\{)(\d+(?:,\d*)?)(\})/, ['regexp.escape.control', 'regexp.escape.control', 'regexp.escape.control']],
      [/(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/, ['regexp.escape.control', { token: 'regexp.escape.control', next: '@regexrange' }]],
      [/(\()(\?:|\?=|\?!)/, ['regexp.escape.control', 'regexp.escape.control']],
      [/[()]/, 'regexp.escape.control'],
      [/@regexpctl/, 'regexp.escape.control'],
      [/[^\\\/]/, 'regexp'],
      [/@regexpesc/, 'regexp.escape'],
      [/\\\./, 'regexp.invalid'],
      [/(\/)([dgimsuy]*)/, [{ token: 'regexp', bracket: '@close', next: '@pop' }, 'keyword.other']],
    ],

    regexrange: [
      [/-/, 'regexp.escape.control'],
      [/\^/, 'regexp.invalid'],
      [/@regexpesc/, 'regexp.escape'],
      [/[^\]]/, 'regexp'],
      [/\]/, { token: 'regexp.escape.control', next: '@pop', bracket: '@close' }],
    ],

    string_double: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'string', '@pop'],
    ],

    string_single: [
      [/[^\\']+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/'/, 'string', '@pop'],
    ],

    string_backtick: [
      [/\$\{/, { token: 'delimiter.bracket', next: '@bracketCounting' }],
      [/[^\\`$]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/`/, 'string', '@pop'],
    ],

    typeparams: [
      [/>/, 'delimiter', '@pop'],
      { include: 'common' },
    ],

    bracketCounting: [
      [/\{/, 'delimiter.bracket', '@bracketCounting'],
      [/\}/, 'delimiter.bracket', '@pop'],
      { include: 'common' },
    ]
  }
};
