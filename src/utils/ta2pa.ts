import { TTNode } from '../models/ttAST.model';
// import { toTipTapAst } from './step3_actions/embed-tiptap';
import * as _ from 'lodash';
import {
  textBlock,
  youtubeBlock,
  imageBlock,
  contentBoxBlock,
  hideShowBlock,
  annotationBlock,
  parseMaths
} from './block-renderers';

export function preProcessTT(blockList: TTNode[]): TTNode[] {
  return mergePlainsBlocks(processInlineBlocks(blockList));
}

export function renderTTBlock(block: TTNode): string {
  switch (block.type) {
    case 'doc':
      return renderTT(block.content);
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

export function renderTT(blockList: TTNode[]): string {
  return blockList.map(block => renderTTBlock(block)).join('');
}

export function processInlineBlocks(blockList: TTNode[]): TTNode[] {
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

export function mergePlainsBlocks(blockArray: TTNode[]): TTNode[] {
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

export function ta2pa(input: TTNode): TTNode {
  return { type: 'doc', content: preProcessTT(input.content) };
}
