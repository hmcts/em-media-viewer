import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarLeftPaneComponent } from './left-pane.component';
import { ToolbarToggles } from '../../model/toolbar-toggles';
import { ActionEvents } from '../../model/action-events';
import { ChangePageByDeltaOperation, SetCurrentPageOperation } from '../../model/viewer-operations';

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
    component.actionEvents = new ActionEvents();
    component.toolbarToggles = new ToolbarToggles();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should not show sidebar', async(() => {
    component.toolbarToggles.sidebarOpen.asObservable()
      .subscribe(sidebarOpen => expect(sidebarOpen).toBeFalsy());
  }));

  it('should toggle sidebar open', async(() => {
    component.toggleSideBar();

    component.toolbarToggles.sidebarOpen.asObservable()
      .subscribe(sidebarOpen => expect(sidebarOpen).toBeTruthy());
  }));

  it('should not show searchbar', async(() => {
    component.toolbarToggles.searchBarHidden.asObservable()
      .subscribe(searchBarHidden => expect(searchBarHidden).toBeTruthy());
  }));

  it('should toggle searchbar visible', async(() => {
    component.toggleSearchBar();

    component.toolbarToggles.searchBarHidden.asObservable()
      .subscribe(searchBarHidden => expect(searchBarHidden).toBeFalsy());
  }));

  it('should go to next page', () => {
    const pageChangerSpy = spyOn(component.actionEvents.changePageByDelta, 'next');
    component.increasePageNumber();
    expect(pageChangerSpy).toHaveBeenCalledWith(new ChangePageByDeltaOperation(1));
  });

  it('should go to previous page', () => {
    const pageChangerSpy = spyOn(component.actionEvents.changePageByDelta, 'next');
    component.decreasePageNumber();
    expect(pageChangerSpy).toHaveBeenCalledWith(new ChangePageByDeltaOperation(-1));
  });

  it('should go to selected page', () => {
    const pageChangerSpy = spyOn(component.actionEvents.setCurrentPage, 'next');
    component.setCurrentPageNumber('4');
    expect(pageChangerSpy).toHaveBeenCalledWith(new SetCurrentPageOperation(4));
  });

});
