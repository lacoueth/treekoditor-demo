import { Component, OnInit } from '@angular/core';
/* import { rt2ra } from 'src/utils/rt2ra';
import { ra2ta } from 'src/utils/ra2ta';
import { ta2pa, renderTTBlock } from 'src/utils/ta2pa'; */

import { rt2ra, ra2ta, ta2pa, pa2rh } from 'treekoditor';

import * as JsDiff from 'diff';
import * as _ from 'lodash';

const options = {
  // preset: 'bem',
  ignoreAttributes: ['id'],
  compareAttributesAsJSON: [],
  ignoreWhitespaces: false,
  ignoreComments: true,
  ignoreEndTags: false,
  ignoreDuplicateAttributes: false
};

import { HtmlDiffer } from 'html-differ';
// const HtmlDiffer = require('html-differ').HtmlDiffer,
const htmlDiffer = new HtmlDiffer(options);

@Component({
  selector: 'app-diffs-printer',
  templateUrl: './diffs-printer.component.html',
  styleUrls: ['./diffs-printer.component.css']
})
export class DiffsPrinterComponent implements OnInit {
  showRaw = true;

  rawText1;
  rawText2;
  rawDiffs;

  htmlResult1;
  htmlResult2;
  htmlDiffs;
  rawHtmlDiffs;

  constructor() {}

  ngOnInit() {
    const lstore = window.localStorage;
    this.rawText1 = lstore.getItem('test-html');
    this.rawText2 = lstore.getItem('test-html-2');

    this.htmlResult1 = pa2rh(ta2pa(ra2ta(rt2ra(this.rawText1))));
    this.htmlResult2 = pa2rh(ta2pa(ra2ta(rt2ra(this.rawText2))));

    this.rawByWords();
  }

  htmlDiff() {
    this.htmlDiffs = htmlDiffer.diffHtml(this.htmlResult1, this.htmlResult2);
    console.log('HTML diffs', this.htmlDiffs);

    this.rawHtmlDiffs = '';

    this.htmlDiffs.forEach(part => {
      // green for additions, red for deletions
      // grey for common parts
      const spanClass = part.added
        ? 'added'
        : part.removed
        ? 'removed'
        : 'untouched';

      this.rawHtmlDiffs += `<span class="${spanClass}">${part.value}</span>`;
    });
  }

  rawByWords() {
    const diffs = JsDiff.diffWords(this.rawText1, this.rawText2);
    console.log('Diffs by words', diffs);

    let tmp = '';

    diffs.forEach(part => {
      // green for additions, red for deletions
      // grey for common parts
      const spanClass = part.added
        ? 'added'
        : part.removed
        ? 'removed'
        : 'untouched';

      tmp += `<span class="${spanClass}">${_.escape(part.value)}</span>`;
    });

    const lines = tmp.split('\n');

    // console.log(lines);

    this.rawDiffs = lines.map(line => {
      const empty = !line;
      return `<code><span class="${empty ? 'empty' : ''}">${line}</code>`;
    });
  }

  rawByLines() {
    const diffs = JsDiff.diffLines(this.rawText1, this.rawText2);
    console.log('Diffs by words', diffs);

    this.rawDiffs = [];

    diffs.forEach(part => {
      // green for additions, red for deletions
      // grey for common parts
      const spanClass = part.added
        ? 'added'
        : part.removed
        ? 'removed'
        : 'untouched';

      /* const lines = part.value.split('\n');

      console.log(lines);
      this.rawDiffs += lines
        .map(line => {
          const empty = !line;
          return `<code><span class="${spanClass} ${
            empty ? 'empty' : ''
          }">${_.escape(line)}</span></code>`;
        })
        .join('\n'); */

      this.rawDiffs.push(
        `<span class="${spanClass}">${_.escape(part.value)}</span>`
      );
    });
  }
}
