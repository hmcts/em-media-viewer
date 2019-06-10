import { Component, Input, OnInit } from '@angular/core';
import { Annotation } from './annotation.model';
import { annotationSet } from '../stub-annotation-data/annotation-set';

@Component({
  selector: 'mv-anno',
  templateUrl: './annotations.component.html',
  styleUrls: ['./annotations.component.scss']
})
export class AnnotationsComponent implements OnInit {

  annotations: Annotation[] = [];
  @Input() bounds: HTMLElement;

  ngOnInit() {
    this.annotations = annotationSet;
  }
}
