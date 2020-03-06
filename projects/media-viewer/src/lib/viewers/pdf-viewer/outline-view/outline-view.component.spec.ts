import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutlineViewComponent } from './outline-view.component';
import { OutlineItemComponent } from './outline-item/outline-item.component';

describe('OutlineViewComponent', () => {
  let component: OutlineViewComponent;
  let fixture: ComponentFixture<OutlineViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ OutlineViewComponent, OutlineItemComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutlineViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit navigation event', () => {
    const navigateSpy = spyOn(component.navigationEvent, 'emit');

    component.goToDestination({});

    expect(navigateSpy).toHaveBeenCalled();
  });

});
