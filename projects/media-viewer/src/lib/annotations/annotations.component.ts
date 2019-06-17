import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { annotationSet } from '../stub-annotation-data/annotation-set';
import { AnnotationSet } from './annotation-set.model';

@Component({
  selector: 'mv-anno',
  templateUrl: './annotations.component.html',
  styleUrls: ['./annotations.component.scss']
})
export class AnnotationsComponent implements OnInit {

  @Input() zoom: number;
  @Output() update = new EventEmitter<AnnotationSet>();

  annotationSet: AnnotationSet;
  selectedIndex = -1;

  ngOnInit() {
    this.annotationSet = annotationSet;
  }

  public setSelected(i: number) {
    this.selectedIndex = i;
  }

  public deleteComment(i: number) {
    this.annotationSet.annotations[i].comments = [];

    this.update.emit(this.annotationSet);
  }

  public updateComment(i: number, text: string) {
    this.annotationSet.annotations[i].comments[0].content = text;

    this.update.emit(this.annotationSet);
  }
}
