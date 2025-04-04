import { CommentService } from './comment.service';
import { CommentSetComponent } from '../comment-set.component';
import { Annotation } from '../../annotation-set/annotation-view/annotation.model';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToolbarEventService } from '../../../toolbar/toolbar-event.service';
import { CommentSetRenderService } from '../comment-set-render.service';
import { annotationSet } from '../../../../assets/annotation-set';
import {StoreModule} from '@ngrx/store';
import {reducers} from '../../../store/reducers/reducers';

describe('CommentService', () => {
  let component: CommentSetComponent;
  let fixture: ComponentFixture<CommentSetComponent>;
  let commentService: CommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommentSetComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature('media-viewer', reducers)
      ],
      providers: [
        ToolbarEventService,
        CommentService,
        CommentSetRenderService,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    commentService = new CommentService();
    fixture = TestBed.createComponent(CommentSetComponent);
    component = fixture.componentInstance;
    component.annotationSet = JSON.parse(JSON.stringify(annotationSet));
    commentService.setCommentSet(component);
  });

  it('should initialise comment set component', () => {
    expect(commentService.commentSetComponent).not.toBeNull();
  });

  it('should update unsavedChange status to true', () => {
    spyOn(commentService.unsavedChanges, 'next');
    commentService.onCommentChange(true);

    expect(commentService.unsavedChanges.next).toHaveBeenCalledTimes(1);
    expect(commentService.unsavedChanges.next).toHaveBeenCalledWith(true);
  });

  it('should update unsavedChange status to false', () => {
    spyOn(commentService.unsavedChanges, 'next');
    commentService.onCommentChange(false);

    expect(commentService.unsavedChanges.next).toHaveBeenCalledTimes(1);
    expect(commentService.unsavedChanges.next).toHaveBeenCalledWith(false);
  });

  it('should get the unsavedChanges state', fakeAsync((done) => {
    let changes = false;
    commentService.getUnsavedChanges()
      .subscribe(
        rsp => changes = rsp
        , error => done(error)
      );
    commentService.unsavedChanges.next(true);

    expect(changes).toBe(true);
  }));

  it('should reset the commentSets list', () => {
    commentService.commentSetComponent = {} as CommentSetComponent;

    commentService.resetCommentSet();
    expect(commentService.commentSetComponent).toBeNull();
  });

  it('hasUnsavedComments should return false when annotation comments are empty', () => {
    const annotation = {
      comments: []
    } as Annotation;

    expect(commentService.hasUnsavedComments(annotation)).toBeFalsy();
  });

  it('should update marginToCommentEmitter status to true', () => {
    spyOn(commentService.marginToCommentEmitter, 'next');
    commentService.createMarginToCommentEvent(true);

    expect(commentService.marginToCommentEmitter.next).toHaveBeenCalledTimes(1);
    expect(commentService.marginToCommentEmitter.next).toHaveBeenCalledWith(true);
  });

  it('should update marginToCommentEmitter status to false', () => {
    spyOn(commentService.marginToCommentEmitter, 'next');
    commentService.createMarginToCommentEvent(false);

    expect(commentService.marginToCommentEmitter.next).toHaveBeenCalledTimes(1);
    expect(commentService.marginToCommentEmitter.next).toHaveBeenCalledWith(false);
  });
});
