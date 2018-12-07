import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: ['./annotation.component.css']
})
export class AnnotationComponent implements OnInit {

  @Input() annotated: string;
  @Input() annotation: any;

  showAnnotation: false;

  constructor() { }

  ngOnInit() {
  }

}
