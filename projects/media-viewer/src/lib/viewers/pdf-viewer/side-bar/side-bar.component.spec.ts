import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarComponent } from './side-bar.component';
import { OutlineItemComponent } from './outline-item/outline-item.component';

describe('OutlineViewComponent', () => {
  let component: SideBarComponent;
  let fixture: ComponentFixture<SideBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SideBarComponent, OutlineItemComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideBarComponent);
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
