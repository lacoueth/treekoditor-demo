import { AST, Block, Template } from './models/ast.model';
import { TTBlock } from './models/ttAst.model';
import * as _ from 'lodash';
import * as showdown from 'showdown';

function youtubeBlock(params) {
  return `<youtube-video id="${params.id}"></youtube-video>`;
}

function imageBlock(params) {
  return `<single-image url="${params.src}" title="${
    params.title
  }" description="${params.description}"></single-image>`;
}

function myComponentBlock(params, content) {
  return `
    <my-component first="${params.first}"
                    last="${params.last}">
    </my-component>
      `;
}

function contentBoxBlock(attrs, content) {
  return `<content-box classes="${attrs.class}"
                       heading="${attrs.title}">
    ${preProcessTT(content)}
  </content-box>`;
}

function hideShowBlock(attrs, content) {
  return `<hide-show classes="${attrs.class}"
                     heading="${attrs.title}">
    ${preProcessTT(content)}
  </hide-show>`;
}

export function preProcessTT(blockList: TTBlock[]): TTBlock[] {
  return mergePlainsTT(processInlinesTT(blockList));
}

function renderTTBlock(block: TTBlock): string {
  switch (block.type) {
    case 'text':
      const converter = new showdown.Converter();
      return converter.makeHtml(block.text);
    case 'youtube':
      return youtubeBlock(block.attrs);
    case 'image':
      return imageBlock(block.attrs);
    case 'box':
      return contentBoxBlock(block.attrs, block.content);
    case 'hideShow':
      return hideShowBlock(block.attrs, block.content);
    default:
      return '';
  }
}

export function renderTT(blockList: TTBlock[]): string {
  return blockList.map(block => renderTTBlock(block)).join('');
}

export function processInlinesTT(blockList: TTBlock[]): TTBlock[] {
  return blockList.map(block => {
    if (block.type === 'annotation') {
      console.log(renderTT(block.content));
      return {
        type: 'text',
        text: `<annotation-mark annotated="${block.attrs.an}"
        annotation="${_.escape(JSON.stringify(renderTT(block.content)))}">
        </annotation-mark>`
      };
    }
    return block;
  });
}

export function mergePlainsTT(blockArray: TTBlock[]): TTBlock[] {
  const res = [];
  let previousBlock = null;

  for (const current of blockArray) {
    if (!!previousBlock && previousBlock.type === 'text') {
      if (current.type === 'text') {
        res[res.length - 1].text += current.text;
      } else {
        res.push(current);
      }
    } else {
      res.push(current);
    }
    previousBlock = current;
  }
  return res;
}

export function preprocess(ast: AST): AST {
  const newAst = ast.ast.map(block => {
    if (
      block.type === 'template' &&
      (block.value as Template).template === 'annotation'
    ) {
      return {
        type: 'plain',
        value: `<second-component annotated="${
          (block.value as Template).params.annotated
        }" annotation="${
          (block.value as Template).params.annotation
        }"></second-component>`
      };
    }
    return block;
  });

  return { ast: newAst } as AST;
}

export function mergePlains(ast: AST): AST {
  const res = [];
  let previousBlock = null;

  for (const current of ast.ast) {
    if (!!previousBlock && previousBlock.type === 'plain') {
      if (current.type === 'plain') {
        console.log(current);
        res[res.length - 1].value += current.value;
      } else {
        res.push(current);
      }
    } else {
      res.push(current);
    }

    previousBlock = current;
  }

  return { ast: res } as AST;
}

function render(block: Block): string {
  if (block.type === 'plain') {
    // let res = '\n<Markdown>\n';
    let res = '\n';
    res += block.value;
    // res += '\n</Markdown>\n';
    res += '\n';
    return res;
  } else if ((block.value as Template).template === 'youtube') {
    return youtubeBlock((block.value as Template).params);
  } else if ((block.value as Template).template === 'image') {
    return imageBlock((block.value as Template).params);
  } else if ((block.value as Template).template === 'myComponent') {
    return myComponentBlock(
      (block.value as Template).params,
      (block.value as Template).content
    );
  } else if ((block.value as Template).template === 'box') {
    const params = (block.value as Template).params;
    const content = (block.value as Template).content;
    return `<content-box classes="${params.class}" heading="${
      params.title
    }">${content.map(e => render(e)).join('')}</content-box>`;
  } else {
    const templateName = (block.value as Template).template;
    const params = (block.value as Template).params;
    const content = (block.value as Template).content;

    let res = `\n<${templateName}`;
    Object.keys(params).forEach(key => {
      res += ` ${key}="${params[key]}"`;
    });
    res += '>\n';

    content.forEach(bloc => {
      res += render(bloc);
    });

    res += `\n</${templateName}>\n`;
    return res;
  }
}

export function ast2ml(ast: AST): string {
  let result = '';

  const blockArray = ast.ast;

  if (blockArray.length) {
    blockArray.forEach(block => {
      result += render(block);
    });

    return result;
  }
  return null;
}

export const test: Block[] = [
  {
    type: 'plain',
    value:
      '\n# Un titre h1\n\nOn *commence* avec du plain texte\n\nUne liste :\n- un\n- deux\n\n'
  },
  {
    type: 'template',
    value: {
      template: 'templateName',
      params: {
        param1: 'je suis content',
        param2: 'align-left'
      },
      content: [
        {
          type: 'plain',
          value: 'Bonjour voici le contenu des tmeplates avec un sub templare'
        },
        {
          type: 'template',
          value: {
            template: 'inlinemaths',
            params: {
              color: 'blue'
            },
            content: [
              {
                type: 'plain',
                value: 'formule compliquée'
              }
            ]
          }
        },
        {
          type: 'plain',
          value: 'avec du display après :'
        },
        {
          type: 'template',
          value: {
            template: 'image',
            params: {
              url: 'cinicrnicr'
            },
            content: [
              {
                type: 'plain',
                value: 'image du contenu pour voir plus'
              }
            ]
          }
        }
      ]
    }
  },
  {
    type: 'plain',
    value: '\nPuis du texte encore pour continuer\n'
  }
];

// console.log(ast2ml({ ast: test }));
