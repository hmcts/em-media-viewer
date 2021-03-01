import { ComponentFixture, TestBed} from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { RectangleComponent } from './rectangle.component';
import { FormsModule } from '@angular/forms';
import { MutableDivModule } from 'mutable-div';
import { By } from '@angular/platform-browser';
import { HighlightCreateService } from '../../annotation-create/highlight-create/highlight-create.service';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../../../../store/reducers/reducers';

describe('RectangleComponent', () => {
  let component: RectangleComponent;
  let fixture: ComponentFixture<RectangleComponent>;
  let rectangleEl: DebugElement;
  let nativeElement;
  let mockRectangle;

  beforeEach(() => {
    mockRectangle = {
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
  });

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [RectangleComponent],
      imports: [
        FormsModule,
        MutableDivModule,
        StoreModule.forFeature('media-viewer', reducers),
        StoreModule.forRoot({})
      ],
      providers: [HighlightCreateService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RectangleComponent);
    component = fixture.componentInstance;
    component.annoRect = mockRectangle;
    component.pageHeight = 800;
    component.pageWidth = 400;
    component.zoom = 1;
    component.rotate = 0;
    component.editable = true;
    component.selected = false;
    component.enableGrabNDrag = false;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    rectangleEl = fixture.debugElement.query(By.css('.rectangle'));
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set dimentions on annoRect input with 0.5 zoom', () => {
    component.zoom = 0.5;
    component.annoRect = mockRectangle;

    expect(component.height).toBe(50);
    expect(component.width).toBe(25);
    expect(component.top).toBe(5);
    expect(component.left).toBe(2.5);
  });

  it('should maitain dimensions when rotation is zero', () => {
    component.zoom = 0.5;
    component.annoRect = mockRectangle;
    component.adjustForRotation(0);

    expect(component.height).toBe(50);
    expect(component.width).toBe(25);
    expect(component.top).toBe(5);
    expect(component.left).toBe(2.5);
  });

  it('should adjust dimensions when rotation is 90deg', () => {
    component.zoom = 0.5;
    component.annoRect = mockRectangle;
    component.adjustForRotation(90);

    expect(component.height).toBe(25);
    expect(component.width).toBe(50);
    expect(component.top).toBe(2.5);
    expect(component.left).toBe(345);
  });

  it('should adjust dimensions when rotation is 180deg', () => {
    component.zoom = 0.5;
    component.annoRect = mockRectangle;
    component.adjustForRotation(180);

    expect(component.height).toBe(50);
    expect(component.width).toBe(25);
    expect(component.top).toBe(745);
    expect(component.left).toBe(372.5);
  });

  it('should adjust dimensions when rotation is 270deg', () => {
    component.zoom = 0.5;
    component.annoRect = mockRectangle;
    component.adjustForRotation(270);

    expect(component.height).toBe(25);
    expect(component.width).toBe(50);
    expect(component.top).toBe(772.5);
    expect(component.left).toBe(5);
  });

  it('should emit a click', () => {
    spyOn(component.select, 'emit');
    component.onClick();

    expect(component.select.emit).toHaveBeenCalledTimes(1);
  });

  it('should update the rectangle if moved', () => {
    const oldLeft = rectangleEl.nativeElement.offsetLeft;
    const oldTop = rectangleEl.nativeElement.offsetTop;

    const pointerDownEvent = createPointerEvent('pointerdown', 500, 500, 500, 500);
    const pointerMoveEvent = createPointerEvent('pointermove', 750, 750, 900, 900);
    const pointerUpEvent = createPointerEvent('pointerup', 750, 800, 750, 800);

    rectangleEl.nativeElement.dispatchEvent(pointerDownEvent);
    rectangleEl.nativeElement.dispatchEvent(pointerMoveEvent);
    rectangleEl.nativeElement.dispatchEvent(pointerUpEvent);

    fixture.detectChanges();
    expect(rectangleEl.nativeElement.offsetLeft).not.toEqual(oldLeft);
    expect(rectangleEl.nativeElement.offsetTop).not.toEqual(oldTop);
  });

  it('should update the rectangle if resized', () => {
    const oldWidth = rectangleEl.nativeElement.offsetWidth;
    const oldHeight = rectangleEl.nativeElement.offsetHeight;

    const pointerDownEvent = createPointerEvent('pointerdown', 500, 500, 500, 500);
    const pointerMoveEvent = createPointerEvent('pointermove', 750, 750, 900, 900);
    const pointerUpEvent = createPointerEvent('pointerup', 750, 800, 750, 800);

    rectangleEl.nativeElement.dispatchEvent(new Event('pointerdown'));
    fixture.detectChanges();
    const bottomRightHandle = document.querySelector('.BOTTOM-RIGHT');
    bottomRightHandle.dispatchEvent(pointerDownEvent);
    bottomRightHandle.dispatchEvent(pointerMoveEvent);
    bottomRightHandle.dispatchEvent(pointerUpEvent);

    fixture.detectChanges();
    expect(rectangleEl.nativeElement.offsetWidth).not.toEqual(oldWidth);
    expect(rectangleEl.nativeElement.offsetHeight).not.toEqual(oldHeight);
  });

  it('should not update the rectangle if the rectangle did not change', () => {
    spyOn(component.update, 'emit');
    component.left = rectangleEl.nativeElement.offsetLeft;
    component.top = rectangleEl.nativeElement.offsetTop;
    component.width = rectangleEl.nativeElement.offsetWidth;
    component.height = rectangleEl.nativeElement.offsetHeight;

    const pointerDownEvent = createPointerEvent('pointerdown', 500, 500, 500, 500);
    const pointerMoveEvent = createPointerEvent('pointermove', 500, 500, 500, 500);
    const pointerUpEvent = createPointerEvent('pointerup', 500, 500, 500, 500);

    rectangleEl.nativeElement.dispatchEvent(pointerDownEvent);
    rectangleEl.nativeElement.dispatchEvent(pointerMoveEvent);
    rectangleEl.nativeElement.dispatchEvent(pointerUpEvent);

    fixture.detectChanges();
    expect(rectangleEl.nativeElement.offsetLeft).toEqual(component.left);
    expect(rectangleEl.nativeElement.offsetTop).toEqual(component.top);
    expect(rectangleEl.nativeElement.offsetWidth).toEqual(component.width);
    expect(rectangleEl.nativeElement.offsetHeight).toEqual(component.height);
    expect(component.update.emit).not.toHaveBeenCalled();
  });

  it('should compare 2 rectangles values and see if its the same', () => {
    const rect = {
      offsetLeft: 100,
      offsetTop: 100,
      offsetWidth: 100,
      offsetHeight: 100
    };
    let hasRectChanged = component.hasRectangleChanged(rect);
    expect(hasRectChanged).toEqual(true);

    component.top = 100;
    component.left = 100;
    component.height = 100;
    component.width = 100;
    hasRectChanged = component.hasRectangleChanged(rect);
    expect(hasRectChanged).toEqual(false);
  });

  function createPointerEvent(typeArg: string, screenX: number, screenY: number, clientX: number, clientY: number) {
    const pointerEvent = document.createEvent('MouseEvents');
    pointerEvent.initMouseEvent(
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
    return pointerEvent as PointerEvent;
  }
});
