import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hide-show',
  templateUrl: './hide-show.component.html',
  styleUrls: ['./hide-show.component.css']
})
export class HideShowComponent implements OnInit {

  @Input() title: string;
  @Input() showAtFirst: boolean;
  @Input() childNodes: any;

  isHidden = true;

  constructor() { }

  ngOnInit() {
    this.isHidden = !this.showAtFirst;
  }
}
