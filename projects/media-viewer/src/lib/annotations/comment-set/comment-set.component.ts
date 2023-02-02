import {
  Component,
  ElementRef,
  Input, OnChanges,
  OnDestroy,
  OnInit,
  QueryList, SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { AnnotationSet } from '../annotation-set/annotation-set.model';
import { Annotation } from '../annotation-set/annotation-view/annotation.model';
import { Comment } from './comment/comment.model';
import { CommentComponent } from './comment/comment.component';
import { CommentService } from './comment/comment.service';
import { CommentSetRenderService } from './comment-set-render.service';
import * as fromStore from '../../store/reducers/reducers';
import * as fromActions from '../../store/actions/annotation.actions';
import * as fromSelectors from '../../store/selectors/annotation.selectors';
import { TagsModel } from '../models/tags.model';
import { SelectionAnnotation } from '../models/event-select.model';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';

@Component({
  selector: 'mv-comment-set',
  templateUrl: './comment-set.component.html',
 })
export class CommentSetComponent implements OnInit, OnDestroy, OnChanges {

  @Input() annotationSet: AnnotationSet;
  @Input() zoom: number;
  @Input() rotate: number;
  @Input() height: number;
  @Input() pageHeights = [];
  @Input() contentScrollTop: number;

  comments: Comment[];
  tags: TagsModel[];
  private subscriptions: Subscription[] = [];
  public comments$: Observable<Annotation[]>;
  public annoEntities$: Observable<{ [id: string]: Annotation }>;

  @ViewChild('container', {static: false}) container: ElementRef<HTMLDivElement>;
  @ViewChild('panel', {static: false}) panel: ElementRef<HTMLDivElement>;
  @ViewChildren('commentComponent') commentComponents: QueryList<CommentComponent>;

  showCommentsPanel: boolean;

  constructor(private store: Store<fromStore.AnnotationSetState>,
              private readonly commentService: CommentService,
              private readonly renderService: CommentSetRenderService,
              private readonly toolbarEvents: ToolbarEventService) {
    this.clearSelection();
  }

  ngOnInit() {
    this.comments$ = this.store.pipe(select(fromSelectors.getCommentsArray));
    this.annoEntities$ = this.store.pipe(select(fromSelectors.getAnnotationEntities));
    this.subscriptions.push(
      this.toolbarEvents.commentsPanelVisible.subscribe(toggle => {
        this.redrawComments();
        this.showCommentsPanel = toggle;
      })
    );
    this.subscriptions.push(this.toolbarEvents.rotateSubject.subscribe(rotate => this.rotateDocument()));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.annotationSet) {
      this.commentService.setCommentSet(this);
    }
    if (changes.contentScrollTop) {
      if (this.container) {
        this.container.nativeElement.scrollTo(0, this.contentScrollTop);
      }
    }
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  public onSelect(annotationId: SelectionAnnotation) {
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

  private rotateDocument() {
    if (this.panel) {
      this.panel.nativeElement.style.height = '0';
    }
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

  onContainerClick(e) {
    if (e.path && e.path[0] === this.panel.nativeElement) {
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
