import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarLeftPaneComponent } from './left-pane.component';
import { ChangePageByDeltaOperation, SetCurrentPageOperation } from '../../events/viewer-operations';
import { BehaviorSubject, Subject } from 'rxjs';
import {By} from '@angular/platform-browser';

describe('ToolbarLeftPaneComponent', () => {
  let component: ToolbarLeftPaneComponent;
  let fixture: ComponentFixture<ToolbarLeftPaneComponent>;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [ ToolbarLeftPaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarLeftPaneComponent);
    component = fixture.componentInstance;
    component.sidebarOpen = new BehaviorSubject(false);
    component.searchBarHidden = new BehaviorSubject(true);
    component.changePageByDelta = new Subject<ChangePageByDeltaOperation>();
    component.setCurrentPage = new Subject<SetCurrentPageOperation>();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should not show sidebar', async(() => {
    component.sidebarOpen.asObservable()
      .subscribe(sidebarOpen => expect(sidebarOpen).toBeFalsy());
  }));

  it('should toggle sidebar open', async(() => {
    component.toggleSideBar();

    component.sidebarOpen.asObservable()
      .subscribe(sidebarOpen => expect(sidebarOpen).toBeTruthy());
  }));

  it('should not show searchbar', async(() => {
    component.searchBarHidden.asObservable()
      .subscribe(searchBarHidden => expect(searchBarHidden).toBeTruthy());
  }));

  it('should toggle searchbar visible', async(() => {
    component.toggleSearchBar();

    component.searchBarHidden.asObservable()
      .subscribe(searchBarHidden => expect(searchBarHidden).toBeFalsy());
  }));

  it('should go to next page', () => {
    const pageChangerSpy = spyOn(component.changePageByDelta, 'next');
    component.increasePageNumber();
    expect(pageChangerSpy).toHaveBeenCalledWith(new ChangePageByDeltaOperation(1));
  });

  it('should go to previous page', () => {
    const pageChangerSpy = spyOn(component.changePageByDelta, 'next');
    component.decreasePageNumber();
    expect(pageChangerSpy).toHaveBeenCalledWith(new ChangePageByDeltaOperation(-1));
  });

  it('should go to selected page', () => {
    const pageChangerSpy = spyOn(component.setCurrentPage, 'next');
    component.setCurrentPageNumber('4');
    expect(pageChangerSpy).toHaveBeenCalledWith(new SetCurrentPageOperation(4));
  });

  it('should update page number', () => {
    component.currentPage = new SetCurrentPageOperation(4);
    expect(component.pageNumber).toEqual(4);
  });

  it('should show the highlight button if permitted', () => {
    component.showHighlightBtn = true;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.highlightBtn')).nativeElement).toBeTruthy();
  });
});
