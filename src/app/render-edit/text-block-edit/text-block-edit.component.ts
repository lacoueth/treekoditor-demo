import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  AfterContentInit
} from '@angular/core';

import * as _ from 'lodash';

@Component({
  selector: 'app-text-block-edit',
  templateUrl: './text-block-edit.component.html',
  styleUrls: ['./text-block-edit.component.css']
})
export class TextBlockEditComponent implements OnInit {
  @Input() text: string;

  @Output() textEv = new EventEmitter<string>();

  constructor(private el: ElementRef) {}

  ngOnInit() {
    // this.text = _.trim(this.text);
  }

  updateText(value: string) {
    // this.text = value;
    this.textEv.emit(value);
  }
}
