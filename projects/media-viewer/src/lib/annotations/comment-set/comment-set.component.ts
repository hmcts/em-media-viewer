import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { AnnotationSet } from '../annotation-set/annotation-set.model';
import { Annotation } from '../annotation-set/annotation-view/annotation.model';
import { AnnotationApiService } from '../annotation-api.service';
import { Comment } from './comment/comment.model';
import { CommentComponent } from './comment/comment.component';
import {Observable, Subscription} from 'rxjs';
import { ViewerEventService } from '../../viewers/viewer-event.service';
import { CommentService } from './comment/comment.service';
import { CommentSetRenderService } from './comment-set-render.service';
import * as fromStore from '../../store/reducers/reducers';
import * as fromActions from '../../store/actions/annotations.action';
import * as fromSelectors from '../../store/selectors/annotations.selectors';
import {select, Store} from '@ngrx/store';
import {TagsModel} from '../models/tags.model';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'mv-comment-set',
  templateUrl: './comment-set.component.html',
 })
export class CommentSetComponent implements OnInit, OnDestroy {

  @Input() annotationSet: AnnotationSet;
  @Input() zoom: number;
  @Input() rotate: number;
  @Input() height: number;
  @Input() pageHeights = [];

  comments: Comment[];
  tags: TagsModel[]
  private subscriptions: Subscription[] = [];
  public comments$: Observable<Annotation[]>;

  @ViewChild('container') container: ElementRef;
  @ViewChildren('commentComponent') commentComponents: QueryList<CommentComponent>;

  showCommentsPanel: boolean;

  constructor(private store: Store<fromStore.AnnotationSetState>,
              private readonly viewerEvents: ViewerEventService,
              private readonly api: AnnotationApiService,
              private readonly commentService: CommentService,
              private readonly renderService: CommentSetRenderService) {
    this.clearSelection();
  }

  ngOnInit() {
    this.comments$ = this.store.pipe(select(fromSelectors.getCommentsArray));
    this.commentService.setCommentSet(this);
    this.subscriptions.push(
      this.viewerEvents.commentsPanelVisible.subscribe(toggle => {
        this.redrawComments();
        this.showCommentsPanel = toggle;
      })
    );
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  public onSelect(annotationId) {
    this.store.dispatch(new fromActions.SelectedAnnotation(annotationId));
  }

  public onCommentDelete(comment: Comment) {
    const annotation = this.annotationSet.annotations.find(anno => anno.id === comment.annotationId);
    const comments = [];
    const annot = {
      ...annotation,
      comments
    };
    this.onAnnotationUpdate(annot);
    this.redrawComments();
  }

  redrawComments() {
    setTimeout(() => {
      const componentList: CommentComponent[] = this.commentComponents.map(comment => comment);
        this.renderService.redrawComponents(componentList, this.pageHeights, this.rotate, this.zoom);
    }, 0);
  }

  public onCommentUpdate(payload: {comment: Comment, tags: TagsModel[]} ) {
    const annotation = this.annotationSet.annotations.find(anno => anno.id === payload.comment.annotationId);
    const comments = [payload.comment];
    const tags = payload.tags;
    const annot = {
      ...annotation,
      comments,
      tags
    };
    this.onAnnotationUpdate(annot);
  }

  public onAnnotationUpdate(annotation: Annotation) {
    this.store.dispatch(new fromActions.SaveAnnotation(annotation));
  }
  // TODO move this to comment component instead of input
  topRectangle(annotationId: string) {
    const annotation = this.annotationSet.annotations.find((anno) => anno.id === annotationId);
    return annotation.rectangles.reduce((prev, current) => prev.y < current.y ? prev : current);
  }

  onContainerClick(e) {
    if (e.path && e.path[0] === this.container.nativeElement) {
      this.clearSelection();
    }
  }

  clearSelection() {
    this.store.dispatch(new fromActions.SelectedAnnotation({ annotationId: '', editable: false, selected: false}));
  }

  allCommentsSaved() {
    this.commentService.allCommentsSaved();
  }


}
