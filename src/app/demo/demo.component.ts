import { Component, OnInit } from '@angular/core';
import { INITIAL_VALUE } from 'src/assets/initial-value';
import { rt2ra, ra2ta, ta2pa, ta2rt } from 'treekoditor';
import { TTBlock } from 'src/chevrotain/models/ttAst.model';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {
  rawText = '';
  rawAST: any = { type: 'doc', content: [] };
  tiptapAST: any = { type: 'doc', content: [] };
  processedAST: any = { type: 'doc', content: [] };

  versionKey = 'demo-test';

  editorMode = 'text';

  annotationContent = '';

  // showRendered = true;

  ngOnInit() {
    const mystorage = window.localStorage;
    this.rawText = mystorage.getItem(this.versionKey) || INITIAL_VALUE;
    this.updatePlain(this.rawText);
  }

  changeVersion(i: number) {
    this.versionKey = i === 1 ? 'test-html' : 'test-html-2';
    this.ngOnInit();
  }

  trackByFn(index, item) {
    return JSON.stringify(item);
  }

  trackByBlockFn(index, item) {
    return JSON.stringify(item);
  }

  updateLocalValue() {
    window.localStorage.setItem(this.versionKey, this.rawText);
  }

  // build AST, update preProcessed and update view only
  updatePlain(plainInput: string) {
    this.rawText = plainInput;
    this.updateLocalValue();
    this.rawAST = rt2ra(plainInput);
    // console.log(this.rawAST);
    this.tiptapAST = ra2ta(this.rawAST);
    // console.log(this.tiptapAST);
    this.processedAST = ta2pa(this.tiptapAST);
  }

  toPlain() {
    this.rawText = ta2rt(this.tiptapAST);
    this.updateLocalValue();
    this.rawAST = rt2ra(this.rawText);

    this.editorMode = 'text';
  }

  toTree() {
    this.editorMode = 'tree';
  }

  // update text and view
  updateFromTree(blockList: TTBlock[]) {
    this.tiptapAST.content = blockList;
    this.processedAST = ta2pa(this.tiptapAST);
    // this.rawText = ta2rt(this.tiptapAST);
    // this.updateLocalValue();
    // this.rawAST = rt2ra(this.rawText);
  }

  showAnnotation(ev) {
    this.annotationContent = JSON.parse(ev.detail.annotation);
  }
}
