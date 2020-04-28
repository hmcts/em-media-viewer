import { AnnotationSetComponent } from './annotation-set.component';
import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { AnnotationApiService } from '../annotation-api.service';
import { Observable, of } from 'rxjs';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { CommentService } from '../comment-set/comment/comment.service';
import { HighlightCreateService } from './annotation-create/highlight-create.service';
import { Highlight, ViewerEventService } from '../../viewers/viewer-event.service';
import { Action, Store, StoreModule } from '@ngrx/store';
import { reducers } from '../../store/reducers';
import * as fromActions from '../../store/actions/annotations.action';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AnnotationSetComponent', () => {
  let component: AnnotationSetComponent;
  let fixture: ComponentFixture<AnnotationSetComponent>;
  let mockTextLayerRect, mockElement, mockHighlight, mockClientRect, mockClientRects, mockRange;
  let expectedAction: Action;
  const mockStore = {
    select: () => of([{
      styles: { height: 100, width: 100 },
      scaleRotation: { scale: 1, rotation: 0 }
    }]),
    dispatch: (actualAction) => { expectedAction = actualAction },
    pipe: () => of({ annotationSetId: 'annotationSetId', documentId: 'documentId' })
  } as any;

  const api = new AnnotationApiService({}  as any);
  const mockCommentService = new CommentService();
  const mockHighlightService = {
    getRectangles: () => {},
    saveAnnotation: () => {},
    resetHighlight: () => {}
  } as any;

  const fakeApi: any = {
    returnedAnnotation: {
      id: 'testId',
      annotationSetId: 'testAnnotationSetId',
      color: 'FFFF00',
      comments: [],
      page: 1,
      rectangles: [],
      type: 'highlight'
    },
    postAnnotation(annotation: any): Observable<any> {
      fakeApi.returnedAnnotation.id = annotation.id;
      fakeApi.returnedAnnotation.annotationSetId = annotation.annotationSetId;
      fakeApi.returnedAnnotation.page = annotation.page;
      fakeApi.returnedAnnotation.rectangles = annotation.rectangles;
      return of(fakeApi.returnedAnnotation);
    }
  };

  beforeEach(() => {
    mockTextLayerRect = {
      top: 0,
      left: 0,
    };

    mockElement = {
      parentElement: {
        getBoundingClientRect(): unknown {
          return mockTextLayerRect;
        },
        childNodes: [{
          style: {
            padding: '100px 100px 100px 100px',
            transform: 'scaleX(0.01) translateX(100px) translateY(-0.1)'
          }
        },
          {
            style: {
              padding: '100px 100px 100px 100px',
              transform: 'scaleX(0.01) translateX(100) translateY(-0.1px)'
            }
          }]
      }
    };

    mockHighlight = {
      page: 1,
      event: {
        pageY: 10,
        pageX: 10,
        target: mockElement,
        srcElement: mockElement
      } as any,
    };

    mockClientRect = {
      top: 10,
      bottom: 100,
      left: 25,
      right: 100,
    };

    mockClientRects = [mockClientRect, mockClientRect];
    mockRange = {
      cloneRange(): any {
        return mockRange;
      },
      getClientRects(): any {
        return mockClientRects;
      }
    };

  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnnotationSetComponent],
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('media-viewer' , reducers)
      ],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: AnnotationApiService, useValue: api },
        { provide: CommentService, useValue: mockCommentService },
        { provide: HighlightCreateService, useValue: mockHighlightService },
        ToolbarEventService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AnnotationSetComponent);
    component = fixture.componentInstance;
    component.rotate = 0;
    component.height = 400;
    component.width = 200;
    component.zoom = 1;
    fixture.detectChanges();

    spyOn(mockHighlight.event, 'target').and.returnValue(mockElement);
    spyOn(mockHighlight.event, 'srcElement').and.returnValue(mockElement);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setup subscriptions',
    inject([Store, ViewerEventService, ToolbarEventService],
    (store, viewerEvents, toolbarEvents) => {
      const mockSubscription = { unsubscribe: () => {} };
      spyOn(store, 'select');
      spyOn(toolbarEvents.drawModeSubject, 'subscribe').and.returnValue(mockSubscription);
      spyOn(viewerEvents.textHighlight, 'subscribe').and.returnValue(mockSubscription);
      spyOn(viewerEvents.ctxToolbarCleared, 'subscribe').and.returnValue(mockSubscription);

      component.ngOnInit();

      expect(store.select).toHaveBeenCalled();
      expect(toolbarEvents.drawModeSubject.subscribe).toHaveBeenCalled();
      expect(viewerEvents.textHighlight.subscribe).toHaveBeenCalled();
      expect(viewerEvents.ctxToolbarCleared.subscribe).toHaveBeenCalled();
    }
  ));

  it('should destroy subscriptions',
    inject([ViewerEventService, ToolbarEventService],(viewerEvents, toolbarEvents) => {
      const mockSubscription = { unsubscribe: () => {} };
      spyOn(mockSubscription, 'unsubscribe');
      spyOn(toolbarEvents.drawModeSubject, 'subscribe').and.returnValue(mockSubscription);
      spyOn(viewerEvents.textHighlight, 'subscribe').and.returnValue(mockSubscription);
      spyOn(viewerEvents.ctxToolbarCleared, 'subscribe').and.returnValue(mockSubscription);

      component.ngOnInit();
      component.ngOnDestroy();

      expect(mockSubscription.unsubscribe).toHaveBeenCalledTimes(3);
    }
  ));

  it('should show context toolbar',
    inject([ViewerEventService, HighlightCreateService],
      fakeAsync((viewerEvents, highlightService) => {
        spyOn(highlightService, 'getRectangles').and.returnValue(['rectangles']);
        component.ngOnInit();

        viewerEvents.textSelected({ page: 1 } as Highlight);
        tick();

        expect(highlightService.getRectangles).toHaveBeenCalled();
        expect(component.rectangles).toEqual(['rectangles'] as any);
      })
  ));

  it('should clear context toolbar', () => {
    component.rectangles = ['rectangles'] as any;

    component.clearContextToolbar();

    expect(component.rectangles).toBeUndefined();
  });

  it('should create highlight',
    inject([HighlightCreateService], (highlightCreateService) => {
      spyOn(highlightCreateService, 'saveAnnotation');
      spyOn(highlightCreateService, 'resetHighlight');

      component.createHighlight();

      expect(highlightCreateService.saveAnnotation).toHaveBeenCalled();
      expect(highlightCreateService.resetHighlight).toHaveBeenCalled();
      expect(component.rectangles).toBeUndefined();
  }));

  it('should create bookmark',
    inject([HighlightCreateService, Store], (highlightCreateService, store) => {
      const mockSelection = { toString: () => 'bookmark text' } as any;
      spyOn(window, 'getSelection').and.returnValue(mockSelection);
      component.highlightPage = 1;
      spyOn(store, 'dispatch');
      spyOn(highlightCreateService, 'resetHighlight');

      component.createBookmark({ x: 100, y: 200 } as any);

      expect(store.dispatch).toHaveBeenCalled();
      expect(highlightCreateService.resetHighlight).toHaveBeenCalled();
      expect(component.rectangles).toBeUndefined();
    }
  ));

  it('should update annotation', inject([Store],
    (store) => {
      spyOn(store, 'dispatch');
      const mockAnno = { annotationSetId: 'annotationSetId' } as any;

      component.onAnnotationUpdate(mockAnno);

      expect(store.dispatch).toHaveBeenCalledWith(new fromActions.SaveAnnotation(mockAnno))
    }
  ));

  it('should delete annotation', inject([Store, CommentService],
    (store, commentService) => {
      spyOn(store, 'dispatch');
      spyOn(commentService, 'updateUnsavedCommentsStatus');
      const mockAnno = { comments: ['comments'], id: 'id'} as any;

      component.onAnnotationDelete(mockAnno);

      expect(commentService.updateUnsavedCommentsStatus).toHaveBeenCalledWith(mockAnno, false);
      expect(store.dispatch).toHaveBeenCalledWith(new fromActions.DeleteAnnotation('id'))
    }
  ));

  it('should select annotation', inject([Store],
    (store) => {
      spyOn(store, 'dispatch');

      component.selectAnnotation({} as any);

      expect(store.dispatch).toHaveBeenCalledWith(new fromActions.SelectedAnnotation({} as any));
    }
  ));
});
