import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { TTBlock } from '../../chevrotain/models/ttAst.model';

@Component({
  selector: 'app-render-edit',
  templateUrl: './render-edit.component.html',
  styleUrls: ['./render-edit.component.css']
})
export class RenderEditComponent {
  @Input() blockList: TTBlock[];
  @Input() trackRendering = true;

  @Output() blEv = new EventEmitter<TTBlock[]>();

  updateBlock(block, index) {
    this.blockList[index] = block;
    this.blEv.emit(this.blockList);
  }

  newBlock(name, index) {
    let newBl = {};
    if (name === 'text') {
      newBl = {
        type: 'text',
        text: ''
      };
    } else {
      newBl = {
        type: name,
        attrs: {},
        content: [
          {
            type: 'text',
            text: ''
          }
        ]
      };
    }
    this.blockList.splice(index + 1, 0, newBl as TTBlock);
    this.blEv.emit(this.blockList);
  }

  deleteBlock(index) {
    this.blockList.splice(index, 1);
    this.blEv.emit(this.blockList);
  }

  trackByFn(index, current) {
    return this.trackRendering
      ? current.type === 'text'
        ? current.text
        : index
      : current;
  }
}
