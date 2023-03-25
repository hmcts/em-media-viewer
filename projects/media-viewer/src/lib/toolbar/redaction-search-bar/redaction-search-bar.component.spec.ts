
import { async, ComponentFixture, TestBed, waitForAsync, fakeAsync, tick, flush, inject } from '@angular/core/testing';
import { RedactionSearchBarComponent } from './redaction-search-bar.component';
import { HighlightCreateService } from '../../annotations/annotation-set/annotation-create/highlight-create/highlight-create.service';
import { SearchResultsCount, ToolbarEventService } from '../toolbar-event.service';
import { ToolbarButtonVisibilityService } from '../toolbar-button-visibility.service';
import { Subject, of } from 'rxjs';
import { RedactionSearch } from './redaction-search.model';
import { Store, StoreModule } from '@ngrx/store';
import { reducers } from '../../store/reducers/reducers';

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


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RedactionSearchBarComponent],
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('media-viewer', reducers),
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
    component.allPages = {
      2: {
        numberOfPages: 2,
        styles: { left: '100', height: '100', width: '100' },
        scaleRotation: { scale: '100', rotation: '100' },
        viewportScale: 1
      }
    };
    fixture.detectChanges();
  }));


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
    const domRect = jasmine.createSpyObj<DOMRect>('DOMRect', [], { top: 100, left: 100, height: 100, width: 100 });
    range2.getClientRects.and.returnValue([domRect] as any);
    htmlElement.getBoundingClientRect.and.returnValue(domRect);
    spyOn(window, 'getSelection').and.returnValue(selection);

    spyOn(mockHighlightService, 'applyRotation').and.returnValue({ top: 100, left: 100, height: 100, width: 100 } as any);
    spyOn(store, 'dispatch').and.callThrough();


    redactionSerachSubject.next(redactionSearch);
    tick(100);


    expect(component.redactAllText).toBeNull();
    expect(component.redactAll).toBeFalse();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  })));
});
