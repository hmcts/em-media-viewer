import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { CommentSetComponent } from './comment-set.component';
import { CommentComponent } from './comment/comment.component';
import { FormsModule } from '@angular/forms';
import { AnnotationApiService } from '../annotation-api.service';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { annotationSet } from '../../../assets/annotation-set';
import { Annotation } from '../annotation-set/annotation-view/annotation.model';
import { CommentService } from './comment/comment.service';
import { CommentSetRenderService } from './comment-set-render.service';
import { TagsServices } from '../services/tags/tags.services';
import { TagsComponent } from '../tags/tags.component';
import { TagInputModule } from 'ngx-chips';
import { TextHighlightDirective } from './comment/text-highlight.directive';
import { MomentDatePipe } from '../pipes/date.pipe';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../../store/reducers/reducers';
import { BehaviorSubject } from 'rxjs';

describe('CommentSetComponent', () => {
  let component: CommentSetComponent;
  let fixture: ComponentFixture<CommentSetComponent>;
  let mockComment;
  let annotation: Annotation, annotation2: Annotation, annotation3: Annotation;
  let comment, mockRectangles;
  let toolbarEvent: ToolbarEventService;

  const api = new AnnotationApiService({}  as any);
  const toolbarEventsMock = {
    icp: {
      participantsListVisible: new BehaviorSubject(false),
    },
    toggleCommentsPanel: () => {},
    toggleParticipantsList: () => {},
    commentsPanelVisible: new BehaviorSubject(false)
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
        CommentComponent,
        TagsComponent,
        TextHighlightDirective,
        MomentDatePipe
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        TagInputModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature('media-viewer', reducers)
      ],
      providers: [
        { provide: AnnotationApiService, useValue: api },
        { provide: ToolbarEventService, useValue: toolbarEventsMock },
        CommentService,
        CommentSetRenderService,
        TagsServices
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

  it('should create', () => {
    expect(component).toBeTruthy();
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
});
