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
    const mockElement = document.createElement('div');
    const mockEventSource: PageEvent['source'] = {
      rotation: 0,
      scale: 50,
      div: mockElement
    };

    component.initialise(mockEventSource);
    expect(component.zoom).toEqual(mockEventSource.scale);
    expect(component.rotate).toEqual(mockEventSource.rotation);
    expect(component.width).toEqual(mockEventSource.div.clientHeight);
    expect(component.height).toEqual(mockEventSource.div.clientWidth);
    expect(mockEventSource.div.textContent).toContain(component.container.nativeElement.textContent);
  });

  fit('should create rectangles', async () => {
    component.page = 1;

    const mockElement: any = {
      parentElement: {
        getBoundingClientRect(): any {
          return mockClientRect;
        }
      }
    }

    const mockHighlight: any = {
      page: 1,
      event: {
        pageY: 10,
        pageX: 10,
        target: mockElement,
        srcElement: mockElement
      } as any,
    }

    const mockSelection: any = {
      rangeCount: 2,
      isCollapsed: false,
      getRangeAt(n: Number): any {
        return mockRange;
      },
      removeAllRanges(): any {
      }
    }

    const mockClientRect: any = {
    }

    const mockClientRects: any = [mockClientRect, mockClientRect];

    const mockAnnotationRectangle: any = {
      annotationId: 'id',
      height: 12,
      width: 5,
      x: 2,
      y: 3
    }

    const mockRange: any = {
      cloneRange(): any {
        return mockRange;
      },
      getClientRects(): any {
        return mockClientRects;
      }
    }

    spyOn(window, 'getSelection').and.returnValue(mockSelection);
    const createRectangleSpy = spyOn<any>(component, 'createRectangle').and.returnValue(mockAnnotationRectangle);
    const createAnnotationSpy = spyOn<any>(component, 'createAnnotation');
    const removeRangesSpy = spyOn(mockSelection, 'removeAllRanges');
    await component.createRectangles(mockHighlight);

    expect(createRectangleSpy).toHaveBeenCalledTimes(2);
    expect(createRectangleSpy).toHaveBeenCalledWith(mockClientRect, mockClientRect);
    expect(createAnnotationSpy).toHaveBeenCalledWith([mockAnnotationRectangle, mockAnnotationRectangle]);
    expect(removeRangesSpy).toHaveBeenCalled();
  });

});
