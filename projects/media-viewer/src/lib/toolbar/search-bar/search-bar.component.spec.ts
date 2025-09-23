import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';
import { FormsModule } from '@angular/forms';
import { ToolbarButtonVisibilityService } from '../toolbar-button-visibility.service';
import { ToolbarEventService } from '../toolbar-event.service';
import { RouterTestingModule } from '@angular/router/testing';
import { RpxTranslationModule } from 'rpx-xui-translation';;

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let nativeElement, searchInput;

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [SearchBarComponent],
      imports: [
        FormsModule,
        RouterTestingModule,
        RpxTranslationModule.forRoot({
          baseUrl: '',
          debounceTimeMs: 300,
          validity: {
            days: 1
          },
          testMode: true
        })
      ],
      providers: [ToolbarButtonVisibilityService, ToolbarEventService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    searchInput = component.findInput.nativeElement;

    searchInput.value = 'searchTerm';

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should not show searchbar', () => {
    component.toolbarEvents.searchBarHidden.next(true);
    fixture.detectChanges();

    const searchbar = nativeElement.querySelector('.searchbar');

    expect(searchbar.getAttribute('hidden')).toBeDefined();
  });

  it('should show searchbar after f3 keypress', fakeAsync(() => {
    component.toolbarEvents.searchBarHidden.next(true);
    fixture.detectChanges();

    const searchbar = nativeElement.querySelector('.searchbar');
    expect(searchbar.getAttribute('hidden')).toBeDefined();

    const event = new KeyboardEvent('keydown', { 'code': 'F3' });
    window.dispatchEvent(event);
    // Drain the 200ms focus timeout scheduled in onWindowKeyDown
    tick(200);
    fixture.detectChanges();

    expect(searchbar.getAttribute('hidden')).toBeNull();
    flush();
  }));

  it('should run search event', () => {
    const searchSpy = spyOn(component.toolbarEvents.searchSubject, 'next');
    component.searchText = 'searchTerm';
    const mockSearchOperation = {
      searchTerm: 'searchTerm',
      highlightAll: component.highlightAll,
      matchCase: component.matchCase,
      wholeWord: component.wholeWord,
      previous: false,
      reset: true
    };
    component.search();
    expect(searchSpy).toHaveBeenCalledWith(mockSearchOperation);
  });

  it('should close the searchbar on escape', () => {
    component.toolbarEvents.searchBarHidden.next(false);
    fixture.detectChanges();

    const searchbar = nativeElement.querySelector('.searchbar');
    expect(searchbar.getAttribute('hidden')).toBeNull();

    const event = new KeyboardEvent('keydown', { 'key': 'Escape' });
    searchInput.dispatchEvent(event);
    fixture.detectChanges();

    expect(searchbar.getAttribute('hidden')).toBeDefined();
  });

  it('should not close the searchbar on non-escape keypress)', () => {
    component.toolbarEvents.searchBarHidden.next(false);
    fixture.detectChanges();

    const searchbar = nativeElement.querySelector('.searchbar');
    expect(searchbar.getAttribute('hidden')).toBeNull();

    const event = new KeyboardEvent('keydown', { 'key': 'F' });
    searchInput.dispatchEvent(event);
    fixture.detectChanges();

    expect(searchbar.getAttribute('hidden')).toBeNull();
  });

  it('should emit search next event', () => {
    component.toolbarEvents.searchBarHidden.next(false);
    const searchSpy = spyOn(component.toolbarEvents.searchSubject, 'next');
    component.searchText = 'searchTerm';
    component.searchNext();

    const mockSearchOperation = {
      searchTerm: 'searchTerm',
      highlightAll: true,
      matchCase: false,
      wholeWord: false,
      previous: false,
      reset: false
    };

    expect(searchSpy).toHaveBeenCalledWith(mockSearchOperation);
  });

  it('should emit search previous event', () => {
    component.toolbarEvents.searchBarHidden.next(false);
    const searchSpy = spyOn(component.toolbarEvents.searchSubject, 'next');
    component.searchText = 'searchTerm';
    component.searchPrev();

    const mockSearchOperation = {
      searchTerm: 'searchTerm',
      highlightAll: true,
      matchCase: false,
      wholeWord: false,
      previous: true,
      reset: false
    };

    expect(searchSpy).toHaveBeenCalledWith(mockSearchOperation);
  });

  it('should set search result count with results found', fakeAsync(() => {

    component.toolbarEvents.searchResultsCountSubject.next({ current: 1, total: 4, isPrevious: false });
    fixture.detectChanges();

    const findNextEl = nativeElement.querySelector('#findNext') as HTMLAnchorElement;
    expect(findNextEl).toBeTruthy();

    const focusSpy = spyOn(findNextEl, 'focus');

    expect(component.resultCount).toBeTruthy();
    expect(component.resultsText).toEqual('Found 1 of 4');

    tick(1000);
    expect(focusSpy).toHaveBeenCalled();

    flush(); // safety
  }));

  it('should set search result count with no results found', () => {
    component.toolbarEvents.searchResultsCountSubject.next({ current: null, total: null, isPrevious: false });
    expect(component.resultCount).toBeFalsy();
    expect(component.resultsText).toEqual('No results found');
  });

  it('should toggle searchbar visible', () => {
    component.toolbarEvents.searchBarHidden.next(true);

    const values: boolean[] = [];
    const sub = component.toolbarEvents.searchBarHidden.asObservable()
      .subscribe(v => values.push(v));

    component.toggleSearchBar(); // flips true -> false synchronously

    expect(values[values.length - 1]).toBeFalse();
    sub.unsubscribe();
  });
});
