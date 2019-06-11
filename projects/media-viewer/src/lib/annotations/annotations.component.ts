import { Component, Input, OnInit } from '@angular/core';
import { Annotation } from './annotation.model';
import { annotationSet } from '../stub-annotation-data/annotation-set';

@Component({
  selector: 'mv-anno',
  templateUrl: './annotations.component.html',
  styleUrls: ['./annotations.component.scss']
})
export class AnnotationsComponent implements OnInit {

  @Input() bounds: HTMLElement;

  annotations: Annotation[] = [];
  selectedIndex = -1;

  ngOnInit() {
    this.annotations = annotationSet;
  }

  public setSelected(i: number) {
    this.selectedIndex = i;
  }

}
