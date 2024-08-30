import _babel from '@babel/standalone';
import type babel from '@babel/core';

const t = (_babel as any).packages.types as typeof babel.types;

const jsxSymbol = t.callExpression(
  t.memberExpression(
    t.identifier('Symbol'),
    t.identifier('for')
  ),
  [t.stringLiteral('jsx')],
);

export const babelPluginVanillaJSX: babel.PluginItem = {
  visitor: {
    JSXFragment: {
      enter: (path) => {
        path.replaceWith(t.objectExpression([
          t.objectProperty(jsxSymbol, t.stringLiteral(''), true),
          createChildren(path),
        ]));
      },
    },
    JSXElement: {
      enter: (path) => {
        let name;
        const v = path.node.openingElement.name;

        if (v.type === 'JSXMemberExpression') name = convertMember(v);
        else if (v.type === 'JSXNamespacedName') name = t.stringLiteral(v.namespace.name + ':' + v.name.name);
        else if (v.name.match(/^[A-Z]/)) name = t.identifier(v.name);
        else name = t.stringLiteral(v.name);

        path.replaceWith(t.objectExpression([
          t.objectProperty(jsxSymbol, name, true),
          ...path.node.openingElement.attributes.map(attr => {
            if (attr.type === 'JSXSpreadAttribute') {
              return t.spreadElement(attr.argument);
            }

            let name;
            if (attr.name.type === 'JSXNamespacedName')
              name = t.stringLiteral(attr.name.namespace.name + ':' + attr.name.name.name);//lol
            else if (attr.name.name.match(/[^\w]/))
              name = t.stringLiteral(attr.name.name);
            else
              name = t.identifier(attr.name.name);

            let val;
            if (!attr.value) val = t.booleanLiteral(true);
            else if (attr.value.type === 'StringLiteral') val = t.stringLiteral(attr.value.value);
            else if (attr.value.type === 'JSXElement') val = attr.value;
            else if (attr.value.type === 'JSXFragment') val = attr.value;
            else if (attr.value.expression.type === 'JSXEmptyExpression') throw new Error('impossible?');
            else val = attr.value.expression;

            return t.objectProperty(name, val);

          }),
          createChildren(path),
        ]));
      }
    },
  }
};

function createChildren(path: babel.NodePath<babel.types.JSXFragment | babel.types.JSXElement>): babel.types.ObjectProperty {
  return t.objectProperty(t.identifier("children"), t.arrayExpression(path.node.children.map(c => {
    if (c.type === 'JSXElement') return c;
    if (c.type === 'JSXFragment') return c;
    if (c.type === 'JSXSpreadChild') return t.spreadElement(c.expression);
    if (c.type === 'JSXText') return t.stringLiteral(c.value);

    if (c.type === 'JSXExpressionContainer') {
      if (c.expression.type === 'JSXEmptyExpression') {
        return t.stringLiteral('');
      }
      return c.expression;
    }
    return t.stringLiteral('uhhhi');
  })));
}

function convertMember(v: babel.types.JSXMemberExpression): babel.types.MemberExpression {
  return t.memberExpression(
    (v.object.type === 'JSXIdentifier'
      ? t.identifier(v.object.name)
      : convertMember(v.object)),
    t.identifier(v.property.name)
  );
}
