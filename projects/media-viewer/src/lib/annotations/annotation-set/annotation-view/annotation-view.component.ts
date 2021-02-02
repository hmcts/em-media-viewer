import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { Annotation } from './annotation.model';
import { Rectangle } from './rectangle/rectangle.model';
import { ViewerEventService } from '../../../viewers/viewer-event.service';
import * as moment_ from 'moment-timezone';
import {Store} from '@ngrx/store';
import * as fromStore from '../../../store/reducers/reducers';
import * as fromActions from '../../../store/actions/annotations.action';
import {SelectionAnnotation} from '../../models/event-select.model';
import {ToolbarEventService} from '../../../toolbar/toolbar-event.service';

@Component({
  selector: 'mv-annotation',
  templateUrl: './annotation-view.component.html'
})
export class AnnotationViewComponent {  // todo rename this to selection vew c

  @Input() set annotation(value) {
      this.anno = {...value};
  }
  anno: Annotation;
  selected: boolean;
  @Input() zoom: number;
  @Input() rotate: number;
  @Input() set selectedAnnoId(selectedId) {
    if (selectedId) {
      const id = this.anno.id || this.anno.redactionId // todo make it unique
      this.selected = selectedId.annotationId ? (selectedId.annotationId === id) : false;
    }
  };
  @Input() pageHeight: number;
  @Input() pageWidth: number;
  @Output() update = new EventEmitter<Annotation>();
  @Output() delete = new EventEmitter<Annotation>();
  @Output() annotationClick = new EventEmitter<SelectionAnnotation>();

  @ViewChild('container', { static: false }) container: ElementRef;

  constructor(
    private readonly toolbarEvents: ToolbarEventService,
    private store: Store<fromStore.AnnotationSetState>) {}

  public onSelect() {
    const annotationId = this.anno.id || this.anno.redactionId;
    this.annotationClick.emit({ annotationId, editable: false, selected: true });
  }

  public onRectangleUpdate(rectangle: Rectangle) {
    const annotation = {...this.anno}
    annotation.rectangles = annotation.rectangles.filter(r => r.id !== rectangle.id);
    annotation.rectangles.push(rectangle);
    this.update.emit(annotation);
  }

  public deleteHighlight() {
    this.delete.emit(this.anno);
  }

  public addOrEditComment() {
    if (this.anno.comments.length === 0) {
      const moment = moment_;
      const comment = {
        annotationId: this.anno.id,
        content: '',
        createdBy: this.anno.createdBy,
        createdByDetails: undefined,
        createdDate: moment.utc().tz('Europe/London'),
        id: uuid(),
        lastModifiedBy: '',
        lastModifiedByDetails: undefined,
        lastModifiedDate: '',
        tags: []
      };
      this.store.dispatch(new fromActions.AddOrEditComment(comment));

    }
    this.selected = true;
    this.annotationClick.emit({ annotationId: this.anno.id, editable: true, selected: true });
    this.toolbarEvents.toggleCommentsPanel(true);
  }
}
