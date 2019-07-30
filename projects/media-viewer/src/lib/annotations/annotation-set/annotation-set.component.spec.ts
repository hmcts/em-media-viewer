import { AnnotationSetComponent } from './annotation-set.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentComponent } from './annotation/comment/comment.component';
import { RectangleComponent } from './annotation/rectangle/rectangle.component';
import { FormsModule } from '@angular/forms';
import { AngularDraggableModule } from 'angular2-draggable';
import { annotationSet } from '../../../assets/annotation-set';
import { PopupToolbarComponent } from './annotation/popup-toolbar/popup-toolbar.component';
import { AnnotationComponent } from './annotation/annotation.component';
import { AnnotationApiService } from '../annotation-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ElementRef } from '@angular/core';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { PageEvent } from '../../viewers/pdf-viewer/pdf-js/pdf-js-wrapper';

describe('AnnotationSetComponent', () => {
  let component: AnnotationSetComponent;
  let fixture: ComponentFixture<AnnotationSetComponent>;

  const api = new AnnotationApiService({}  as any);

  const mocks: any = {
    mockElement: {
      parentElement: {
        getBoundingClientRect(): any {
          return mocks.mockClientRect;
        }
      }
    },
    mockClientRects: [],
    mockHighlight: {
      page: 1,
      event: {
        pageY: 10,
        pageX: 10,
        target: null,
        srcElement: null
      } as any,
    },
    mockSelection: {
      rangeCount: 2,
      isCollapsed: false,
      getRangeAt(n: Number): any {
        return mocks.mockRange;
      },
      removeAllRanges(): any {
      }
    },
    mockClientRect: {
      top: 10,
      bottom: 20,
      left: 15,
      right: 30,
    },
    mockAnnotationRectangle: {
      annotationId: 'id',
      height: 12,
      width: 5,
      x: 2,
      y: 3
    },
    mockRange: {
      cloneRange(): any {
        return mocks.mockRange;
      },
      getClientRects(): any {
        return mocks.mockClientRects;
      }
    },
    mockRectangle: {
      annotationId: '12345',
      height: 50,
      width: 40,
      x: 30,
      y: 20
    }
  }

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
        AngularDraggableModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AnnotationApiService, useValue: api },
        ToolbarEventService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AnnotationSetComponent);
    component = fixture.componentInstance;
    component.annotationSet = { ...annotationSet };
    component.page = 1;
    fixture.detectChanges();

    mocks.mockHighlight.target = mocks.mockElement;
    mocks.mockHighlight.srcElement = mocks.mockElement;
    mocks.mockClientRects = [mocks.mockClientRect, mocks.mockClientRect];
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
    component.onMouseDown({ pageY: 10, pageX: 10 } as MouseEvent);

    expect(component.newRectangle.nativeElement.style.left).toEqual('10px');
    expect(component.newRectangle.nativeElement.style.top).toEqual('10px');
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
    expect(mockEventSource.div.textContent).toContain(component.container.nativeElement.textContent);
  });

  // fit('should create rectangles', async () => {
  //   spyOn(window, 'getSelection').and.returnValue(mocks.mockSelection);
  //   const createRectangleSpy = spyOn<any>(component, 'createRectangle').and.returnValue(mocks.mockAnnotationRectangle);
  //   const createAnnotationSpy = spyOn<any>(component, 'createAnnotation');
  //   const removeRangesSpy = spyOn(mocks.mockSelection, 'removeAllRanges');
  //   await component.createRectangles(mocks.mockHighlight);

  //   expect(createRectangleSpy).toHaveBeenCalledTimes(2);
  //   // expect(createRectangleSpy).toHaveBeenCalledWith(mocks.mockClientRect, mocks.mockClientRect);
  //   expect(createAnnotationSpy).toHaveBeenCalledWith([mocks.mockAnnotationRectangle, mocks.mockAnnotationRectangle]);
  //   expect(removeRangesSpy).toHaveBeenCalled();
  // });

  // it('should create unrotated rectangle', async () => {
  //   component.rotate = 0;
  //   const createRectangleSpy = spyOn<any>(component, 'createRectangle');
  //   const createAnnotationSpy = spyOn<any>(component, 'createAnnotation');
  //   const apiSpy = spyOn<any>(api, 'postAnnotation').and.returnValue(); // something
  //   // check that selected Annotation has changed
  //   // check that rotation is as expected in the annotation that's been set

  //   await component.createRectangles(mocks.mockHighlight);
  //   expect(createRectangleSpy).toHaveBeenCalledWith(mocks.mockClientRect);
  //   expect(createAnnotationSpy).toHaveBeenCalledWith(mocks.mockRectangle);

  //   //

  // });
});
