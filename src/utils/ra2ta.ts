import { TTNode } from 'src/models/ttAST.model';

/**
 * Raw AST to TipTap AST
 * @param childnode
 */
export function ra2ta(childnode: any): TTNode {
  if (childnode.nodeType === 3) {
    return { type: 'text', text: childnode.rawText };
  }

  return {
    type: childnode.tagName || 'doc',
    attrs: childnode.attributes,
    content: childnode.childNodes.map(e => ra2ta(e))
  };
}
