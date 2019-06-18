import {Component, Input, OnInit, Output, EventEmitter, ElementRef} from '@angular/core';
import { annotationSet } from '../stub-annotation-data/annotation-set';
import { AnnotationSet } from './annotation-set.model';
import {Rectangle} from './rectangle/rectangle.model';

@Component({
  selector: 'mv-anno',
  templateUrl: './annotations.component.html',
  styleUrls: ['./annotations.component.scss']
})
export class AnnotationsComponent implements OnInit {

  @Input() zoom = 1;
  @Input() rotation = 0;
  @Output() update = new EventEmitter<AnnotationSet>();
  @Input() shadowedElement: ElementRef;

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

  get widthStyle() {
    return this.shadowedElement ? (this.shadowedElement.nativeElement.clientWidth * this.zoom) + 'px' : 0;
  }

  get heightStyle() {
    return this.shadowedElement ? (this.shadowedElement.nativeElement.clientHeight * this.zoom) + 'px' : 0;
  }

}
