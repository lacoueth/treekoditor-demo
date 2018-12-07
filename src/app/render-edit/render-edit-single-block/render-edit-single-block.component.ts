import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TTBlock } from 'src/chevrotain/models/ttAst.model';

@Component({
  selector: 'app-render-edit-single-block',
  templateUrl: './render-edit-single-block.component.html',
  styleUrls: ['./render-edit-single-block.component.css']
})
export class RenderEditSingleBlockComponent implements OnInit {
  @Input() block: TTBlock;

  @Output() blockUpdate = new EventEmitter<TTBlock>();
  @Output() newBlock = new EventEmitter<string>();
  @Output() deleteBl = new EventEmitter<string>();

  type: string;
  text: string;
  attrs: { [paramKey: string]: string };
  content: TTBlock[];

  developed = true;

  constructor() {}

  ngOnInit() {
    this.type = this.block.type;
    this.text = this.block.text || null;
    this.attrs = this.block.attrs || null;
    this.content = this.block.content || null;
  }

  updateBlock() {
    this.blockUpdate.emit(this.block);
  }

  addBlock() {
    const name = prompt('blockname');
    if (name) {
      this.newBlock.emit(name);
    }
  }

  deleteBlock() {
    const conf = confirm('Sure to suppress this block ?');

    if (conf) {
      this.deleteBl.emit();
    }
  }

  updateText(value) {
    this.block.text = value;
    this.updateBlock();
  }

  updateParam(key, value) {
    this.block.attrs[key] = value;
    this.updateBlock();
  }

  newParam() {
    const newParamName = prompt('Param name');
    if (newParamName != null) {
      this.attrs[newParamName] = '';
    }
  }

  deleteParam(key) {
    const sure = confirm('Sure to delete ?');

    if (sure) {
      delete this.attrs[key];
      this.updateBlock();
    }
  }

  updateContent(content) {
    this.block.content = content;
    this.updateBlock();
  }

  trackByParamsFn(index, current) {
    return current.key;
  }
}
