import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { CommentSetComponent } from './comment-set.component';
import { CommentComponent } from './comment/comment.component';
import { FormsModule } from '@angular/forms';
import { AnnotationApiService } from '../annotation-api.service';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AnnotationService } from '../annotation.service';
import { annotationSet } from '../../../assets/annotation-set';
import { PageEvent } from '../../viewers/pdf-viewer/pdf-js/pdf-js-wrapper';
import { of } from 'rxjs';
import { Annotation } from '../annotation-set/annotation/annotation.model';
import { ViewerEventService } from '../../viewers/viewer-event.service';

describe('CommentSetComponent', () => {
  let component: CommentSetComponent;
  let fixture: ComponentFixture<CommentSetComponent>;

  const api = new AnnotationApiService({}  as any);
  const mockAnnotationService = new AnnotationService();

  const annotation: Annotation = {
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
    type: 'highlight'
  };

  const annotation2: Annotation = {
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
    type: 'highlight'
  };

  const annotation3: Annotation = {
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
    type: 'highlight'
  };

  const mockComment = {
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

  const mockRectangles = [
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CommentSetComponent,
        CommentComponent
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AnnotationApiService, useValue: api },
        { provide: AnnotationService, useValue: mockAnnotationService },
        ToolbarEventService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentSetComponent);
    component = fixture.componentInstance;
    component.annotationSet = { ...annotationSet };
    component.page = 1;
    component.rotate = 0;
    component.height = 100;
    component.zoom = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use addToDOM method to set the comment-set html', () => {
    spyOn(component, 'setCommentSetValues');
    const mockRealElement = document.createElement('div');
    const mockEventSource: PageEvent['source'] = {
      rotation: 0,
      scale: 1,
      div: mockRealElement
    };

    component.addToDOM(mockEventSource);
    expect(component.setCommentSetValues).toHaveBeenCalledWith(mockEventSource);
    expect(mockEventSource.div.parentNode.parentNode).toEqual(component.pageContainer);
    expect(mockEventSource.div.parentNode).toEqual(component.pageWrapper);
    expect(mockEventSource.div.parentNode.nextSibling).toEqual(component.container.nativeElement);
  });

  it('should set values for the comment set', () => {
    const mockRealElement = document.createElement('div');
    mockRealElement.setAttribute('height', '100px');
    const mockEventSource: PageEvent['source'] = {
      rotation: 0,
      scale: 1,
      div: mockRealElement
    };

    component.setCommentSetValues(mockEventSource);

    expect(component.zoom).toEqual(mockEventSource.scale);
    expect(component.rotate).toEqual(mockEventSource.rotation);
    expect(component.height).toEqual(mockEventSource.div.clientWidth);
  });

  it('should return all the comments for the page', () => {
    const annotations = [annotation, annotation2, annotation3];
    component.annotationSet.annotations = annotations;

    const commentsForPage = component.getCommentsOnPage();

    expect(commentsForPage.length).toEqual(2);
  });

  it('should set the selected comment', () => {
    spyOn(mockAnnotationService, 'onAnnotationSelection');
    const annotationId = '123';

    component.onSelect(annotationId);

    expect(mockAnnotationService.onAnnotationSelection).toHaveBeenCalledWith(annotationId);
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
    const annotationForComment = component.annotationSet.annotations.find(annotation => annotation.id === mockComment.annotationId);
    spyOn(api, 'postAnnotation').and.returnValue(of(annotationForComment));
    spyOn(mockAnnotationService, 'onAnnotationSelection');

    component.onAnnotationUpdate(annotationForComment);

    expect(api.postAnnotation).toHaveBeenCalledWith(annotationForComment);
    expect(mockAnnotationService.onAnnotationSelection).toHaveBeenCalledWith({ annotationId: annotationForComment.id, editable: false });
    expect(component.annotationSet.annotations[0]).toEqual(annotationForComment);
  });

  it('should find rectangle which is at the top', () => {
    component.annotationSet.annotations[0].rectangles = mockRectangles;
    const topRectangle = component.topRectangle(component.annotationSet.annotations[0].id);

    expect(topRectangle).toEqual(mockRectangles[1]);
  });

  it('should toggle comments panel',
    inject([ViewerEventService], (viewerEvents: ViewerEventService) => {
      spyOn(viewerEvents, 'toggleCommentsPanel');

      component.toggleCommentsPanel();

      expect(viewerEvents.toggleCommentsPanel).toHaveBeenCalledWith(false);
  }));
});
