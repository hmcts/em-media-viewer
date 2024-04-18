import { DraggableElementDirective } from './draggable-element.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <div class="rectangle" style="left: 0; top: 0; width: 100px; height: 100px;" draggable [rotate]="rotate">
      Test Block
    </div>`
})
class TestComponent {
  rotate = 0;
}

describe('DraggableElementDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let divEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DraggableElementDirective, TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    divEl = fixture.debugElement.query(By.css('.rectangle'));
  });

  it('should create an instance', () => {
    const directive = new DraggableElementDirective(divEl);
    expect(directive).toBeTruthy();
  });

  it('select div and move', () => {
    dispatchEvent(0);
    expect(divEl.nativeElement.style.left).toBe('100px');
    expect(divEl.nativeElement.style.top).toBe('100px');
  });

  it('select div and move 90 degrees rotation', () => {
    dispatchEvent(90);
    expect(divEl.nativeElement.style.left).toBe('100px');
    expect(divEl.nativeElement.style.top).toBe('-100px');
  });

  it('select div and move 180 degrees rotation', () => {
    dispatchEvent(180);
    expect(divEl.nativeElement.style.left).toBe('-100px');
    expect(divEl.nativeElement.style.top).toBe('-100px');
  });

  it('select div and move 270 degrees rotation', () => {
    dispatchEvent(270);
    expect(divEl.nativeElement.style.left).toBe('-100px');
    expect(divEl.nativeElement.style.top).toBe('100px');
  });

  const dispatchEvent = (rotation: number) => {
    component.rotate = rotation;
    fixture.detectChanges();

    divEl.nativeElement.dispatchEvent(new MouseEvent('pointerdown', { clientX: 0, clientY: 0 }));
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 100, clientY: 100 }));
    window.dispatchEvent(new MouseEvent('pointerup'));
    fixture.detectChanges();
  };
});
