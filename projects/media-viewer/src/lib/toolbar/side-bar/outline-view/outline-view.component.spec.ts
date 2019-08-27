import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutlineViewComponent } from './outline-view.component';

describe('OutlineViewComponent', () => {
  let component: OutlineViewComponent;
  let fixture: ComponentFixture<OutlineViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutlineViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutlineViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
