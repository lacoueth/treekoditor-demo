import { Component, OnInit, ElementRef, AfterViewChecked } from '@angular/core';
import {
  preProcessTT,
  renderTT,
  getTipTapAST,
  astToPlain
} from '../chevrotain/render-tiptap';
import { real_w_text_w_quotes } from '../chevrotain/input-tests';

import * as _ from 'lodash';
import { TTAst, TTBlock } from 'src/chevrotain/models/ttAst.model';
declare const window: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 't-chevrotain';

  annotationContent = '';

  value: string;
  result: string;
  tiptapAst: any = { type: 'doc', content: [] };
  ttAstProcessed: TTBlock[];

  plainValue: string;

  astPlainToEditor: TTAst = { type: 'doc', content: [] };
  astEditorToPlain: TTAst = { type: 'doc', content: [] };
  jsonAst: TTAst = { type: 'doc', content: [] };

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const mystorage = window.localStorage;
    const valueFromStorage = mystorage.getItem('test') || real_w_text_w_quotes;

    this.plainValue = valueFromStorage;

    this.astPlainToEditor = getTipTapAST(valueFromStorage);
    this.astEditorToPlain = this.astPlainToEditor;
    this.jsonAst = this.astPlainToEditor;
    this.ttAstProcessed = preProcessTT(this.astPlainToEditor.content);
    this.plainValue = astToPlain(this.astEditorToPlain);
  }

  trackByFn(index, item) {
    return JSON.stringify(item);
  }

  trackByBlockFn(index, item) {
    return JSON.stringify(item);
  }

  update(value: string) {
    this.value = value;
    window.localStorage.setItem('test', value);
    this.buildTiptapAst(value);
  }

  updateLocalValue() {
    window.localStorage.setItem('test', this.plainValue);
  }

  // build AST, update preProcessed and update view only
  updatePlain(plainInput: string) {
    try {
      this.astPlainToEditor = getTipTapAST(plainInput);
      this.jsonAst = this.astPlainToEditor;

      this.ttAstProcessed = preProcessTT(this.astPlainToEditor.content);
      this.plainValue = plainInput;
      this.updateLocalValue();
      // this.renderTipTapAst(this.tiptapAst);
    } catch (err) {
      // console.log('erreur tip tap tree', err);
    }
  }

  // update text and view
  updateFromTree(blockList: TTBlock[]) {
    this.astEditorToPlain.content = blockList;
    this.jsonAst = this.astEditorToPlain;
    this.plainValue = astToPlain(this.astEditorToPlain);
    this.updateLocalValue();
    this.ttAstProcessed = preProcessTT(this.astEditorToPlain.content);
    // console.log(this.ttAstProcessed);
  }

  buildTiptapAst(input) {
    try {
      this.tiptapAst = getTipTapAST(input);
      this.renderTipTapAst(this.tiptapAst);
    } catch (err) {
      // console.log('erreur tip tap tree', err.message);
    }
  }

  renderTipTapAst(ttAst: TTAst) {
    this.tiptapAst = ttAst;
    this.ttAstProcessed = preProcessTT(this.tiptapAst.content);

    this.value = astToPlain(this.tiptapAst);
  }

  logev(ev) {
    // console.log(ev.detail);
    this.annotationContent = JSON.parse(ev.detail.content);
  }
}
