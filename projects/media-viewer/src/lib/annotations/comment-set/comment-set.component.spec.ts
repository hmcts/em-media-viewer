import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import {ComponentFixture, fakeAsync, inject, TestBed, tick} from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { StoreModule, Store } from '@ngrx/store';

import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { annotationSet } from '../../../assets/annotation-set';
import { Annotation } from '../annotation-set/annotation-view/annotation.model';
import { CommentService } from './comment/comment.service';
import { CommentSetComponent } from './comment-set.component';
import { CommentSetRenderService } from './comment-set-render.service';
import { TagsModel } from '../models/tags.model';
import { reducers } from '../../store/reducers/reducers';
import * as fromActions from '../../store/actions/annotation.actions';

@Component({
  selector: 'mv-anno-comment',
  template: '',
 })
export class MockCommentComponent {
  @Input() rotate = 0;
  @Input() zoom = 1;
  @Input() index: number;
  @Input() page: number;
  @Input() comment: Comment;
  @Input() annotation: Annotation;

  @Output() commentClick = new EventEmitter<any>();
  @Output() renderComments = new EventEmitter<Comment>();
  @Output() delete = new EventEmitter<Comment>();
  @Output() updated = new EventEmitter<{comment: Comment, tags: TagsModel[]}>();
  @Output() changes = new EventEmitter<boolean>();
}

describe('CommentSetComponent', () => {
  let component: CommentSetComponent;
  let fixture: ComponentFixture<CommentSetComponent>;
  let mockComment;
  let annotation: Annotation, annotation2: Annotation, annotation3: Annotation;
  let comment, mockRectangles;
  let toolbarEvent: ToolbarEventService;

  const toolbarEventsMock = {
    icp: {
      participantsListVisible: new BehaviorSubject(false),
    },
    toggleCommentsPanel: () => {},
    toggleParticipantsList: () => {},
    commentsPanelVisible: new BehaviorSubject(false),
    rotateSubject: new BehaviorSubject(false),
  };

  beforeEach(() => {
    annotation = {
      createdBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
      createdByDetails: {
        forename: 'em-showcase',
        surname: 'testuser',
        email: 'emshowcase@hmcts.net'
      },
      lastModifiedByDetails: {
        forename: 'em-showcase',
        surname: 'testuser',
        email: 'emshowcase@hmcts.net'
      },
      createdDate: '2019-05-28T08:48:19.681Z',
      lastModifiedBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
      lastModifiedDate: '2019-05-28T08:48:33.206Z',
      id: '123',
      page: 1,
      color: 'FFFF00',
      annotationSetId: '8f7aa07c-2343-44e3-b3db-bf689066d00e',
      comments: [],
      rectangles: [],
      type: 'highlight',
      tags: []
    };

    annotation2 = {
      createdBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
      createdByDetails: {
        forename: 'em-showcase',
        surname: 'testuser',
        email: 'emshowcase@hmcts.net'
      },
      lastModifiedByDetails: {
        forename: 'em-showcase',
        surname: 'testuser',
        email: 'emshowcase@hmcts.net'
      },
      createdDate: '2019-05-28T08:48:19.681Z',
      lastModifiedBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
      lastModifiedDate: '2019-05-28T08:48:33.206Z',
      id: '123',
      page: 1,
      color: 'FFFF00',
      annotationSetId: '8f7aa07c-2343-44e3-b3db-bf689066d00e',
      comments: [],
      rectangles: [],
      type: 'highlight',
      tags: []
    };

    annotation3 = {
      createdBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
      createdByDetails: {
        forename: 'em-showcase',
        surname: 'testuser',
        email: 'emshowcase@hmcts.net'
      },
      lastModifiedByDetails: {
        forename: 'em-showcase',
        surname: 'testuser',
        email: 'emshowcase@hmcts.net'
      },
      createdDate: '2019-05-28T08:48:19.681Z',
      lastModifiedBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
      lastModifiedDate: '2019-05-28T08:48:33.206Z',
      id: '123',
      page: 2,
      color: 'FFFF00',
      annotationSetId: '8f7aa07c-2343-44e3-b3db-bf689066d00e',
      comments: [],
      rectangles: [],
      type: 'highlight',
      tags: []
    };

    comment = {
      comment: {
        createdBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
        createdByDetails: {
          forename: 'Linus',
          surname: 'Norton',
          email: 'linus.norton@hmcts.net'
        },
        lastModifiedByDetails: {
          forename: 'Linus',
          surname: 'Norton',
          email: 'linus.norton@hmcts.net'
        },
        createdDate: '2019-05-28T08:48:33.206Z',
        lastModifiedBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
        lastModifiedDate: '2019-05-28T08:48:33.206Z',
        id: '16d5c513-15f9-4c39-8102-88bdb85d8831',
        content: 'This comment should be last',
        annotationId: '4f3f9361-6d17-4689-81dd-5cb2e317b329'
      },
      tags: []
    };
    mockRectangles = [
      {
        createdBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
        createdByDetails: {
          forename: 'Linus',
          surname: 'Norton',
          email: 'linus.norton@hmcts.net'
        },
        lastModifiedByDetails: {
          forename: 'Linus',
          surname: 'Norton',
          email: 'linus.norton@hmcts.net'
        },
        createdDate: '2019-05-28T08:48:19.696Z',
        lastModifiedBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
        lastModifiedDate: '2019-05-28T08:48:33.206Z',
        id: '1',
        x: 360.134016,
        y: 200,
        width: 16.879571,
        height: 10.02507,
        annotationId: '4f3f9361-6d17-4689-81dd-5cb2e317b329'
      },
      {
        createdBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
        createdByDetails: {
          forename: 'Linus',
          surname: 'Norton',
          email: 'linus.norton@hmcts.net'
        },
        lastModifiedByDetails: {
          forename: 'Linus',
          surname: 'Norton',
          email: 'linus.norton@hmcts.net'
        },
        createdDate: '2019-05-28T08:48:19.696Z',
        lastModifiedBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
        lastModifiedDate: '2019-05-28T08:48:33.206Z',
        id: '2',
        x: 360.134016,
        y: 100,
        width: 16.879571,
        height: 10.02507,
        annotationId: '4f3f9361-6d17-4689-81dd-5cb2e317b329'
      },
      {
        createdBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
        createdByDetails: {
          forename: 'Linus',
          surname: 'Norton',
          email: 'linus.norton@hmcts.net'
        },
        lastModifiedByDetails: {
          forename: 'Linus',
          surname: 'Norton',
          email: 'linus.norton@hmcts.net'
        },
        createdDate: '2019-05-28T08:48:19.696Z',
        lastModifiedBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
        lastModifiedDate: '2019-05-28T08:48:33.206Z',
        id: '3',
        x: 360.134016,
        y: 400,
        width: 16.879571,
        height: 10.02507,
        annotationId: '4f3f9361-6d17-4689-81dd-5cb2e317b329'
      }
    ];
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CommentSetComponent,
        MockCommentComponent,
      ],
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('media-viewer', reducers)
      ],
      providers: [
        { provide: ToolbarEventService, useValue: toolbarEventsMock },
        CommentService,
        CommentSetRenderService,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    mockComment = JSON.parse(JSON.stringify(comment));
    fixture = TestBed.createComponent(CommentSetComponent);
    component = fixture.componentInstance;
    component.annotationSet = JSON.parse(JSON.stringify(annotationSet));
    component.rotate = 0;
    component.height = 100;
    component.zoom = 1;
    fixture.detectChanges();
    toolbarEvent = TestBed.get(ToolbarEventService);
  });

  it('should delete the comment for the annotation', () => {
    spyOn(component, 'onAnnotationUpdate');

    component.onCommentDelete(mockComment.comment);

    expect(component.onAnnotationUpdate).toHaveBeenCalled();
    expect(component.annotationSet).not.toContain(mockComment);
  });

  it('should update the comment for the annotation', () => {
    const annoId = component.annotationSet.annotations[0].comments[0].annotationId;
    spyOn(component, 'onAnnotationUpdate');
    const mockPayload = { comment: { content: 'Updating the comment 1', annotationId: annoId }} as any;

    component.onCommentUpdate(mockPayload);

    expect(component.onAnnotationUpdate).toHaveBeenCalled();
    expect(component.annotationSet.annotations[0].comments[0]).toEqual(mockComment.comment);
  });

  it('should call the comment service to update comments state value',
    inject([CommentService], (commentService: CommentService) => {
      spyOn(commentService, 'onCommentChange');
      commentService.setCommentSet({commentComponents: []});
      component.allCommentsSaved();
      expect(commentService.onCommentChange).toHaveBeenCalled();
    })
  );

  describe('ngOnChanges', () => {
    const mockAnnoationSet = {
      documentId: '123',
      annotations: [annotation3],
      id: null,
      createdBy: null,
      createdByDetails: null,
      createdDate: null,
      lastModifiedBy: null,
      lastModifiedByDetails: null,
      lastModifiedDate: null
    };

    it('should call setCommentSet when annotationSet changed',
      inject([CommentService], (commentService: CommentService) => {
        spyOn(commentService, 'setCommentSet').and.callThrough();
        const mockChanges: SimpleChanges = {
          annotationSet: {
            previousValue: undefined,
            currentValue: mockAnnoationSet,
            firstChange: false,
            isFirstChange: () => false
          }
        };
        component.ngOnChanges(mockChanges);

        expect(commentService.setCommentSet).toHaveBeenCalled();
      })
    );

    it('should not call setCommentSet when annotationSet not changed',
      inject([CommentService], (commentService: CommentService) => {
        spyOn(commentService, 'setCommentSet').and.callThrough();
        const mockChanges: SimpleChanges = {};
        component.ngOnChanges(mockChanges);

        expect(commentService.setCommentSet).not.toHaveBeenCalled();
      })
    );
  });

  it('should dispatch SelectedAnnotation when onSelect called',
    inject([Store], (store: Store<{}>) => {
      spyOn(store, 'dispatch').and.callThrough();
      const mockSelectedAnnotation = {
        annotationId: '123',
        editable: true,
        selected: true
      };
      const action = new fromActions.SelectedAnnotation(mockSelectedAnnotation);
      component.onSelect(mockSelectedAnnotation);

      expect(store.dispatch).toHaveBeenCalledWith(action);
    })
  );

  it('should dispatch SaveAnnotation when onAnnotationUpdate called',
    inject([Store], (store: Store<{}>) => {
      spyOn(store, 'dispatch').and.callThrough();
      const action = new fromActions.SaveAnnotation(annotation3);
      component.onAnnotationUpdate(annotation3);

      expect(store.dispatch).toHaveBeenCalledWith(action);
    })
  );

  describe('onContainerClick', () => {
    it('should call clearSelection when onContainerClick called', () => {
      spyOn(component, 'clearSelection').and.callThrough();
      component.onContainerClick({ path: [component.container.nativeElement] });

      expect(component.clearSelection).toHaveBeenCalled();
    });

    it('should not call clearSelection when param is not the container', () => {
      spyOn(component, 'clearSelection').and.callThrough();
      component.onContainerClick({});

      expect(component.clearSelection).not.toHaveBeenCalled();
    });

    it('should scroll comments panel to current scrolling position of the viewer when became visible', fakeAsync(() => {
      const scrollToSpy = spyOn(component.container.nativeElement, 'scrollTo').and.callThrough();

      component.contentScrollTop = 100;
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(scrollToSpy).toHaveBeenCalled();
      });
    }));
  });
});
