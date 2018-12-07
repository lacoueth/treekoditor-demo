import { Component, OnInit, Input, ElementRef, OnChanges } from '@angular/core';
import { TTBlock } from 'src/chevrotain/models/ttAst.model';
import { renderTT } from 'src/chevrotain/render-tiptap';

declare const window: any;

@Component({
  selector: 'app-render-inner-html',
  templateUrl: './render-inner-html.component.html',
  styleUrls: ['./render-inner-html.component.css']
})
export class RenderInnerHtmlComponent implements OnInit, OnChanges {
  @Input() block: TTBlock;

  inner: string;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    // console.log(this.block);
    const renderedTT = renderTT([this.block]);
    // console.log(renderedTT);

    this.inner = renderedTT;
    // console.log(this.result);

    // this.renderMaths();
    if (this.block.type === 'text') {
      setTimeout(() => {
        // this.renderMaths();
      }, 10);
    }
  }

  ngOnChanges() {
    /* console.log('changes');
    const renderedTT = renderTT([this.block]);
    this.inner = renderedTT; */
  }

  private renderMaths() {
    window.renderMathInElement(this.el.nativeElement, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
      ],
      // ignoredTags: [],
      unicodeTextInMathMode: true,
      macros: {
        '\\N': '\\mathbb{N}',
        '\\Z': '\\mathbb{Z}',
        '\\Q': '\\mathbb{Q}',
        '\\R': '\\mathbb{R}',
        '\\C': '\\mathbb{C}',
        '\\K': '\\mathbb{K}'
      }
    });
  }
}
