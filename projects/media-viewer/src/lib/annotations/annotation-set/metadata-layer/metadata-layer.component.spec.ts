import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { of, Subscription } from 'rxjs';
import { Action, Store, StoreModule } from '@ngrx/store';

import { ToolbarEventService } from '../../../toolbar/toolbar-event.service';
import { HighlightCreateService } from '../annotation-create/highlight-create/highlight-create.service';
import { ViewerEventService } from '../../../viewers/viewer-event.service';
import { reducers } from '../../../store/reducers/reducers';
import { MetadataLayerComponent } from './metadata-layer.component';

describe('MetadataLayerComponent', () => {
  let component: MetadataLayerComponent;
  let fixture: ComponentFixture<MetadataLayerComponent>;
  let mockTextLayerRect, mockElement, mockHighlight, mockClientRect, mockClientRects, mockRange;
  let expectedAction: Action;
  const mockStore = {
    select: () => of([{
      styles: { height: 100, width: 100 },
      scaleRotation: { scale: 1, rotation: 0 },
      annotationSetId: 'annotationSetId',
      documentId: 'documentId'
    }]),
    pipe: () => of([{
      styles: { height: 100, width: 100 },
      scaleRotation: { scale: 1, rotation: 0 },
      annotationSetId: 'annotationSetId',
      documentId: 'documentId'
    }]),
    dispatch: (actualAction: Action) => {
      expectedAction = actualAction;
    },
  } as any;

  const mockHighlightService = {
    getRectangles: () => {},
    saveAnnotation: () => {},
    resetHighlight: () => {}
  } as any;

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
      declarations: [MetadataLayerComponent],
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('media-viewer' , reducers)
      ],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: HighlightCreateService, useValue: mockHighlightService },
        ToolbarEventService,
        ViewerEventService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataLayerComponent);
    component = fixture.componentInstance;
    component.rotate = 0;
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
      spyOn(store, 'pipe').and.returnValue(of(['pages']));
      spyOn(toolbarEvents.drawModeSubject, 'subscribe').and.callThrough();
      spyOn(viewerEvents.textHighlight, 'subscribe').and.callThrough();
      spyOn(viewerEvents.ctxToolbarCleared, 'subscribe').and.callThrough();

      component.ngOnInit();

      expect(store.pipe).toHaveBeenCalled();
      expect(toolbarEvents.drawModeSubject.subscribe).toHaveBeenCalled();
      expect(viewerEvents.textHighlight.subscribe).toHaveBeenCalled();
      expect(viewerEvents.ctxToolbarCleared.subscribe).toHaveBeenCalled();
    }
  ));

  it('should destroy subscriptions',
    inject([Store, ViewerEventService, ToolbarEventService],
      (store, viewerEvents, toolbarEvents) => {
      const mockSubscription = new Subscription();
      spyOn(mockSubscription, 'unsubscribe');
      spyOn(toolbarEvents.drawModeSubject, 'subscribe').and.returnValue(mockSubscription);
      spyOn(viewerEvents.textHighlight, 'subscribe').and.returnValue(mockSubscription);
      spyOn(viewerEvents.ctxToolbarCleared, 'subscribe').and.returnValue(mockSubscription);

      component.ngOnInit();
      component.ngOnDestroy();

      expect(mockSubscription.unsubscribe).toHaveBeenCalled();
    }
  ));

  describe('showContextToolbar', () => {
    it('should set page and rectangles and push false to highlightModeSubject',
      inject([ToolbarEventService], (toolbarEvents: ToolbarEventService) => {
        spyOn(toolbarEvents.highlightModeSubject, 'next');
        component.showContextToolbar({ page: 1, rectangles: ['rectangles'] } as any);

        expect(toolbarEvents.highlightModeSubject.next).toHaveBeenCalledWith(false);
        expect(component.rectangles).toEqual(['rectangles'] as any);
      })
    );

    it('should set page and rectangles and do not push false to highlightModeSubject',
      inject([ToolbarEventService], (toolbarEvents: ToolbarEventService) => {
        spyOn(toolbarEvents.highlightModeSubject, 'next');
        component.showContextToolbar({ page: 1, rectangles: null } as any);

        expect(toolbarEvents.highlightModeSubject.next).not.toHaveBeenCalled();
        expect(component.rectangles).toEqual(null);
      })
    );
  });

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

  it('should call saveAnnotation and push false to drawModeSubject',
    inject([HighlightCreateService, ToolbarEventService],
      (highlightCreateService: HighlightCreateService, toolbarEvents: ToolbarEventService) => {
        const mockRectangles = [];
        const mockPage = 1;

        spyOn(highlightCreateService, 'saveAnnotation');
        spyOn(toolbarEvents.drawModeSubject, 'next');

        component.saveAnnotation({ rectangles: mockRectangles, page: mockPage});
        expect(highlightCreateService.saveAnnotation).toHaveBeenCalledWith(mockRectangles, mockPage);
        expect(toolbarEvents.drawModeSubject.next).toHaveBeenCalledWith(false);
      }
    )
  );
});
