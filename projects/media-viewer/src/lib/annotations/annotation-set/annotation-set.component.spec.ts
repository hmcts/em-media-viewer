import { AnnotationSetComponent } from './annotation-set.component';
import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { CommentService } from '../comment-set/comment/comment.service';
import { HighlightCreateService } from './annotation-create/highlight-create/highlight-create.service';
import { Action, Store, StoreModule } from '@ngrx/store';
import { reducers } from '../../store/reducers/reducers';
import * as fromActions from '../../store/actions/annotation.actions';
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
    dispatch: (actualAction) => { expectedAction = actualAction; },
    pipe: () => of({ annotationSetId: 'annotationSetId', documentId: 'documentId' })
  } as any;

  const mockCommentService = new CommentService();
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
      declarations: [AnnotationSetComponent],
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('media-viewer' , reducers)
      ],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: CommentService, useValue: mockCommentService },
        { provide: HighlightCreateService, useValue: mockHighlightService },
        ToolbarEventService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AnnotationSetComponent);
    component = fixture.componentInstance;
    component.rotate = 0;
    component.pageHeight = 400;
    component.pageWidth = 200;
    component.zoom = 1;
    fixture.detectChanges();

    spyOn(mockHighlight.event, 'target').and.returnValue(mockElement);
    spyOn(mockHighlight.event, 'srcElement').and.returnValue(mockElement);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update annotation', inject([Store],
    (store) => {
      spyOn(store, 'dispatch');
      const mockAnno = { annotationSetId: 'annotationSetId' } as any;

      component.onAnnotationUpdate(mockAnno);

      expect(store.dispatch).toHaveBeenCalledWith(new fromActions.SaveAnnotation(mockAnno));
    }
  ));

  describe('onAnnotationDelete', () => {
    it('should update unsaved comments and dispatch delete annotation action',
      inject([Store, CommentService], (store: Store<any>, commentService: CommentService) => {
        spyOn(store, 'dispatch');
        spyOn(commentService, 'updateUnsavedCommentsStatus');
        const mockAnno = { comments: ['comments'], id: 'id'} as any;

        component.onAnnotationDelete(mockAnno);

        expect(commentService.updateUnsavedCommentsStatus).toHaveBeenCalledWith(mockAnno, false);
        expect(store.dispatch).toHaveBeenCalledWith(new fromActions.DeleteAnnotation('id'))
      })
    );

    it('should dispatch delete annotation actions and not to call commentService',
      inject([Store, CommentService], (store: Store<any>, commentService: CommentService) => {
        spyOn(store, 'dispatch');
        spyOn(commentService, 'updateUnsavedCommentsStatus');
        const mockAnno = { comments: [], id: 'id'} as any;

        component.onAnnotationDelete(mockAnno);

        expect(commentService.updateUnsavedCommentsStatus).not.toHaveBeenCalled();
        expect(store.dispatch).toHaveBeenCalledWith(new fromActions.DeleteAnnotation('id'))
      })
    );
  });

  it('should select annotation', inject([Store],
    (store) => {
      spyOn(store, 'dispatch');

      component.selectAnnotation({} as any);

      expect(store.dispatch).toHaveBeenCalledWith(new fromActions.SelectedAnnotation({} as any));
    }
  ));
});
