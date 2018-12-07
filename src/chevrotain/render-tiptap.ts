import { TTBlock, TTAst } from './models/ttAst.model';
import { toTipTapAst } from './step3_actions/embed-tiptap';
import * as _ from 'lodash';
import {
  textBlock,
  youtubeBlock,
  imageBlock,
  contentBoxBlock,
  hideShowBlock,
  annotationBlock,
  parseMaths
} from './blocks-renderers/block-renderers';

export function preProcessTT(blockList: TTBlock[]): TTBlock[] {
  return mergePlainsBlocks(processInlineBlocks(blockList));
}

function renderTTBlock(block: TTBlock): string {
  switch (block.type) {
    case 'text':
      return textBlock(block.text);
    case 'youtube':
      return youtubeBlock(block.attrs);
    case 'image':
      return imageBlock(block.attrs);
    case 'box':
      return contentBoxBlock(
        block.attrs,
        renderTT(preProcessTT(block.content))
      );
    case 'hideShow':
      return hideShowBlock(block.attrs, renderTT(preProcessTT(block.content)));
    default:
      return '';
  }
}

export function renderTT(blockList: TTBlock[]): string {
  return blockList.map(block => renderTTBlock(block)).join('');
}

export function processInlineBlocks(blockList: TTBlock[]): TTBlock[] {
  return blockList.map(block => {
    switch (block.type) {
      case 'text':
        return {
          type: 'text',
          text: parseMaths(block.text)
        };
      case 'annotation':
        return {
          type: 'text',
          text: annotationBlock(
            parseMaths(block.attrs.an),
            parseMaths(renderTT(block.content))
          )
        };
      default:
        return block;
    }
  });
}

export function mergePlainsBlocks(blockArray: TTBlock[]): TTBlock[] {
  const res = [];
  let previousBlock = null;

  for (let i = 0; i < blockArray.length; i++) {
    const current = JSON.parse(JSON.stringify(blockArray[i]));
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

function trimTextBlocks(blockArray: TTBlock[]): TTBlock[] {
  return blockArray.map(block => {
    if (block.type === 'text') {
      return {
        type: 'text',
        text: _.trim(block.text)
      };
    }
    return block;
  });
}

export function getTipTapAST(input: string): TTAst {
  return toTipTapAst(input);
}

function blocksToPlain(blocks: TTBlock[], level): string {
  return blocks.map(e => blockToPlain(e, level)).join('');
}

function blockToPlain(block: TTBlock, level: number): string {
  let res = '';
  const offset = '\t'.repeat(level);

  if (block.type !== 'text') {
    const caridge = block.type !== 'annotation';
    res += (caridge ? '\n' + offset : '') + '{{ ' + block.type;

    for (const paramkey of Object.keys(block.attrs)) {
      res +=
        (caridge ? `\n${offset}\t` : ' ') +
        `| ${paramkey} = "${block.attrs[paramkey]}"`;
    }

    res += caridge ? '\n' + offset + '\t|\n' : ' |\n';
    res += blocksToPlain(block.content, level + 1);
    res += caridge ? '\n' + offset + '}}\n' : offset + '\n}}';
    return res;
  } else {
    return `${offset}"${block.text}"`;
  }
}

export function astToPlain(ast: TTAst): string {
  return blocksToPlain(ast.content, 0);
}
