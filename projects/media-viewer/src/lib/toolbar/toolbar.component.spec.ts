import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarComponent } from './toolbar.component';
import { By } from '@angular/platform-browser';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [ ToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enable buttons', () => {
    const button = fixture.debugElement.nativeElement.querySelector('.toolbar-search-prev');
    expect(button.disabled).toBe(true);

    const text = fixture.debugElement.nativeElement.querySelector('input[type=text]');
    text.value = 'Search';
    fixture.detectChanges();

    const buttons2 = fixture.debugElement.nativeElement.querySelector('.toolbar-search-prev');
    expect(buttons2.disabled).toBe(false);
  });
});
