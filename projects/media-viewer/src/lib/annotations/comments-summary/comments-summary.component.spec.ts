import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { CommentsSummaryComponent } from './comments-summary.component';
import { PrintService } from '../../print.service';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { Comment } from '../comment-set/comment/comment.model';
import { User } from '../user/user.model';
import {ViewerEventService} from '../../viewers/viewer-event.service';

describe('CommentsSummaryComponent', () => {
  let component: CommentsSummaryComponent;
  let fixture: ComponentFixture<CommentsSummaryComponent>;
  let printService: PrintService;

  const annotationSet = {
    documentId: 'id',
    id: 'id',
    createdBy: 'user',
    createdByDetails: {} as User,
    createdDate: 'date',
    lastModifiedBy: 'modified user',
    lastModifiedByDetails: {} as User,
    lastModifiedDate: 'modified date',
    annotations: [{
      annotationSetId: 'id',
      page: 1,
      color: 'yellow',
      comments: [{
        id: 'id',
        createdBy: 'user',
        createdByDetails: {} as User,
        createdDate: 'date',
        lastModifiedBy: 'modified user',
        lastModifiedByDetails: {} as User,
        lastModifiedDate: 'modified date',
        annotationId: 'id',
        content: 'a comment'
      }, {
        id: 'id',
        createdBy: 'user',
        createdByDetails: {} as User,
        createdDate: 'date',
        lastModifiedBy: 'modified user',
        lastModifiedByDetails: {} as User,
        lastModifiedDate: 'modified date',
        annotationId: 'id',
        content: 'a comment'
      }],
      rectangles: [{
        id: 'id',
        createdBy: 'user',
        createdByDetails: {} as User,
        createdDate: 'date',
        lastModifiedBy: 'modified user',
        lastModifiedByDetails: {} as User,
        lastModifiedDate: 'modified date',
        annotationId: 'id',
        height: 3,
        width: 4,
        x: 12,
        y: 13
      }],
      type: 'comment',
      id: 'id',
      createdBy: 'user',
      createdByDetails: {} as User,
      createdDate: 'date',
      lastModifiedBy: 'modified user',
      lastModifiedByDetails: {} as User,
      lastModifiedDate: 'modified date'
    }]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentsSummaryComponent ],
      providers: [ PrintService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsSummaryComponent);
    component = fixture.componentInstance;
    printService = TestBed.get(PrintService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set up comment summary if annotationSet is received', () => {
    component.annotationSet = annotationSet;
    spyOn(component, 'generateCommentsSummary');
    spyOn(component, 'orderCommentsSummary');
    component.ngOnChanges();

    expect(component.generateCommentsSummary).toHaveBeenCalled();
    expect(component.orderCommentsSummary).toHaveBeenCalled();
  });

  it('should not set up comment summary if annotationSet is not set', () => {
    component.annotationSet = null;
    spyOn(component, 'generateCommentsSummary');
    spyOn(component, 'orderCommentsSummary');
    component.ngOnChanges();

    expect(component.generateCommentsSummary).not.toHaveBeenCalled();
    expect(component.orderCommentsSummary).toHaveBeenCalledTimes(0);
  });

  it('should generate comment summary collection', () => {
    component.annotationSet = annotationSet;
    component.generateCommentsSummary();

    expect(component.comments).toEqual([{
      page: 1,
        comment: {
          id: 'id',
          createdBy: 'user',
          createdByDetails: {} as User,
          createdDate: 'date',
          lastModifiedBy: 'modified user',
          lastModifiedByDetails: {} as User,
          lastModifiedDate: 'modified date',
          annotationId: 'id',
          content: 'a comment'
        },
        x: 12,
        y: 13
    }]);
  });

  it('should order the comments', () => {
    component.comments = [
      {page: 3, comment: {} as Comment, x: 32, y: 2},
      {page: 1, comment: {} as Comment, x: 22, y: 8},
      {page: 4, comment: {} as Comment, x: 11, y: 7},
      {page: 1, comment: {} as Comment, x: 52, y: 3},
      {page: 4, comment: {} as Comment, x: 12, y: 4}
    ];
    component.orderCommentsSummary();

    expect(component.comments).toEqual([
      { page: 1, comment: {} as Comment, x: 52, y: 3 },
      { page: 1, comment: {} as Comment, x: 22, y: 8 },
      { page: 3, comment: {} as Comment, x: 32, y: 2 },
      { page: 4, comment: {} as Comment, x: 12, y: 4 },
      { page: 4, comment: {} as Comment, x: 11, y: 7 }
    ]);
  });

  it('should return an empty list when passed an empty list', () => {
    component.comments = [];
    component.orderCommentsSummary();

    expect(component.comments).toEqual([]);
  });

  it('close', async(() => {
    inject([ToolbarEventService], (toolbarEvents: ToolbarEventService) => {
      spyOn(toolbarEvents, 'toggleCommentsSummary');
      component.onClose();
      expect(toolbarEvents.toggleCommentsSummary).toHaveBeenCalledWith(false);
    });
  }));

  it('print', () => {
    const printSpy = spyOn(printService, 'printElementNatively').and.stub();
    component.onPrint();

    expect(printSpy).toHaveBeenCalled();
  });

  it('should set the page if the content type is pdf', () => {
    inject([ToolbarEventService], (toolbarEvents: ToolbarEventService) => {
      spyOn(toolbarEvents, 'setPage');

      component.contentType = 'pdf';
      component.navigateToPage(4);

      expect(toolbarEvents.setPage).toHaveBeenCalledWith(4);
    });
  });

  it('should not set the page if the content type is not pdf', () => {
    inject([ToolbarEventService], (toolbarEvents: ToolbarEventService) => {
      spyOn(toolbarEvents, 'setPage');

      component.contentType = 'image';
      component.navigateToPage(1);

      expect(toolbarEvents.setPage).toHaveBeenCalledTimes(0);
    });
  });

  it('should toggle the display comment summary state', () => {
    inject([ToolbarEventService, ViewerEventService], (toolbarEvents: ToolbarEventService, viewerEvents: ViewerEventService) => {
      spyOn(toolbarEvents, 'setPage');
      spyOn(toolbarEvents, 'toggleCommentsSummary');
      spyOn(viewerEvents, 'toggleCommentsPanel');

      component.navigateToPage(4);

      expect(toolbarEvents.setPage).toHaveBeenCalled();
      expect(toolbarEvents.toggleCommentsSummary).toHaveBeenCalledWith(false);
      expect(viewerEvents.toggleCommentsPanel).toHaveBeenCalledWith(true);
    });
  });
});
