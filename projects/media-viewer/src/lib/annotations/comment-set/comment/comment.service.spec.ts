import { CommentService } from './comment.service';
import { CommentSetComponent } from '../comment-set.component';
import { Annotation } from '../../annotation-set/annotation-view/annotation.model';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AnnotationApiService } from '../../annotation-api.service';
import { AnnotationEventService } from '../../annotation-event.service';
import { ToolbarEventService } from '../../../toolbar/toolbar-event.service';
import { CommentSetRenderService } from '../comment-set-render.service';
import { annotationSet } from '../../../../assets/annotation-set';
import {TagsServices} from '../../services/tags/tags.services';

describe('CommentService', () => {
  let component: CommentSetComponent;
  let fixture: ComponentFixture<CommentSetComponent>;
  let commentService: CommentService;

  const api = new AnnotationApiService({}  as any);
  const mockAnnotationService = new AnnotationEventService();

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommentSetComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AnnotationApiService, useValue: api },
        { provide: AnnotationEventService, useValue: mockAnnotationService },
        ToolbarEventService,
        CommentService,
        CommentSetRenderService,
        TagsServices
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
});
