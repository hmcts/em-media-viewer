import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideBarComponent } from './side-bar.component';
import { OutlineViewComponent } from './outline-view/outline-view.component';
import { OutlineItemComponent } from './outline-view/outline-item/outline-item.component';

describe('SideBarComponent', () => {
  let component: SideBarComponent;
  let fixture: ComponentFixture<SideBarComponent>;

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [
        SideBarComponent,
        OutlineViewComponent,
        OutlineItemComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideBarComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
