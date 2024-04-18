import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ResizableElementDirective } from './resizable-element.directive';
import { ResizeHandlersComponent } from './resize-handlers/resize-handlers.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DraggableElementDirective } from './draggable-element.directive';

@Component({
  template: `
    <div class="rectangle" style="left: 0; top: 0; width: 100px; height: 100px;" mv-resizable [rotate]="rotate" [selected]="selected">
      Test Block
    </div>`
})
class TestComponent {
  rotate = 0;
  selected = false;
}

describe('ResizableElementDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let divEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResizableElementDirective, ResizeHandlersComponent, DraggableElementDirective, TestComponent]
    })
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    divEl = fixture.debugElement.query(By.css('.rectangle'));
  });

  it('select div and handle bars should appear', () => {
    divEl.nativeElement.dispatchEvent(new MouseEvent('pointerdown'));
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.resize-handlers'))).toBeTruthy();

    divEl.nativeElement.dispatchEvent(new MouseEvent('pointerup'));
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.resize-handlers'))).toBeTruthy();
  });

  it('select div and handle bars should disappear when selecting else where', () => {
    divEl.nativeElement.dispatchEvent(new MouseEvent('pointerdown'));
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.resize-handlers'))).toBeTruthy();

    document.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.resize-handlers'))).toBeFalsy();
  });

  it('select div and resize', () => {
    dispatchEvent(0, '.BOTTOM-RIGHT');

    expect(divEl.nativeElement.style.width).toBe('200px');
    expect(divEl.nativeElement.style.height).toBe('200px');
  });

  it('select div and resize with rotation 90 degrees', () => {
    dispatchEvent(90, '.TOP-RIGHT');

    expect(divEl.nativeElement.style.width).toBe('200px');
    expect(divEl.nativeElement.style.height).toBe('200px');
  });

  it('select div and resize with rotation 180 degrees', () => {
    dispatchEvent(180, '.TOP-LEFT');

    expect(divEl.nativeElement.style.width).toBe('200px');
    expect(divEl.nativeElement.style.height).toBe('200px');
  });

  it('select div and resize with rotation 270 degrees', () => {
    dispatchEvent(270, '.BOTTOM-LEFT');

    expect(divEl.nativeElement.style.width).toBe('200px');
    expect(divEl.nativeElement.style.height).toBe('200px');
  });

  const dispatchEvent = (rotation: number, handlebar: string) => {
    component.rotate = rotation;
    fixture.detectChanges();

    divEl.nativeElement.dispatchEvent(new MouseEvent('pointerdown'));
    fixture.detectChanges();

    const topRightHandle = fixture.debugElement.query(By.css(handlebar));

    topRightHandle.nativeElement.dispatchEvent(new MouseEvent('pointerdown', { clientX: 0, clientY: 0 }));
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 100, clientY: 100 }));
    document.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }));
    fixture.detectChanges();
  };
});
