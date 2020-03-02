import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { CommentSetComponent } from './comment-set.component';
import { CommentComponent } from './comment/comment.component';
import { FormsModule } from '@angular/forms';
import { AnnotationApiService } from '../annotation-api.service';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AnnotationEventService } from '../annotation-event.service';
import { annotationSet } from '../../../assets/annotation-set';
import { of } from 'rxjs';
import { Annotation } from '../annotation-set/annotation-view/annotation.model';
import { CommentService } from './comment/comment.service';
import { CommentSetRenderService } from './comment-set-render.service';
import {TagsServices} from '../services/tags/tags.services';
import {TagsComponent} from '../tags/tags.component';
import {TagInputModule} from 'ngx-chips';

describe('CommentSetComponent', () => {
  let component: CommentSetComponent;
  let fixture: ComponentFixture<CommentSetComponent>;
  let mockComment;
  let annotation: Annotation, annotation2: Annotation, annotation3: Annotation;
  let comment, mockRectangles;

  const api = new AnnotationApiService({}  as any);
  const mockAnnotationService = new AnnotationEventService();

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
        TagsComponent
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        TagInputModule
      ],
      providers: [
        { provide: AnnotationApiService, useValue: api },
        { provide: AnnotationEventService, useValue: mockAnnotationService },
        ToolbarEventService,
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the selected comment', () => {
    spyOn(mockAnnotationService, 'selectAnnotation');
    const annotationId = '123';

    component.onSelect(annotationId);

    expect(mockAnnotationService.selectAnnotation).toHaveBeenCalled();
  });

  it('should delete the comment for the annotation', () => {
    spyOn(component, 'onAnnotationUpdate');
    component.onCommentDelete(mockComment);

    expect(component.onAnnotationUpdate).toHaveBeenCalled();
    expect(component.annotationSet).not.toContain(mockComment);
  });

  it('should update the comment for the annotation', () => {
    spyOn(component, 'onAnnotationUpdate');
    mockComment.content = 'Updating the comment 1';

    component.onCommentUpdate(mockComment);

    expect(component.onAnnotationUpdate).toHaveBeenCalled();
    expect(component.annotationSet.annotations[0].comments[0]).toEqual(mockComment);
  });

  it('should post the updated the comment for the annotation', () => {
    mockComment.content = 'Updating the comment 2';
    const annotationForComment = component.annotationSet.annotations.find(anno => anno.id === mockComment.annotationId);
    spyOn(api, 'postAnnotation').and.returnValue(of(annotationForComment));
    spyOn(mockAnnotationService, 'selectAnnotation');

    component.onAnnotationUpdate(annotationForComment);

    expect(api.postAnnotation).toHaveBeenCalledWith(annotationForComment);
    expect(mockAnnotationService.selectAnnotation).toHaveBeenCalledWith({ annotationId: annotationForComment.id, editable: false });
    expect(component.annotationSet.annotations[0]).toEqual(annotationForComment);
  });

  it('should find rectangle which is at the top', () => {
    component.annotationSet.annotations[0].rectangles = mockRectangles;
    const topRectangle = component.topRectangle(component.annotationSet.annotations[0].id);

    expect(topRectangle).toEqual(mockRectangles[1]);
  });

  it('should call the comment service to update comments state value',
    inject([CommentService], (commentService: CommentService) => {
      spyOn(commentService, 'onCommentChange');
      component.allCommentsSaved();
      expect(commentService.onCommentChange).toHaveBeenCalled();
    })
  );
});
