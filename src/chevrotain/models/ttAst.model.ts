export interface TTAst {
  type: 'doc';
  content: TTBlock[];
}

export interface TTBlock {
  type: string;
  attrs?: { [paramName: string]: string };
  text?: string;
  content?: TTBlock[];
}
