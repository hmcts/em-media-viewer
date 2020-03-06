import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OutlineItemComponent } from './outline-item.component';
import { Outline } from '../outline.model';
import { PdfJsWrapperFactory } from '../../pdf-js/pdf-js-wrapper.provider';

describe('OutlineItemComponent', () => {
  let component: OutlineItemComponent;
  let fixture: ComponentFixture<OutlineItemComponent>;
  let pdfJsWrapper;

  const mockFactory = {
    navigateTo: () => {}
  };

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ OutlineItemComponent ],
      providers: [
        OutlineItemComponent,
        { provide: PdfJsWrapperFactory, useValue: mockFactory }
      ],
    })
    .compileComponents();
    pdfJsWrapper = TestBed.get(PdfJsWrapperFactory);
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

  it('should call navigateTo()', () => {
    const navigateSpy = spyOn(pdfJsWrapper, 'navigateTo');

    component.navigateLink();

    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('should not call navigateTo()', () => {
    const navigateSpy = spyOn(pdfJsWrapper, 'navigateTo');
    component.outline.dest = undefined;

    component.navigateLink();

    expect(navigateSpy).toHaveBeenCalledTimes(0);
  });
});
