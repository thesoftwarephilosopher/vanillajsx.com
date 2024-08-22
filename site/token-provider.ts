// Based on https://github.com/microsoft/monaco-editor/blob/main/src/basic-languages/typescript/typescript.ts
// vs-dark monaco: https://github.com/microsoft/vscode/blob/main/src/vs/editor/standalone/common/themes.ts#L82
// dark-plus vscode: https://github.com/microsoft/vscode/blob/main/extensions/theme-defaults/themes/dark_plus.json

/**
 * Differences from official typescript monarch token provider:
 * 
 * 1. `...` is highlighted as a keyword
 * 2. `export/etc` are highlighted as control-flow keywords
 * 3. Class fields are highlighted as variables
 * 4. Highlight function/class def names properly
 * 
 */

export const rules = [
  // { token: "identifier.ts", foreground: "9CDCFE" },
  { token: "variable.property.ts", foreground: "9CDCFE" },
  // { token: "function.ts", foreground: "DCDCAA" },
  { token: "method.ts", foreground: "DCDCAA" },
  // { token: "delimiter.ts", foreground: "569CD6" },
];

export const tokenProvider = {

  defaultToken: 'invalid',
  tokenPostfix: '.ts',

  ctrlKeywords: [
    'export', 'default', 'return', 'as', 'if', 'break', 'case', 'catch', 'continue',
    'do', 'else', 'finally', 'for', 'throw', 'try', 'with', 'yield', 'await',
  ],

  keywords: [
    // Should match the keys of textToKeywordObj in
    // https://github.com/microsoft/TypeScript/blob/master/src/compiler/scanner.ts
    'abstract', 'any', 'asserts', 'bigint', 'boolean',
    'class', 'const', 'constructor', 'debugger',
    'declare', 'delete', 'enum',
    'extends', 'false', 'from', 'function', 'get',
    'implements', 'import', 'in', 'infer', 'instanceof', 'interface',
    'is', 'keyof', 'let', 'module', 'namespace', 'never', 'new',
    'null', 'number', 'object', 'out', 'package', 'private', 'protected',
    'public', 'override', 'readonly', 'require', 'global', 'satisfies',
    'set', 'static', 'string', 'super', 'switch', 'symbol', 'this',
    'true', 'type', 'typeof', 'undefined', 'unique',
    'unknown', 'var', 'void', 'while', 'async', 'of'
  ],

  operators: [
    '<=', '>=', '==', '!=', '===', '!==', '=>',
    '+', '-', '**', '*', '/', '%', '++',
    '--', '<<', '</', '>>', '>>>', '&', '|',
    '^', '!', '~', '&&', '||', '??', '?',
    ':', '=', '+=', '-=', '*=', '**=', '/=',
    '%=', '<<=', '>>=', '>>>=', '&=', '|=', '^=', '@'
  ],

  // we include these common regular expressions
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  digits: /\d+(_+\d+)*/,
  octaldigits: /[0-7]+(_+[0-7]+)*/,
  binarydigits: /[0-1]+(_+[0-1]+)*/,
  hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,

  regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
  regexpesc: /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,

  // The main tokenizer for our languages
  tokenizer: {
    root: [
      [/[{}]/, 'delimiter.bracket'],
      [/^\s*#?[\w$]+(?=\s*[;=:])/, 'variable.property'],
      { include: 'common' },
    ],

    common: [

      // highlight function/class defs nicely
      [/((?:function|class)\s+)(#?[\w$]+\s*)([<(]?)/, [
        { token: 'keyword' },
        {
          cases: {
            '$1~function\\s+': { token: 'method' },
            '$1~class\\s+': { token: 'type.identifier' },
            '': { token: 'string.sql' },
          }
        },
        { token: '@rematch' },
      ]],

      // identifiers and keywords
      [/#?[a-z_$][\w$]*/, {
        cases: {
          '@ctrlKeywords': 'keyword.flow',
          '@keywords': 'keyword',
          '@default': 'identifier',
        }
      }],
      [/[A-Z][\w\$]*/, 'type.identifier'], // to show class names nicely
      // [/[A-Z][\w\$]*/, 'identifier'],

      // whitespace
      { include: '@whitespace' },

      // regular expression: ensure it is terminated before beginning (otherwise it is an opeator)
      [
        /\/(?=([^\\\/]|\\.)+\/([dgimsuy]*)(\s*)(\.|;|,|\)|\]|\}|$))/,
        { token: 'regexp', bracket: '@open', next: '@regexp' }
      ],

      // delimiters and operators
      [/[()\[\]]/, '@brackets'],
      [/[<>](?!@symbols)/, '@brackets'],
      [/!(?=([^=]|$))/, 'delimiter'],
      [
        /@symbols/,
        {
          cases: {
            '@operators': 'delimiter',
            '@default': ''
          }
        }
      ],

      [/\.\.\./, 'keyword'],

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
      [/`/, 'string', '@string_backtick']
    ],

    whitespace: [
      [/[ \t\r\n]+/, ''],
      [/\/\*\*(?!\/)/, 'comment.doc', '@jsdoc'],
      [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment']
    ],

    comment: [
      [/[^\/*]+/, 'comment'],
      [/\*\//, 'comment', '@pop'],
      [/[\/*]/, 'comment']
    ],

    jsdoc: [
      [/[^\/*]+/, 'comment.doc'],
      [/\*\//, 'comment.doc', '@pop'],
      [/[\/*]/, 'comment.doc']
    ],

    // We match regular expression quite precisely
    regexp: [
      [
        /(\{)(\d+(?:,\d*)?)(\})/,
        ['regexp.escape.control', 'regexp.escape.control', 'regexp.escape.control']
      ],
      [
        /(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/,
        ['regexp.escape.control', { token: 'regexp.escape.control', next: '@regexrange' }]
      ],
      [/(\()(\?:|\?=|\?!)/, ['regexp.escape.control', 'regexp.escape.control']],
      [/[()]/, 'regexp.escape.control'],
      [/@regexpctl/, 'regexp.escape.control'],
      [/[^\\\/]/, 'regexp'],
      [/@regexpesc/, 'regexp.escape'],
      [/\\\./, 'regexp.invalid'],
      [/(\/)([dgimsuy]*)/, [{ token: 'regexp', bracket: '@close', next: '@pop' }, 'keyword.other']]
    ],

    regexrange: [
      [/-/, 'regexp.escape.control'],
      [/\^/, 'regexp.invalid'],
      [/@regexpesc/, 'regexp.escape'],
      [/[^\]]/, 'regexp'],
      [
        /\]/,
        {
          token: 'regexp.escape.control',
          next: '@pop',
          bracket: '@close'
        }
      ]
    ],

    string_double: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'string', '@pop']
    ],

    string_single: [
      [/[^\\']+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/'/, 'string', '@pop']
    ],

    string_backtick: [
      [/\$\{/, { token: 'delimiter.bracket', next: '@bracketCounting' }],
      [/[^\\`$]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/`/, 'string', '@pop']
    ],

    bracketCounting: [
      [/\{/, 'delimiter.bracket', '@bracketCounting'],
      [/\}/, 'delimiter.bracket', '@pop'],
      { include: 'common' }
    ]
  }

};
