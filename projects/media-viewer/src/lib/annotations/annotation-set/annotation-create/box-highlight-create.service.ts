import { Subject } from 'rxjs';
import { Rectangle } from '../annotation-view/rectangle/rectangle.model';
import uuid from 'uuid';
import { ToolbarEventService } from '../../../toolbar/toolbar-event.service';
import { AnnotationApiService } from '../../annotation-api.service';
import { AnnotationEventService } from '../../annotation-event.service';
import { Injectable } from '@angular/core';
import {Store} from '@ngrx/store';
import * as fromStore from '../../../store';

@Injectable()
export class BoxHighlightCreateService {

  public readonly initHighlight = new Subject<MouseEvent>();
  public readonly updateHighlight = new Subject<MouseEvent>();
  public readonly createHighlight = new Subject<number>();

  constructor(private toolBarEvents: ToolbarEventService,
              private readonly api: AnnotationApiService,
              private readonly annotationService: AnnotationEventService,
              private store: Store<fromStore.AnnotationSetState>) {}

  initBoxHighlight(event: MouseEvent) {
    this.initHighlight.next(event);
  }

  updateBoxHighlight(event: MouseEvent) {
    this.updateHighlight.next(event);
  }

  createBoxHighlight(page: number) {
    this.createHighlight.next(page);
  }

  saveBoxHighlight(rectangle: any, annotationSet, page:number) {
    if (rectangle.height > 5 || rectangle.width > 5) {
      this.saveAnnotation([rectangle as Rectangle], annotationSet, page);
      this.toolBarEvents.drawModeSubject.next(false);
    }
  }

  private saveAnnotation(rectangles: Rectangle[], annotationSet, page) {
    const annotationPayload = {
      id: uuid(),
      annotationSetId: annotationSet.id,
      color: 'FFFF00',
      comments: [],
      page: page,
      rectangles: rectangles,
      type: 'highlight'
    };

    this.store.dispatch(new fromStore.SaveAnnotation(annotationPayload));
    // this.api.postAnnotation({
    //   id: uuid(),
    //   annotationSetId: annotationSet.id,
    //   color: 'FFFF00',
    //   comments: [],
    //   page: page,
    //   rectangles: rectangles,
    //   type: 'highlight'
    // })
    //   .subscribe(savedAnnotation => {
    //     annotationSet.annotations.push(savedAnnotation);
    //     this.annotationService.selectAnnotation({ annotationId: savedAnnotation.id, editable: false });
    //   });
  }
}
