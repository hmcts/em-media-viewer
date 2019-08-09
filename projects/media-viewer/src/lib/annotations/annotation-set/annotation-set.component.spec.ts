import { AnnotationSetComponent } from './annotation-set.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RectangleComponent } from './annotation/rectangle/rectangle.component';
import { FormsModule } from '@angular/forms';
import { annotationSet } from '../../../assets/annotation-set';
import { PopupToolbarComponent } from './annotation/popup-toolbar/popup-toolbar.component';
import { AnnotationComponent } from './annotation/annotation.component';
import { AnnotationApiService } from '../annotation-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, Observable } from 'rxjs';
import { ElementRef } from '@angular/core';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { PageEvent } from '../../viewers/pdf-viewer/pdf-js/pdf-js-wrapper';
import {CommentComponent} from '../comment-set/comment/comment.component';
import { AnnotationService } from '../annotation.service';

describe('AnnotationSetComponent', () => {
  let component: AnnotationSetComponent;
  let fixture: ComponentFixture<AnnotationSetComponent>;

  const api = new AnnotationApiService({}  as any);
  const mockAnnotationService = new AnnotationService();

  const mockElement: any = {
    parentElement: {
      getBoundingClientRect(): unknown {
        return mockTextLayerRect;
      }
    }
  };

  const mockHighlight: any = {
    page: 1,
    event: {
      pageY: 10,
      pageX: 10,
      target: mockElement,
      srcElement: mockElement
    } as any,
  };

  const mockSelection: any = {
    rangeCount: 2,
    isCollapsed: false,
    getRangeAt(n: Number): any {
      return mockRange;
    },
    removeAllRanges(): any {
    }
  };

  const mockTextLayerRect: any = {
    top: 0,
    left: 0,
  };

  const mockClientRect: any = {
    top: 10,
    bottom: 100,
    left: 25,
    right: 100,
  };

  const mockClientRects: any = [mockClientRect, mockClientRect];

  const mockAnnotationRectangle: any = {
    annotationId: 'id',
    height: 12,
    width: 5,
    x: 2,
    y: 3
  };

  const mockRange: any = {
    cloneRange(): any {
      return mockRange;
    },
    getClientRects(): any {
      return mockClientRects;
    }
  };

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AnnotationSetComponent,
        AnnotationComponent,
        CommentComponent,
        RectangleComponent,
        PopupToolbarComponent
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
    }).compileComponents();

    fixture = TestBed.createComponent(AnnotationSetComponent);
    component = fixture.componentInstance;
    component.annotationSet = { ...annotationSet };
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
    const annotation = { ...annotationSet.annotations[0] };
    const spy = spyOn(api, 'postAnnotation').and.returnValues(of(annotation));

    annotation.color = 'red';
    component.onAnnotationUpdate(annotation);

    expect(spy).toHaveBeenCalledWith(annotation);
  });

  it('delete annotation', () => {
    spyOn(api, 'deleteAnnotation').and.returnValues(of(null));
    const annotations = { ...annotationSet.annotations };
    const annotation = { ...annotations[0] };

    component.onAnnotationDelete(annotation);

    expect(api.deleteAnnotation).toHaveBeenCalledWith(annotation.id);
    expect(annotations).not.toEqual(component.annotationSet.annotations);
  });

  it('starts drawing on mousedown', () => {
    component.newRectangle = new ElementRef(document.createElement('div'));
    component.toolbarEvents.drawMode.next(true);
    const initialiseNewRectSpy = spyOn<any>(component, 'initialiseNewRect').and.callThrough();
    component.onMouseDown({ pageY: 10, pageX: 10 } as MouseEvent);

    expect(initialiseNewRectSpy).toHaveBeenCalled();
    expect(component.newRectangle.nativeElement.style.left).toEqual('10px');
    expect(component.newRectangle.nativeElement.style.top).toEqual('10px');
  });

  it('does not mousedown if no annotationSet', () => {
    component.annotationSet = null;
    const initialiseNewRectSpy = spyOn<any>(component, 'initialiseNewRect');
    component.onMouseDown({ pageY: 10, pageX: 10 } as MouseEvent);
    expect(initialiseNewRectSpy).toHaveBeenCalledTimes(0);
  });

  it('does not mousedown if not in draw mode', () => {
    spyOn<any>(component.toolbarEvents, 'drawMode').and.returnValue(false);
    const initialiseNewRectSpy = spyOn<any>(component, 'initialiseNewRect');
    component.onMouseDown({ pageY: 10, pageX: 10 } as MouseEvent);
    expect(initialiseNewRectSpy).toHaveBeenCalledTimes(0);
  });

  it('finishes drawing on mouseup', () => {
    const annotation = Object.assign({}, annotationSet.annotations[0]);
    annotation.id = 'new';

    const spy = spyOn(api, 'postAnnotation').and.returnValues(of(annotation));

    component.newRectangle = new ElementRef(document.createElement('div'));
    component.toolbarEvents.drawMode.next(true);
    component.zoom = 1;
    component.onMouseDown({ pageY: 10, pageX: 10 } as MouseEvent);
    component.onMouseMove({ pageY: 100, pageX: 100 } as MouseEvent);
    component.onMouseUp();

    expect(spy).toHaveBeenCalled();
    expect(component.annotationSet.annotations[component.annotationSet.annotations.length - 1].id).toEqual('new');
  });

  it('should use initialise method to set values', () => {
    const mockRealElement = document.createElement('div');
    const mockEventSource: PageEvent['source'] = {
      rotation: 0,
      scale: 50,
      div: mockRealElement
    };

    component.initialise(mockEventSource);
    expect(component.zoom).toEqual(mockEventSource.scale);
    expect(component.rotate).toEqual(mockEventSource.rotation);
    expect(component.width).toEqual(mockEventSource.div.clientHeight);
    expect(component.height).toEqual(mockEventSource.div.clientWidth);
    expect(mockEventSource.div.childNodes).toContain(component.container.nativeElement  );
  });

  it('should create rectangles', async () => {
    spyOn(window, 'getSelection').and.returnValue(mockSelection);
    const createRectangleSpy = spyOn<any>(component, 'createRectangle').and.returnValue(mockAnnotationRectangle);
    const createAnnotationSpy = spyOn<any>(component, 'createAnnotation');
    const removeRangesSpy = spyOn(mockSelection, 'removeAllRanges');
    await component.createRectangles(mockHighlight);

    expect(createRectangleSpy).toHaveBeenCalledTimes(2);
    expect(createRectangleSpy).toHaveBeenCalledWith(mockClientRect, mockTextLayerRect);
    expect(createAnnotationSpy).toHaveBeenCalledWith([mockAnnotationRectangle, mockAnnotationRectangle]);
    expect(removeRangesSpy).toHaveBeenCalled();
  });

  it('should not create rectangles if not on right page', async () => {
    component.page = 2;
    const windowSpy = spyOn(window, 'getSelection');
    await component.createRectangles(mockHighlight);
    expect(windowSpy).toHaveBeenCalledTimes(0);
  });

  it('should not create rectangles if no window selection', async () => {
    spyOn(window, 'getSelection').and.returnValue(null);
    const createRectangleSpy = spyOn<any>(component, 'createRectangle');
    await component.createRectangles(mockHighlight);

    expect(createRectangleSpy).toHaveBeenCalledTimes(0);
    expect(createRectangleSpy).toHaveBeenCalledTimes(0);
  });

  it('should not create rectangles if no selection range count', async () => {
    spyOn<any>(mockSelection, 'rangeCount').and.returnValue(null);
    const cloneRangeSpy = spyOn(mockSelection, 'getRangeAt');
    await component.createRectangles(mockHighlight);
    expect(cloneRangeSpy).toHaveBeenCalledTimes(0);
  });

  it('should not create rectangles if no selection range count', async () => {
    spyOn<any>(mockSelection, 'isCollapsed').and.returnValue(true);
    const cloneRangeSpy = spyOn(mockSelection, 'getRangeAt');
    await component.createRectangles(mockHighlight);
    expect(cloneRangeSpy).toHaveBeenCalledTimes(0);
  });

  it('should add annotation to annotationset', async () => {
    spyOn(window, 'getSelection').and.returnValue(mockSelection);
    spyOn<any>(api, 'postAnnotation').and.callFake(fakeApi.postAnnotation);

    await component.createRectangles(mockHighlight);

    expect(component.selectedAnnotation).toEqual({ annotationId: fakeApi.returnedAnnotation.id, editable: false });

    const finalAnnotation = component.annotationSet.annotations[component.annotationSet.annotations.length - 1];
    const finalRectangle = finalAnnotation.rectangles[finalAnnotation.rectangles.length - 1];
    const expectedRectangle = fakeApi.returnedAnnotation.rectangles[1];
    expect(finalRectangle).toEqual(expectedRectangle);
  });

  it('should create unrotated rectangle', async () => {
    spyOn(window, 'getSelection').and.returnValue(mockSelection);
    spyOn<any>(api, 'postAnnotation').and.callFake(fakeApi.postAnnotation);

    await component.createRectangles(mockHighlight);

    const finalAnnotation = component.annotationSet.annotations[component.annotationSet.annotations.length - 1];
    const finalRectangle = finalAnnotation.rectangles[finalAnnotation.rectangles.length - 1];
    expect(finalRectangle.x).toEqual(25);
    expect(finalRectangle.y).toEqual(10);
    expect(finalRectangle.height).toEqual(90);
    expect(finalRectangle.width).toEqual(75);
  });

  it('should create 90 degree rotated rectangle', async () => {
    component.rotate = 90;
    spyOn(window, 'getSelection').and.returnValue(mockSelection);
    spyOn<any>(api, 'postAnnotation').and.callFake(fakeApi.postAnnotation);

    await component.createRectangles(mockHighlight);

    const finalAnnotation = component.annotationSet.annotations[component.annotationSet.annotations.length - 1];
    const finalRectangle = finalAnnotation.rectangles[finalAnnotation.rectangles.length - 1];
    expect(finalRectangle.x).toEqual(10);
    expect(finalRectangle.y).toEqual(300);
    expect(finalRectangle.height).toEqual(75);
    expect(finalRectangle.width).toEqual(90);
  });

  it('should create 180 degree rotated rectangle', async () => {
    component.rotate = 180;
    spyOn(window, 'getSelection').and.returnValue(mockSelection);
    spyOn<any>(api, 'postAnnotation').and.callFake(fakeApi.postAnnotation);

    await component.createRectangles(mockHighlight);

    const finalAnnotation = component.annotationSet.annotations[component.annotationSet.annotations.length - 1];
    const finalRectangle = finalAnnotation.rectangles[finalAnnotation.rectangles.length - 1];
    expect(finalRectangle.x).toEqual(100);
    expect(finalRectangle.y).toEqual(300);
    expect(finalRectangle.height).toEqual(90);
    expect(finalRectangle.width).toEqual(75);
  });

  it('should create 270 degree rotated rectangle', async () => {
    component.rotate = 270;
    spyOn(window, 'getSelection').and.returnValue(mockSelection);
    spyOn<any>(api, 'postAnnotation').and.callFake(fakeApi.postAnnotation);

    await component.createRectangles(mockHighlight);

    const finalAnnotation = component.annotationSet.annotations[component.annotationSet.annotations.length - 1];
    const finalRectangle = finalAnnotation.rectangles[finalAnnotation.rectangles.length - 1];
    expect(finalRectangle.x).toEqual(100);
    expect(finalRectangle.y).toEqual(25);
    expect(finalRectangle.height).toEqual(75);
    expect(finalRectangle.width).toEqual(90);
  });

  it('should calculate the new rectangle position', async () => {
    const rectangle = { top: 100, left: 100, height: -10, width: -10 };

    const newRectPos = component.calculateRectPos(rectangle.top, rectangle.left, rectangle.height, rectangle.width);

    expect(newRectPos).toEqual({ top: 90, left: 90, height: 10, width: 10 });
  });
});
