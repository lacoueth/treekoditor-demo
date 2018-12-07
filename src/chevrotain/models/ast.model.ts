export interface AST {
  ast: Block[];
}

export interface Block {
  type: 'plain' | 'template';
  value: string | Template;
}

export interface Template {
  template: string;
  params: { [paramName: string]: string };
  content: Block[];
}
