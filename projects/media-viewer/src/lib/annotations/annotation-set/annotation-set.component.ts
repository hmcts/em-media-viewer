import { Component, Input, OnInit } from '@angular/core';
import { Annotation } from './annotation-view/annotation.model';
import { Observable } from 'rxjs';
import { SelectionAnnotation } from '../models/event-select.model';
import { CommentService } from '../comment-set/comment/comment.service';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../store/reducers/reducers';
import * as fromActions from '../../store/actions/annotations.action';
import * as fromSelectors from '../../store/selectors/annotations.selectors';


@Component({
  selector: 'mv-annotation-set',
  templateUrl: './annotation-set.component.html'
})
export class AnnotationSetComponent implements OnInit {

  @Input() page: number;
  @Input() annotations: Annotation[] = [];
  @Input() zoom: number;
  @Input() rotate: number;
  @Input() height: number;
  @Input() width: number;

  selectedAnnotation$: Observable<SelectionAnnotation>;

  constructor(
    private store: Store<fromStore.AnnotationSetState>,
    private readonly commentService: CommentService) {}

  ngOnInit(): void {
    this.selectedAnnotation$ = this.store.pipe(select(fromSelectors.getSelectedAnnotation));
  }

  public onAnnotationUpdate(annotation: Annotation) {
    this.store.dispatch(new fromActions.SaveAnnotation(annotation));
  }

  public onAnnotationDelete(annotation: Annotation) {
    if (annotation.comments.length > 0) {
      this.commentService.updateUnsavedCommentsStatus(annotation, false);
    }
    this.store.dispatch(new fromActions.DeleteAnnotation(annotation.id));
  }

  selectAnnotation(selectedAnnotation) {
    this.store.dispatch(new fromActions.SelectedAnnotation(selectedAnnotation));
  }
}
