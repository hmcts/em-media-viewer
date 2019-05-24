import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';
import { FormsModule } from '@angular/forms';
import { ActionEvents } from '../../model/action-events';
import { SearchOperation } from '../../model/viewer-operations';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let nativeElement, searchInput;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [ SearchBarComponent ],
      imports: [FormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    searchInput = component.findInput.nativeElement;
    searchInput.value = 'searchTerm';

    const actionEvents = new ActionEvents();
    component.searchEvents = actionEvents.search as any;
    component.searchBarHidden = false;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should not show searchbar', () => {
    component.searchBarHidden = true;
    fixture.detectChanges();

    const searchbar = nativeElement.querySelector('.findbar');

    expect(searchbar.className).toContain('hidden');
  });

  it('should show searchbar after f3 keypress', () => {
    component.searchBarHidden = true;
    fixture.detectChanges();

    const searchbar = nativeElement.querySelector('.findbar');
    expect(searchbar.className).toContain('hidden');

    const event = new KeyboardEvent('keydown', { 'code': 'F3' });
    window.dispatchEvent(event);
    fixture.detectChanges();

    expect(searchbar.className).not.toContain('hidden');
  });

  it('should run search event', () => {
    const searchSpy = spyOn(component.searchEvents, 'next');
    component.searchText = 'searchTerm';
    const mockSearchOperation = new SearchOperation(
      'searchTerm',
      component.highlightAll,
      component.matchCase,
      component.wholeWord,
      false,
      true
    );
    component.search();
    expect(searchSpy).toHaveBeenCalledWith(mockSearchOperation);
  });

  it('should close the searchbar on escape', () => {
    component.searchBarHidden = false;
    fixture.detectChanges();

    const searchbar = nativeElement.querySelector('.findbar');
    expect(searchbar.className).not.toContain('hidden');

    const event = new KeyboardEvent('keydown', { 'key': 'Escape' });
    searchInput.dispatchEvent(event);
    fixture.detectChanges();

    expect(searchbar.className).toContain('hidden');
  });

  it('should not close the searchbar on non-escape keypress)', () => {
    component.searchBarHidden = false;
    fixture.detectChanges();

    const searchbar = nativeElement.querySelector('.findbar');
    expect(searchbar.className).not.toContain('hidden');

    const event = new KeyboardEvent('keydown', { 'key': 'F' });
    searchInput.dispatchEvent(event);
    fixture.detectChanges();

    expect(searchbar.className).not.toContain('hidden');
  });

  it('should emit search next event', () => {
    component.searchBarHidden = false;
    const searchSpy = spyOn(component.searchEvents, 'next');
    component.searchText = 'searchTerm';
    const searchNextButton = nativeElement.querySelector('button[id=findNext]');
    searchNextButton.click();

    expect(searchSpy).toHaveBeenCalledWith(new SearchOperation('searchTerm', true, false, false, false, false));
  });

  it('should emit search previous event', () => {
    component.searchBarHidden = false;
    const searchSpy = spyOn(component.searchEvents, 'next');
    component.searchText = 'searchTerm';
    const searchPrevButton = nativeElement.querySelector('button[id=findPrevious]');
    searchPrevButton.click();

    expect(searchSpy).toHaveBeenCalledWith(new SearchOperation('searchTerm', true, false, false, true, false));
  });

  it('should set search result count with results found', () => {
    component.searchResultsCount = {current: 1, total: 4};
    expect(component.haveResults).toBeTruthy();
    expect(component.resultsText).toEqual('1 of 4 matches');
  });

  it('should set search result count with no results found', () => {
    component.searchResultsCount = {current: null, total: null};
    expect(component.haveResults).toBeFalsy();
    expect(component.resultsText).toEqual('Phrase not found');
  });

  it('should not set search result count if null is passed in', () => {
    component.haveResults = true;
    component.resultsText = 'unchanged string';
    component.searchResultsCount = null;
    expect(component.haveResults).toEqual(true);
    expect(component.resultsText).toEqual('unchanged string');
  });
});
