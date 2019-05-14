import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';
import { ActionEvents, SearchOperation } from '../../media-viewer.model';
import { BehaviorSubject } from 'rxjs';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let nativeElement, searchInput

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [ SearchBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    searchInput = nativeElement.querySelector('input[id=findInput]');
    searchInput.value = 'searchTerm';
    component.actionEvents = new ActionEvents();
    component.searchbarHidden = new BehaviorSubject<boolean>(false);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should not show searchbar', () => {
    const searchbar = nativeElement.querySelector('.findbar');

    expect(searchbar.className).toContain('hidden');
  });

  it('should emit search next event', () => {
    const searchSpy = spyOn(component.actionEvents.search, 'next');
    const searchNextButton = nativeElement.querySelector('button[id=findNext]');
    searchNextButton.click();

    expect(searchSpy).toHaveBeenCalledWith(new SearchOperation("searchTerm", false, false));
  });

  it('should emit search previous event', () => {
    const searchSpy = spyOn(component.actionEvents.search, 'next');
    const searchPrevButton = nativeElement.querySelector('button[id=findPrevious]');
    searchPrevButton.click();

    expect(searchSpy).toHaveBeenCalledWith(new SearchOperation("searchTerm", true, false));
  });
});
