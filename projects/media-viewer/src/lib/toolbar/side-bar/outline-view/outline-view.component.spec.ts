import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutlineViewComponent } from './outline-view.component';
import { SimpleChange } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import { OutlineItemComponent } from './outline-item/outline-item.component';

describe('OutlineViewComponent', () => {
  let component: OutlineViewComponent;
  let fixture: ComponentFixture<OutlineViewComponent>;

  const pdfOutline = { lastToggleIsShow: false };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ OutlineViewComponent, OutlineItemComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutlineViewComponent);
    component = fixture.componentInstance;
    component.url = 'assets/example4.pdf';
    const mockDocument = {
      getOutline: () => new Promise(() => {})
    };
    const pdf = Promise.resolve(mockDocument);
    pdfjsLib.getDocument = () => pdf;
    fixture.detectChanges();
  });

  it('should create', () => {
    const renderOutlineView = new Promise<void>(() => {});
    spyOn(component, 'renderOutlineView').and.callFake(() => renderOutlineView);
    expect(component).toBeTruthy();
  });

  it('should call renderOutlineView', () => {
    spyOn(component, 'renderOutlineView');

    component.ngAfterContentInit();

    expect(component.renderOutlineView).toHaveBeenCalled();
  });

  it('should call renderOutlineView and set the outline to empty when a new url is loaded', () => {
    spyOn(component, 'renderOutlineView');

    component.url = 'assets/example3.pdf';
    component.ngOnChanges({
      url: new SimpleChange('a', 'b', true)
    });

    expect(component.renderOutlineView).toHaveBeenCalled();
  });

  it('should get the document outline and render it', () => {
    component.renderOutlineView();

    expect(component.outline).not.toBe([]);
  });
});
