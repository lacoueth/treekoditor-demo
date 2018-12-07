import { Component, OnInit, Input, ViewChild } from '@angular/core';

// const showdown = require('showdown');
import * as showdown from 'showdown';

@Component({
  selector: 'app-render',
  templateUrl: './render.component.html',
  styleUrls: ['./render.component.css']
})
export class RenderComponent implements OnInit {
  @Input() block: any;

  @ViewChild('element') element: HTMLElement;

  htmlText = '';

  constructor() {}

  ngOnInit() {
    // console.log(this.block);
    if (this.block && this.block.type === 'plain') {
      // console.log(this.block);

      /* const conv = new showdown.Converter();
      this.htmlText =
        // '<my-component first="bonjour"></my-component>' +
        conv.makeHtml(this.block.value); */

      this.htmlText = this.block.value;

      console.log(this.htmlText);
    }
  }
}
