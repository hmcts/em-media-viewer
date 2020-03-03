import {
  Component,
  ElementRef,
  Input, OnChanges,
  OnDestroy,
  OnInit,
  QueryList, SimpleChanges,
  ViewChild,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import { AnnotationSet } from '../annotation-set/annotation-set.model';
import { Annotation } from '../annotation-set/annotation-view/annotation.model';
import { AnnotationApiService } from '../annotation-api.service';
import { Comment } from './comment/comment.model';
import { CommentComponent } from './comment/comment.component';
import { AnnotationEventService, SelectionAnnotation } from '../annotation-event.service';
import {Observable, Subscription} from 'rxjs';
import { ViewerEventService } from '../../viewers/viewer-event.service';

import { CommentService } from './comment/comment.service';
import { CommentSetRenderService } from './comment-set-render.service';
import {TagItemModel} from '../models/tag-item.model';
import {TagsServices} from '../services/tags/tags.services';
import {take} from 'rxjs/operators';

@Component({
  selector: 'mv-comment-set',
  templateUrl: './comment-set.component.html',
  styleUrls: ['./comment-set.component.scss'],
  encapsulation: ViewEncapsulation.None
 })
export class CommentSetComponent implements OnInit, OnDestroy, OnChanges {

  @Input() annotationSet: AnnotationSet;
  @Input() zoom: number;
  @Input() rotate: number;
  @Input() height: number;
  @Input() pageHeights = [];

  comments: Comment[];
  selectAnnotation: SelectionAnnotation;
  private subscriptions: Subscription[] = [];

  @ViewChild('container') container: ElementRef;
  @ViewChildren('commentComponent') commentComponents: QueryList<CommentComponent>;

  showCommentsPanel: boolean;

  constructor(private readonly viewerEvents: ViewerEventService,
              private readonly api: AnnotationApiService,
              private readonly annotationService: AnnotationEventService,
              private readonly commentService: CommentService,
              private readonly renderService: CommentSetRenderService,
              private tagsServices: TagsServices) {
    this.clearSelection();
  }
  ngOnChanges(changes: SimpleChanges): void {
    // set the annotation tags state
    if (changes.annotationSet) {
      this.annotationSet.annotations.map(annotation => {
        if (annotation.comments.length) {
          this.tagsServices.updateTagItems(annotation.tags, annotation.id);
        }
      });
    }
  }

  ngOnInit() {
    this.commentService.setCommentSet(this);
    this.subscriptions.push(
      this.annotationService.getSelectedAnnotation()
        .subscribe(selectedAnnotation => this.selectAnnotation = selectedAnnotation),
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
    this.annotationService.selectAnnotation(annotationId);
  }

  public onCommentDelete(comment: Comment) {
    const annotation = this.annotationSet.annotations.find(anno => anno.id === comment.annotationId);
    annotation.comments = [];
    this.onAnnotationUpdate(annotation);
    this.redrawComments();
  }

  redrawComments() {
    setTimeout(() => {
      const componentList: CommentComponent[] = this.commentComponents.map(comment => comment);
      this.renderService.redrawComponents(componentList, this.pageHeights, this.rotate, this.zoom);
    }, 0);
  }

  public onCommentUpdate(payload) {
    const annotation = this.annotationSet.annotations.find(anno => anno.id === payload.comment.annotationId);
    annotation.comments[0] = payload.comment;
    annotation.tags = payload.tags;
    this.onAnnotationUpdate(annotation);
  }

  public onAnnotationUpdate(annotation: Annotation) {
    this.api
      .postAnnotation(annotation)
      .subscribe(newAnnotation => {
        const index = this.annotationSet.annotations.findIndex(a => a.id === newAnnotation.id);

        this.annotationSet.annotations[index] = newAnnotation;
      });
    this.annotationService.selectAnnotation({ annotationId: annotation.id, editable: false });
  }

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
    this.selectAnnotation = { annotationId: '', editable: false };
  }

  allCommentsSaved() {
    this.commentService.allCommentsSaved();
  }


}
