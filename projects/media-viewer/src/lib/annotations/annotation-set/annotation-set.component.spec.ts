import { AnnotationSetComponent } from './annotation-set.component';
import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { RectangleComponent } from './annotation-view/rectangle/rectangle.component';
import { FormsModule } from '@angular/forms';
import { annotationSet } from '../../../assets/annotation-set';
import { PopupToolbarComponent } from './annotation-view/popup-toolbar/popup-toolbar.component';
import { AnnotationViewComponent } from './annotation-view/annotation-view.component';
import { AnnotationApiService } from '../annotation-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { PageEvent } from '../../viewers/pdf-viewer/pdf-js/pdf-js-wrapper';
import { CommentComponent } from '../comment-set/comment/comment.component';
import { AnnotationEventService } from '../models/event-select.model';
import { CommentService } from '../comment-set/comment/comment.service';
import { MutableDivModule } from 'mutable-div';
import { TextHighlightCreateService } from './annotation-create/text-highlight-create.service';
import { BoxHighlightCreateComponent } from './annotation-create/box-highlight-create.component';
import { BoxHighlightCreateService } from './annotation-create/box-highlight-create.service';
import { Highlight, ViewerEventService } from '../../viewers/viewer-event.service';
import { TagsComponent } from '../tags/tags.component';
import { TagInputModule } from 'ngx-chips';

describe('AnnotationSetComponent', () => {
  let component: AnnotationSetComponent;
  let fixture: ComponentFixture<AnnotationSetComponent>;
  let mockTextLayerRect, mockElement, mockHighlight, mockClientRect, mockClientRects, mockRange;

  const api = new AnnotationApiService({}  as any);
  const mockAnnotationService = new AnnotationEventService();
  const mockCommentService = new CommentService();

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

  })

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AnnotationSetComponent,
        AnnotationViewComponent,
        BoxHighlightCreateComponent,
        CommentComponent,
        RectangleComponent,
        PopupToolbarComponent,
        TagsComponent
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MutableDivModule,
        TagInputModule
      ],
      providers: [
        { provide: AnnotationApiService, useValue: api },
        { provide: AnnotationEventService, useValue: mockAnnotationService },
        { provide: CommentService, useValue: mockCommentService },
        ToolbarEventService,
        TextHighlightCreateService,
        BoxHighlightCreateService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AnnotationSetComponent);
    component = fixture.componentInstance;
    component.annotationSet = JSON.parse(JSON.stringify(annotationSet));
    component.page = 1;
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

  it('update annotations', () => {
    const annotation = JSON.parse(JSON.stringify(annotationSet.annotations[0]));
    const spy = spyOn(api, 'postAnnotation').and.returnValues(of(annotation));

    annotation.color = 'red';
    component.onAnnotationUpdate(annotation);

    expect(spy).toHaveBeenCalledWith(annotation);
  });

  it('should assign annotation to annotation-set when updated', () => {
    const annotation = JSON.parse(JSON.stringify(annotationSet.annotations[0]));
    spyOn(api, 'postAnnotation').and.returnValues(of(annotation));
    spyOn(mockCommentService, 'hasUnsavedComments').and.returnValues(true);

    annotation.color = 'red';
    component.onAnnotationUpdate(annotation);

    expect(component.annotationSet.annotations[0]).toEqual(annotation);
  });

  it('should delete annotation', () => {
    spyOn(api, 'deleteAnnotation').and.returnValues(of(null));
    spyOn(mockCommentService, 'updateUnsavedCommentsStatus');
    const annotations = JSON.parse(JSON.stringify(annotationSet.annotations));
    const annotation = annotations[0];

    component.onAnnotationDelete(annotation);

    expect(api.deleteAnnotation).toHaveBeenCalledWith(annotation.id);
    expect(annotations).not.toEqual(component.annotationSet.annotations);
  });

  it('should call updateUnsavedCommentsStatus',
    inject([CommentService], (commentService) => {
      spyOn(api, 'deleteAnnotation').and.returnValues(of(null));
      spyOn(commentService, 'updateUnsavedCommentsStatus');
      const annotations = JSON.parse(JSON.stringify(annotationSet.annotations));
      const annotation = annotations[0];

      component.onAnnotationDelete(annotation);

      expect(commentService.updateUnsavedCommentsStatus).toHaveBeenCalledWith(annotation, false);
    })
  );

  it('should initialise box-highlight on mousedown', inject([BoxHighlightCreateService], (highlightService) => {
    spyOn(highlightService, 'initBoxHighlight');
    component.drawMode = true;

    component.onInitBoxHighlight({} as MouseEvent);

    expect(highlightService.initBoxHighlight).toHaveBeenCalled();
  }));

  it('should not initialise box-highlight on mousedown if no annotationSet$ exists',
    inject([BoxHighlightCreateService], (highlightService) => {
      spyOn(highlightService, 'initBoxHighlight');
      component.drawMode = true;
      component.annotationSet = undefined;

      component.onInitBoxHighlight({} as MouseEvent);

      expect(highlightService.initBoxHighlight).not.toHaveBeenCalled();
    })
  );

  it('should not initialise box-highlight on mousedown if drawMode is off',
    inject([BoxHighlightCreateService], (highlightService) => {
      spyOn(highlightService, 'initBoxHighlight');
      component.drawMode = true;

      component.onInitBoxHighlight({} as MouseEvent);

      expect(highlightService.initBoxHighlight).toHaveBeenCalled();
    })
  );

  it('should update box-highlight on mousemove',
    inject([BoxHighlightCreateService], (highlightService) => {
      spyOn(highlightService, 'updateBoxHighlight');
      component.drawMode = true;

      component.onMouseMove({} as MouseEvent);

      expect(highlightService.updateBoxHighlight).toHaveBeenCalled();
    })
  );

  it('should not update box-highlight on mousemove if drawMode is off',
    inject([BoxHighlightCreateService], (highlightService) => {
      spyOn(highlightService, 'updateBoxHighlight');

      component.onMouseMove({} as MouseEvent);

      expect(highlightService.updateBoxHighlight).not.toHaveBeenCalled();
    })
  );

  it('should not update box-highlight on mousemove if no annotationSet$ exists',
    inject([BoxHighlightCreateService], (highlightService) => {
      spyOn(highlightService, 'updateBoxHighlight');
      component.annotationSet = undefined;

      component.onMouseMove({} as MouseEvent);

      expect(highlightService.updateBoxHighlight).not.toHaveBeenCalled();
    })
  );

  it('should create box-highlight on mouseup',
    inject([BoxHighlightCreateService], (highlightService) => {
      spyOn(highlightService, 'createBoxHighlight');
      component.drawMode = true;

      component.onCreateBoxHighlight();

      expect(highlightService.createBoxHighlight).toHaveBeenCalled();
    })
  );

  it('should not create box-highlight on mouseup if drawMode is off',
    inject([BoxHighlightCreateService], (highlightService) => {
      spyOn(highlightService, 'createBoxHighlight');

      component.onCreateBoxHighlight();

      expect(highlightService.createBoxHighlight).not.toHaveBeenCalled();
    })
  );

  it('should not create box-highlight on mouseup if no annotationSet$ exists',
    inject([BoxHighlightCreateService], (highlightService) => {
      spyOn(highlightService, 'createBoxHighlight');
      component.annotationSet = undefined;

      component.onCreateBoxHighlight();

      expect(highlightService.createBoxHighlight).not.toHaveBeenCalled();
    })
  );

  it('should save box-highlight',
    inject([BoxHighlightCreateService], (highlightService) => {
      spyOn(highlightService, 'saveBoxHighlight');
      component.page = 1;

      component.saveBoxHighlight({ page: 1 });

      expect(highlightService.saveBoxHighlight)
        .toHaveBeenCalledWith({ page: 1 }, component.annotationSet, component.page);
    })
  );

  it('should not save box-highlight from a different page',
    inject([BoxHighlightCreateService], (highlightService) => {
      spyOn(highlightService, 'saveBoxHighlight');
      component.page = 2;

      component.saveBoxHighlight({ page: 1 });

      expect(highlightService.saveBoxHighlight)
        .not.toHaveBeenCalledWith({ page: 1 }, component.annotationSet, component.page);
    })
  );

  it('should create text highlight',
    inject([TextHighlightCreateService, ViewerEventService], fakeAsync((highlightService, viewerEvents) => {
      spyOn(highlightService, 'createTextHighlight');
      component.ngOnInit();

      viewerEvents.textSelected({ page: 1 } as Highlight);
      tick();

      expect(highlightService.createTextHighlight)
        .toHaveBeenCalledWith({ page: 1 }, component.annotationSet,
        { zoom: component.zoom,
          rotate: component.rotate,
          pageHeight: component.height,
          pageWidth: component.width,
          number: component.page
        });
    })
  ));

  it('should use addToDOM method to set values', () => {
    const mockRealElement = document.createElement('div');
    const mockEventSource: PageEvent['source'] = {
      rotation: 0,
      scale: 50,
      div: mockRealElement
    };

    component.addToDOM(mockEventSource);
    expect(component.zoom).toEqual(mockEventSource.scale);
    expect(component.rotate).toEqual(mockEventSource.rotation);
    expect(component.width).toEqual(mockEventSource.div.clientHeight);
    expect(component.height).toEqual(mockEventSource.div.clientWidth);
    expect(mockEventSource.div.childNodes).toContain(component.container.nativeElement);
  });

  it('should add annotation to annotationset', () => {
    spyOn<any>(api, 'postAnnotation').and.callFake(fakeApi.postAnnotation);

    component.onAnnotationUpdate(fakeApi.returnedAnnotation);

    expect(component.selectedAnnotation).toEqual({ annotationId: fakeApi.returnedAnnotation.id, editable: false });
  });

  it('should return the correct class values', () => {
    component.drawMode = false;
    component.rotate = 0;

    let className = component.annotationSetClass();
    expect(className).toEqual(['rotation rot0', '']);

    component.drawMode = true;
    component.rotate = 90;

    className = component.annotationSetClass();
    expect(className).toEqual(['rotation rot90', 'drawMode']);
  });
});
