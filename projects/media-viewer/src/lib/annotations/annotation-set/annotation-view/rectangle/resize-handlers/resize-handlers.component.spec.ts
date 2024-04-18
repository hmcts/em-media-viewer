import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeHandlersComponent } from './resize-handlers.component';

describe('ResizeHandlersComponent', () => {
  let component: ResizeHandlersComponent;
  let fixture: ComponentFixture<ResizeHandlersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResizeHandlersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResizeHandlersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
