import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OutlineItemComponent } from './outline-item.component';
import { Outline } from './outline.model';

describe('OutlineItemComponent', () => {
  let component: OutlineItemComponent;
  let fixture: ComponentFixture<OutlineItemComponent>;

  const outline: Outline = {
    bold: true,
    color: new Uint8ClampedArray(2),
    count: 1,
    dest: [],
    italic: true,
    items: [],
    newWindow: false,
    pageNumber: 0,
    title: 'Outline',
    unsafeUrl: '',
    url: '',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OutlineItemComponent]
    })
      .compileComponents();
    fixture = TestBed.createComponent(OutlineItemComponent);
    component = fixture.componentInstance;
    component.outline = outline;
    component.outline.dest = [];
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

  it('should emit navigation event', () => {
    const navigateSpy = spyOn(component.navigationEvent, 'emit');

    component.goToDestination(outline.dest);

    expect(navigateSpy).toHaveBeenCalled();
  });

  it('should not emit navigation event', () => {
    const navigateSpy = spyOn(component.navigationEvent, 'emit');
    component.outline.dest = undefined;

    component.goToDestination(outline.dest);

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should identify if currently viewed item', () => {
    outline.pageNumber = 1;
    component.currentPageNumber = 1;
    component.endPage = 3;
    expect(component.isViewedItem(outline, undefined)).toBe(true);
    component.currentPageNumber = 2;
    expect(component.isViewedItem(outline, undefined)).toBe(true);
    component.currentPageNumber = 0;
    expect(component.isViewedItem(outline, undefined)).toBe(false);
    component.currentPageNumber = 3;
    expect(component.isViewedItem(outline, undefined)).toBe(false);

    const nextOutline = <Outline>{};
    nextOutline.pageNumber = 2;
    component.currentPageNumber = 1;
    expect(component.isViewedItem(outline, nextOutline)).toBe(true);
    component.currentPageNumber = 2;
    expect(component.isViewedItem(outline, nextOutline)).toBe(false);
  });

  it('should find the ending page number', () => {
    component.endPage = Math.floor(Math.random() * 1000);
    expect(component.findEndPage(undefined)).toBe(component.endPage);
    const nextOutline = <Outline>{};
    nextOutline.pageNumber = Math.floor(Math.random() * 10000);
    expect(component.findEndPage(nextOutline)).toBe(nextOutline.pageNumber);
  });
});
