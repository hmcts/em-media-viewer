import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { RectangleComponent } from './rectangle.component';
import { FormsModule } from '@angular/forms';
import { MutableDivModule } from 'mutable-div';
import { By } from '@angular/platform-browser';

describe('RectangleComponent', () => {
  let component: RectangleComponent;
  let fixture: ComponentFixture<RectangleComponent>;
  let rectangleEl: DebugElement;
  let nativeElement;

  const mockRectangle = {
      id: '16d5c513-15f9-4c39-8102-88bdb85d8831',
      createdBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
      createdByDetails: {
          'forename': 'Linus',
          'surname': 'Norton',
          'email': 'linus.norton@hmcts.net'
        },
      createdDate: '2018-05-28T08:48:33.206Z',
      lastModifiedBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
      lastModifiedByDetails: {
          'forename': 'Jeroen',
          'surname': 'Rijks',
          'email': 'jeroen.rijks@hmcts.net'
        },
      lastModifiedDate: '2019-05-28T08:48:33.206Z',
      annotationId: '123annotationId',
      height: 100,
      width: 50,
      x: 5,
      y: 10,
  };

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [
        RectangleComponent,
      ],
      imports: [
        FormsModule,
        MutableDivModule
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RectangleComponent);
    component = fixture.componentInstance;
    component.rectangle = mockRectangle;
    component.zoom = 1;
    component.rotate = 0;
    component.editable = true;
    component.selected = false;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    rectangleEl = fixture.debugElement.query(By.css('.rectangle'));
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should emit a click', () => {
    spyOn(component.select, 'emit');
    component.onClick();

    expect(component.select.emit).toHaveBeenCalledTimes(1);
  });

  it('should select the rectangle if select is true.', () => {
    spyOn(component.rectElement.nativeElement, 'focus');
    component._selected = true;
    component.ngAfterViewInit();
    expect(component.rectElement.nativeElement.focus).toHaveBeenCalledTimes(1);
  });

  it('should update the rectangle if moved', () => {
    const oldLeft = rectangleEl.nativeElement.offsetLeft;
    const oldTop = rectangleEl.nativeElement.offsetTop;

    const mouseDownEvent = createMouseEvent('mousedown', 500, 500, 500, 500);
    const mouseMoveEvent = createMouseEvent('mousemove', 750, 750, 900, 900);
    const mouseUpEvent = createMouseEvent('mouseup', 750, 800, 750, 800);

    rectangleEl.nativeElement.dispatchEvent(mouseDownEvent);
    rectangleEl.nativeElement.dispatchEvent(mouseMoveEvent);
    rectangleEl.nativeElement.dispatchEvent(mouseUpEvent);

    fixture.detectChanges();
    expect(rectangleEl.nativeElement.offsetLeft).not.toEqual(oldLeft);
    expect(rectangleEl.nativeElement.offsetTop).not.toEqual(oldTop);
  });

  it('should update the rectangle if resized', function () {
    const oldWidth = rectangleEl.nativeElement.offsetWidth;
    const oldHeight = rectangleEl.nativeElement.offsetHeight;

    const mouseDownEvent = createMouseEvent('mousedown', 500, 500, 500, 500);
    const mouseMoveEvent = createMouseEvent('mousemove', 750, 750, 900, 900);
    const mouseUpEvent = createMouseEvent('mouseup', 750, 800, 750, 800);

    rectangleEl.nativeElement.dispatchEvent(new Event('mousedown'));
    fixture.detectChanges();
    const bottomRightHandle = document.querySelector('.BOTTOM-RIGHT');
    bottomRightHandle.dispatchEvent(mouseDownEvent);
    bottomRightHandle.dispatchEvent(mouseMoveEvent);
    bottomRightHandle.dispatchEvent(mouseUpEvent);

    fixture.detectChanges();
    expect(rectangleEl.nativeElement.offsetWidth).not.toEqual(oldWidth);
    expect(rectangleEl.nativeElement.offsetHeight).not.toEqual(oldHeight);
  });

  it('should not update the rectangle if the rectangle did not change', function () {
    spyOn(component.update, 'emit');
    const oldLeft = rectangleEl.nativeElement.offsetLeft;
    const oldTop = rectangleEl.nativeElement.offsetTop;
    const oldWidth = rectangleEl.nativeElement.offsetWidth;
    const oldHeight = rectangleEl.nativeElement.offsetHeight;

    const mouseDownEvent = createMouseEvent('mousedown', 500, 500, 500, 500);
    const mouseMoveEvent = createMouseEvent('mousemove', 500, 500, 500, 500);
    const mouseUpEvent = createMouseEvent('mouseup', 500, 500, 500, 500);

    rectangleEl.nativeElement.dispatchEvent(mouseDownEvent);
    rectangleEl.nativeElement.dispatchEvent(mouseMoveEvent);
    rectangleEl.nativeElement.dispatchEvent(mouseUpEvent);

    fixture.detectChanges();
    expect(rectangleEl.nativeElement.offsetLeft).toEqual(oldLeft);
    expect(rectangleEl.nativeElement.offsetTop).toEqual(oldTop);
    expect(rectangleEl.nativeElement.offsetWidth).toEqual(oldWidth);
    expect(rectangleEl.nativeElement.offsetHeight).toEqual(oldHeight);
    expect(component.update.emit).not.toHaveBeenCalled();
  });

  it('should compare 2 rectangles values and see if its the same', function () {
    const rect = {
      offsetLeft: 100,
      offsetTop: 100,
      offsetWidth: 100,
      offsetHeight: 100
    };
    let hasRectChanged = component.hasRectangleChanged(mockRectangle, rect);
    expect(hasRectChanged).toEqual(true);

    hasRectChanged = component.hasRectangleChanged({x: 100, y: 100, width: 100, height: 100 }, rect);
    expect(hasRectChanged).toEqual(false);
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
