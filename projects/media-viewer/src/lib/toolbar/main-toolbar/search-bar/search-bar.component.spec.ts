import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';
import { FormsModule } from '@angular/forms';
import { ToolbarButtonVisibilityService } from '../../toolbar-button-visibility.service';
import { ToolbarEventService } from '../../toolbar-event.service';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let nativeElement, searchInput;

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [ SearchBarComponent ],
      imports: [FormsModule],
      providers: [ ToolbarButtonVisibilityService, ToolbarEventService ]
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

    const searchbar = nativeElement.querySelector('.findbar');

    expect(searchbar.className).toContain('hidden');
  });

  it('should show searchbar after f3 keypress', () => {
    component.toolbarEvents.searchBarHidden.next(true);
    fixture.detectChanges();

    const searchbar = nativeElement.querySelector('.findbar');
    expect(searchbar.className).toContain('hidden');

    const event = new KeyboardEvent('keydown', { 'code': 'F3' });
    window.dispatchEvent(event);
    fixture.detectChanges();

    expect(searchbar.className).not.toContain('hidden');
  });

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

    const searchbar = nativeElement.querySelector('.findbar');
    expect(searchbar.className).not.toContain('hidden');

    const event = new KeyboardEvent('keydown', { 'key': 'Escape' });
    searchInput.dispatchEvent(event);
    fixture.detectChanges();

    expect(searchbar.className).toContain('hidden');
  });

  it('should not close the searchbar on non-escape keypress)', () => {
    component.toolbarEvents.searchBarHidden.next(false);
    fixture.detectChanges();

    const searchbar = nativeElement.querySelector('.findbar');
    expect(searchbar.className).not.toContain('hidden');

    const event = new KeyboardEvent('keydown', { 'key': 'F' });
    searchInput.dispatchEvent(event);
    fixture.detectChanges();

    expect(searchbar.className).not.toContain('hidden');
  });

  it('should emit search next event', () => {
    component.toolbarEvents.searchBarHidden.next(false);
    const searchSpy = spyOn(component.toolbarEvents.searchSubject, 'next');
    component.searchText = 'searchTerm';
    const searchNextButton = nativeElement.querySelector('button[id=findNext]');
    searchNextButton.click();

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
    const searchPrevButton = nativeElement.querySelector('button[id=findPrevious]');
    searchPrevButton.click();

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

  it('should set search result count with results found', () => {
    component.toolbarEvents.searchResultsCountSubject.next({current: 1, total: 4});
    expect(component.haveResults).toBeTruthy();
    expect(component.resultsText).toEqual('1 of 4 matches');
  });

  it('should set search result count with no results found', () => {
    component.toolbarEvents.searchResultsCountSubject.next({current: null, total: null});
    expect(component.haveResults).toBeFalsy();
    expect(component.resultsText).toEqual('Phrase not found');
  });

});
