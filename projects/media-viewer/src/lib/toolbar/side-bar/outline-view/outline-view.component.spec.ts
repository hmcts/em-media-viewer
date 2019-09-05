import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutlineViewComponent } from './outline-view.component';
import { PdfJsWrapperFactory } from '../../../viewers/pdf-viewer/pdf-js/pdf-js-wrapper.provider';
import { SimpleChange } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';

describe('OutlineViewComponent', () => {
  let component: OutlineViewComponent;
  let fixture: ComponentFixture<OutlineViewComponent>;

  const pdfOutline = { lastToggleIsShow: false };
  const mockFactory = {
    createDocumentOutline: () => pdfOutline
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutlineViewComponent ],
      providers: [
        { provide: PdfJsWrapperFactory, useValue: mockFactory },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutlineViewComponent);
    component = fixture.componentInstance;
    component.url = 'assets/example4.pdf';
    fixture.detectChanges();
  });

  it('should create', () => {
    const renderOutlineView = new Promise<void>(() => {});
    spyOn(component, 'renderOutlineView').and.callFake(() => renderOutlineView);
    expect(component).toBeTruthy();
  });

  it('should call renderOutlineView', () => {
    const mockDocument = {
      getOutline: () => new Promise(resolve => {
        resolve({});
      })
    };
    const pdf = new Promise(resolve => {
      resolve(mockDocument);
    });
    pdfjsLib.getDocument = () => pdf;
    spyOn(component, 'renderOutlineView');

    component.ngAfterContentInit();

    expect(component.renderOutlineView).toHaveBeenCalled();
  });

  it('should call renderOutlineView and set the outline to empty when a new url is loaded', () => {
    const mockDocument = {
      getOutline: () => new Promise(resolve => {
        resolve({});
      })
    };
    const pdf = new Promise(resolve => {
      resolve(mockDocument);
    });
    pdfjsLib.getDocument = () => pdf;
    spyOn(component, 'renderOutlineView');

    component.url = 'assets/example3.pdf';
    component.ngOnChanges({
      url: new SimpleChange('a', 'b', true)
    });

    expect(component.renderOutlineView).toHaveBeenCalled();
  });

  it('should get the document outline and render it', async () => {
    spyOn(component, 'render');
    const mockDocument = {
      getOutline: () => new Promise(resolve => {
        resolve({});
      })
    };
    const pdf = new Promise(resolve => {
      resolve(mockDocument);
    });
    pdfjsLib.getDocument = () => pdf;
    await component.renderOutlineView();

    expect(component.render).toHaveBeenCalled();
  });

  it('should set the styles for outline', () => {
    const domElement = document.createElement('a');
    const outlineItem = { bold: true, italic: true };

    component.setStyles(domElement, outlineItem);

    expect(domElement.getAttribute('style')).toEqual('font-weight: bold;font-style: italic;');
  });

  it('should set the toggle buttons for outlines with sub items', () => {
    const domElement = document.createElement('div');
    const outlineItem = { count: 1, items: [] };

    component.addToggleButton(domElement, outlineItem);

    const domString = '<div class="outlineItemToggler outlineItemsHidden"></div>';
    expect(domElement.innerHTML).toEqual(domString);
  });

  it('should remove previous outline from the DOM', () => {
    component.outlineContainer.nativeElement.innerHTML = '<div></div><div></div><div></div><div></div>';

    component.resetOutline();

    expect(component.outlineContainer.nativeElement.innerHTML).toEqual('');
  });

  it('should render the outline', () => {
    spyOn(component, 'bindOutlineLink').and.callFake(() => {});
    const outline = [
      { bold: true, italic: true, url: 'a', newWindow: 'a', title: 'Outline', count: 1, dest: [], items: [] }];

    component.render({outline : outline});

    expect(component.outlineContainer.nativeElement.childElementCount).toBeGreaterThan(0);
  });

  it('should render the outline with nested outlines', async () => {
    const mockDocument = {
      getOutline: () => new Promise(resolve => {
        resolve({});
      })
    };
    const pdf = new Promise(resolve => {
      resolve(mockDocument);
    });
    pdfjsLib.getDocument = () => pdf;

    await component.renderOutlineView();

    spyOn(component, 'bindOutlineLink').and.callFake(() => {});
    const outlineItem1 = { bold: true, italic: true, url: 'a', newWindow: 'a', title: 'Outline item 1', count: 1, dest: [], items: [] };
    const outlineItem2 = { bold: true, italic: true, url: 'a', newWindow: 'a', title: 'Outline item 2', count: 1, dest: [], items: [] };
    const outline = [
      { bold: true, italic: true, url: 'a', newWindow: 'a', title: 'Outline', count: 1, dest: [], items: [outlineItem1, outlineItem2] }];

    component.render({outline : outline});
  });
});
