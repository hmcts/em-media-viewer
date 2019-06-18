import {Component, Input, OnInit, Output, EventEmitter, ElementRef} from '@angular/core';
import { annotationSet } from '../stub-annotation-data/annotation-set';
import { AnnotationSet } from './annotation-set.model';
import { AnnotationApiService } from './annotation-api.service';

@Component({
  selector: 'mv-anno',
  templateUrl: './annotations.component.html',
  styleUrls: ['./annotations.component.scss']
})
export class AnnotationsComponent implements OnInit {

  @Input() zoom: number;
  @Input() rotation = 0;
  annotationSet: AnnotationSet;
  selectedIndex = -1;

  constructor(
    private readonly api: AnnotationApiService
  ) {}

  ngOnInit() {
    this.annotationSet = annotationSet;
  }

  public setSelected(i: number) {
    this.selectedIndex = i;
  }

  public deleteComment(i: number) {
    this.annotationSet.annotations[i].comments = [];

    this.update();
  }

  public updateComment(i: number, text: string) {
    this.annotationSet.annotations[i].comments[0].content = text;

    this.update();
  }

  private update() {
    this.api
      .postAnnotationSet(this.annotationSet)
      .subscribe(newAnnotationSet => this.annotationSet = newAnnotationSet);
  }

}
