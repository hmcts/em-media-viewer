import { DragDirective } from './drag.directive';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

describe('DragScrollDirective', () => {
  let component: ImageViewerComponent;
  let fixture: ComponentFixture<ImageViewerComponent>;
  let imageElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DragDirective, ImageViewerComponent],
      imports: [HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(ImageViewerComponent);
    component = fixture.componentInstance;
    component.rotation = 0;
    component.enableAnnotations = false;
    component.height = '100px';
    component.url = 'https://images6.alphacoders.com/712/thumb-1920-712175.jpg';
    component.errorMessage = '';
    component.enableDragScroll = true;
    fixture.detectChanges();
    imageElement = fixture.debugElement.query(By.css('img'));
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new DragDirective(imageElement);
    expect(directive).toBeTruthy();
  });

  it('being able to drag the image around', () => {
    component.zoom = 5;
    console.log(fixture.debugElement.nativeElement);
    imageElement.nativeElement.scrollLeft = 50;
    imageElement.nativeElement.scrollTop = 50;

    const mouseDownEvent = createMouseEvent('mousedown', 500, 500, 500, 500);
    const mouseMoveEvent = createMouseEvent('mousemove', 250, 250, 250, 250);
    const mouseUpEvent = createMouseEvent('mouseup', 250, 250, 250, 250);

    imageElement.nativeElement.dispatchEvent(new Event('mousedown'));
    fixture.detectChanges();
    imageElement.nativeElement.dispatchEvent(mouseDownEvent);
    imageElement.nativeElement.dispatchEvent(mouseMoveEvent);
    imageElement.nativeElement.dispatchEvent(mouseUpEvent);

    expect(imageElement.nativeElement.scrollLeft).not.toEqual(50);
    expect(imageElement.nativeElement.scrollTop).not.toEqual(50);
  });

  function createMouseEvent(typeArg: string, screenX: number, screenY: number, clientX: number, clientY: number) {
    const mouseEvent = document.createEvent('MouseEvents');
    mouseEvent.initMouseEvent(
      typeArg,
      true,
      true,
      window,
      1,
      screenX,
      screenY,
      clientX,
      clientY,
      false,
      false,
      false,
      false,
      0,
      null
    );
    return mouseEvent;
  }
});
