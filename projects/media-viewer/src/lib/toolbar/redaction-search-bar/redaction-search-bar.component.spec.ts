
import { async, ComponentFixture, TestBed, waitForAsync, fakeAsync, tick, flush, inject } from '@angular/core/testing';
import { RedactionSearchBarComponent } from './redaction-search-bar.component';
import { HighlightCreateService } from '../../annotations/annotation-set/annotation-create/highlight-create/highlight-create.service';
import { SearchResultsCount, ToolbarEventService } from '../toolbar-event.service';
import { ToolbarButtonVisibilityService } from '../toolbar-button-visibility.service';
import { Subject, of } from 'rxjs';
import { RedactionSearch } from './redaction-search.model';
import { Store, StoreModule } from '@ngrx/store';
import { reducers } from '../../store/reducers/reducers';
import { Rectangle } from '../../annotations/annotation-set/annotation-view/rectangle/rectangle.model';
import { ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

describe('RedactionSearchBarComponent', () => {
  let component: RedactionSearchBarComponent;
  let fixture: ComponentFixture<RedactionSearchBarComponent>;
  const redactionSerachSubject: Subject<RedactionSearch> = new Subject<RedactionSearch>();
  const searchResultsCountSubject: Subject<SearchResultsCount> = new Subject<SearchResultsCount>();
  const openRedactionSearch: Subject<boolean> = new Subject<boolean>();
  const mockHighlightService = { saveAnnotation: () => { }, applyRotation: () => { } };
  const mockStore = {
    select: () => of([{
      styles: { height: 100, width: 100 },
      scaleRotation: { scale: 1, rotation: 0 }
    }]),
    dispatch: (actualAction) => { },
    pipe: () => of({ annotationSetId: 'annotationSetId', documentId: 'documentId' })
  } as any;
  let nativeElement, searchInput;


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RedactionSearchBarComponent],
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('media-viewer', reducers),
        FormsModule
      ],
      providers: [
        {
          provide: HighlightCreateService,
          useValue: mockHighlightService
        },
        {
          provide: ToolbarEventService, useValue: {
            redactionSerachSubject: redactionSerachSubject.asObservable(),
            searchResultsCountSubject: searchResultsCountSubject.asObservable(),
            openRedactionSearch: openRedactionSearch.asObservable(),
            redactAllInProgressSubject: { next: () => { }, asObservable: () => { }, subscribe: () => { } },
            searchBarHidden: { next: () => { } },
            search: () => { },
          }
        },
        ToolbarButtonVisibilityService,
        { provide: Store, useValue: mockStore }
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(RedactionSearchBarComponent);
    component = fixture.componentInstance;
    component.openSearchModal = true;
    fixture.detectChanges();
    component.allPages = {
      2: {
        numberOfPages: 2,
        styles: { left: '100', height: '100', width: '100' },
        scaleRotation: { scale: '100', rotation: '100' },
        viewportScale: 1
      }
    };
    nativeElement = fixture.debugElement.nativeElement;


    fixture.detectChanges();
  });


  it('should search with reset set to true', inject([Store], (store) => {
    spyOn(component.toolbarEvents, 'search');
    spyOn(store, 'dispatch');
    component.search(true);
    expect(component.toolbarEvents.search).toHaveBeenCalledTimes(1);
    expect(component.redactAll).toBeFalse();
  }));

  it('should search with reset set false', inject([Store], (store) => {
    spyOn(component.toolbarEvents, 'search');
    spyOn(component.toolbarEvents.redactAllInProgressSubject, 'next');
    component.search(false);
    expect(component.toolbarEvents.search).toHaveBeenCalledTimes(1);
    expect(component.redactAll).toBeTrue();
    expect(component.redactElements).toEqual([]);
  }));

  it('should redact all search text', inject([Store], fakeAsync((store) => {
    const redactionSearch: RedactionSearch = {
      matchedIndex: 1,
      matchesCount: 1,
      page: 1
    };
    component.redactAll = true;
    const htmlElement = jasmine.createSpyObj<HTMLElement>('HTMLElement', ['getBoundingClientRect'], { parentElement: null });
    const htmlElement2 = jasmine.createSpyObj<HTMLElement>('HTMLElement', ['getBoundingClientRect'], { parentElement: htmlElement });
    const element = jasmine.createSpyObj<Element>('Element', ['getBoundingClientRect'], { parentElement: htmlElement2 });
    spyOn(document, 'getElementsByClassName').withArgs('highlight selected').and.returnValue([element] as any);
    const range = jasmine.createSpyObj<Range>('Range', ['setStart', 'setEnd', 'getBoundingClientRect', 'cloneRange', 'selectNodeContents']);
    spyOn(document, 'createRange').and.returnValue(range);
    const selection = jasmine.createSpyObj<Selection>('Selection', ['addRange', 'getRangeAt', 'removeAllRanges'],
      { rangeCount: 1, isCollapsed: false });

    const range2 = jasmine.createSpyObj<Range>('Range', ['setStart', 'setEnd', 'getBoundingClientRect', 'cloneRange', 'selectNodeContents', 'getClientRects']);
    selection.getRangeAt.and.returnValue(range2);
    range2.cloneRange.and.returnValue(range2);
    const domRect = jasmine.createSpyObj<DOMRect>('DOMRect', [], { x: 100, y: 100, height: 100, width: 100 });
    range2.getClientRects.and.returnValue([domRect] as any);
    htmlElement.getBoundingClientRect.and.returnValue(domRect);
    spyOn(window, 'getSelection').and.returnValue(selection);

    spyOn(mockHighlightService, 'applyRotation').and.returnValue({ x: 100, y: 100, height: 100, width: 100 } as any);
    spyOn(store, 'dispatch').and.callThrough();


    redactionSerachSubject.next(redactionSearch);
    tick(100);


    expect(component.redactAllText).toBeNull();
    expect(component.redactAll).toBeFalse();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  })));

  it('should redact search text if does not already exists', inject([Store], fakeAsync((store) => {
    const redactionSearch: RedactionSearch = {
      matchedIndex: 1,
      matchesCount: 1,
      page: 1
    };
    component.redactAll = true;

    component.redactElements = [{
      page: 2,
      matchedIndex: 1,
      rectangles: [{ x: 100, y: 100, height: 100, width: 100, annotationId: 'annotationId' } as Rectangle]
    }];
    const htmlElement = jasmine.createSpyObj<HTMLElement>('HTMLElement', ['getBoundingClientRect'], { parentElement: null });
    const htmlElement2 = jasmine.createSpyObj<HTMLElement>('HTMLElement', ['getBoundingClientRect'], { parentElement: htmlElement });
    const element = jasmine.createSpyObj<Element>('Element', ['getBoundingClientRect'], { parentElement: htmlElement2 });
    spyOn(document, 'getElementsByClassName').withArgs('highlight selected').and.returnValue([element] as any);
    const range = jasmine.createSpyObj<Range>('Range', ['setStart', 'setEnd', 'getBoundingClientRect', 'cloneRange', 'selectNodeContents']);
    spyOn(document, 'createRange').and.returnValue(range);
    const selection = jasmine.createSpyObj<Selection>('Selection', ['addRange', 'getRangeAt', 'removeAllRanges'],
      { rangeCount: 1, isCollapsed: false });

    const range2 = jasmine.createSpyObj<Range>('Range', ['setStart', 'setEnd', 'getBoundingClientRect', 'cloneRange', 'selectNodeContents', 'getClientRects']);
    selection.getRangeAt.and.returnValue(range2);
    range2.cloneRange.and.returnValue(range2);
    const domRect = jasmine.createSpyObj<DOMRect>('DOMRect', [], { x: 100, y: 100, height: 100, width: 100 });
    range2.getClientRects.and.returnValue([domRect] as any);
    htmlElement.getBoundingClientRect.and.returnValue(domRect);
    spyOn(window, 'getSelection').and.returnValue(selection);

    spyOn(mockHighlightService, 'applyRotation').and.returnValue({ x: 100, y: 100, height: 100, width: 100 } as any);
    spyOn(store, 'dispatch').and.callThrough();


    redactionSerachSubject.next(redactionSearch);
    tick(100);


    expect(component.redactAllText).toBeNull();
    expect(component.redactAll).toBeFalse();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  })));

  it('should close the searchbar on escape', fakeAsync(() => {

    component.toolbarEvents.searchBarHidden.next(false);
    tick(200);
    component.findInput = jasmine.createSpyObj<ElementRef>('ElementRef', ['nativeElement']);
    component.findInput.nativeElement = jasmine.createSpyObj<HTMLInputElement>('HTMLInputElement', ['focus', 'dispatchEvent']);
    searchInput = component.findInput.nativeElement;
    fixture.detectChanges();

    const searchbar = nativeElement.querySelector('.searchbar');
    expect(searchbar.getAttribute('hidden')).toBeNull();

    const event = new KeyboardEvent('keydown', { 'key': 'Escape' });
    searchInput.dispatchEvent(event);
    fixture.detectChanges();

    expect(searchbar.getAttribute('hidden')).toBeDefined();
  }));
});
