import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { Annotation } from './annotation.model';
import { Rectangle } from './rectangle/rectangle.model';
import { ViewerEventService } from '../../../viewers/viewer-event.service';
import {Store} from '@ngrx/store';
import * as fromStore from '../../../store/reducers';
import * as fromActions from '../../../store/actions';
import {SelectionAnnotation} from '../../models/event-select.model';

@Component({
  selector: 'mv-annotation',
  templateUrl: './annotation-view.component.html'
})
export class AnnotationViewComponent {

  @Input() set annotation(value) {
      this.anno = {...value};
  }
  anno: Annotation;
  selected: boolean;
  @Input() commentsLeftOffset: number;
  @Input() zoom: number;
  @Input() rotate: number;
  @Input() set selectedAnnoId(selectedId) {
    this.selected = selectedId.annotationId ? (selectedId.annotationId === this.anno.id) : false;
  };
  @Input() height: number;
  @Input() width: number;
  @Output() update = new EventEmitter<Annotation>();
  @Output() delete = new EventEmitter<Annotation>();
  @Output() annotationClick = new EventEmitter<SelectionAnnotation>();

  @ViewChild('container') container: ElementRef;

  constructor(
    private viewerEvents: ViewerEventService,
    private store: Store<fromStore.AnnotationSetState>) {}

  public onSelect() {
    this.annotationClick.emit({ annotationId: this.anno.id, editable: false, selected: true });
  }

  public onRectangleUpdate(rectangle: Rectangle) {
    this.anno.rectangles = this.anno.rectangles.filter(r => r.id !== rectangle.id);
    this.anno.rectangles.push(rectangle);

    this.update.emit(this.anno);
  }

  public deleteHighlight() {
    this.delete.emit(this.anno);
  }

  public addOrEditComment() {
    if (this.anno.comments.length === 0) {
      const comment = {
        annotationId: this.anno.id,
        content: '',
        createdBy: this.anno.createdBy,
        createdByDetails: undefined,
        createdDate: new Date().getTime().toString(),
        id: uuid(),
        lastModifiedBy: '',
        lastModifiedByDetails: undefined,
        lastModifiedDate: '',
        tags: []
      };
      this.store.dispatch(new fromActions.AddOrEditComment(comment))

    }
    this.selected = true;
    this.annotationClick.emit({ annotationId: this.anno.id, editable: true, selected: true });
    this.viewerEvents.toggleCommentsPanel(true);
  }

  topRectangle() {
    return this.anno.rectangles.reduce((prev, current) => prev.y < current.y ? prev : current);
  }
}
