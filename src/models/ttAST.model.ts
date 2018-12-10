export interface TTAST {
  type: 'doc';
  content: TTNode[];
}

export interface TTNode {
  type: string;
  attrs?: { [paramName: string]: string };
  text?: string;
  content?: TTNode[];
}
