import { TTNode } from 'src/models/ttAST.model';

/**
 * Serialize TipTap AST to raw text
 * @param node TipTap AST document node (root node)
 */
export function ta2rt(node: TTNode): string {
  function serializeAttrs(attrs: any): string {
    return Object.keys(attrs).reduce((a, c) => `${a} ${c}="${attrs[c]}"`, '');
  }

  if (node.type === 'doc') {
    return node.content.reduce((e, c) => e + ta2rt(c), '');
  }

  if (node.type === 'text') {
    return node.text;
  }

  return (
    `<${node.type}${node.attrs ? serializeAttrs(node.attrs) : ''}>` +
    node.content.reduce((e, c) => e + ta2rt(c), '') +
    `</${node.type}>`
  );
}
