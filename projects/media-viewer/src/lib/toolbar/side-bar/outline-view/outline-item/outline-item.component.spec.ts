import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OutlineItemComponent } from './outline-item.component';
import { Outline } from '../outline.model';

describe('OutlineItemComponent', () => {
  let component: OutlineItemComponent;
  let fixture: ComponentFixture<OutlineItemComponent>;

  const outline: Outline = {
    bold: true,
    color: [],
    count: 1,
    dest: [],
    italic: true,
    items: [],
    newWindow: '',
    title: 'Outline',
    unsafeUrl: '',
    url: '',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutlineItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutlineItemComponent);
    component = fixture.componentInstance;
    component.outline = outline;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle outline true/false', () => {
    component.showOutlineItems = false;
    component.toggleOutline();

    expect(component.showOutlineItems).toEqual(true);

    component.toggleOutline();

    expect(component.showOutlineItems).toEqual(false);
  });
});
