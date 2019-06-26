import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarLeftPaneComponent } from './left-pane.component';
import { ChangePageByDeltaOperation, SetCurrentPageOperation } from '../../shared/viewer-operations';
import { BehaviorSubject, Subject } from 'rxjs';
import {By} from '@angular/platform-browser';
import {ToolbarEventsService} from '../../shared/toolbar-events.service';

describe('ToolbarLeftPaneComponent', () => {
  let component: ToolbarLeftPaneComponent;
  let fixture: ComponentFixture<ToolbarLeftPaneComponent>;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [ ToolbarLeftPaneComponent ],
      providers: [ToolbarEventsService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarLeftPaneComponent);
    component = fixture.componentInstance;
    component.showHighlightBtn = true;
    component.sidebarOpen = new BehaviorSubject(false);
    component.searchBarHidden = new BehaviorSubject(true);
    component.drawMode = false;
    component.highlightMode = false;
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

  it('should start with both annotation modes deactivated', () => {
    expect(component.highlightMode).toBeFalsy();
    expect(component.drawMode).toBeFalsy();
  });

  it('should toggle on the highlight button', () => {
    expect(component.highlightMode).toBeFalsy();
    component.onClickHighlightToggle();
    expect(component.highlightMode).toBeTruthy();
  });

  it('should toggle off the highlight button', () => {
    component.onClickHighlightToggle();
    expect(component.highlightMode).toBeTruthy();
    component.onClickHighlightToggle();
    expect(component.highlightMode).toBeFalsy();
  });

  it('should show the draw button if permitted', () => {
    component.showHighlightBtn = true;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.drawBtn')).nativeElement).toBeTruthy();
  });

  it('should toggle on the draw button', () => {
    expect(component.drawMode).toBeFalsy();
    component.onClickDrawToggle();
    expect(component.drawMode).toBeTruthy();
  });

  it('should  toggle off the draw button', () => {
    component.onClickDrawToggle();
    expect(component.drawMode).toBeTruthy();
    component.onClickDrawToggle();
    expect(component.drawMode).toBeFalsy();
  });

  it('should turn draw mode off when highlight is selected', () => {
    component.onClickDrawToggle();
    expect(component.drawMode).toBeTruthy();
    expect(component.highlightMode).toBeFalsy();
    component.onClickHighlightToggle();
    expect(component.highlightMode).toBeTruthy();
    expect(component.drawMode).toBeFalsy();
  });

  it('should turn highlight mode off when draw is selected', () => {
    component.onClickHighlightToggle();
    expect(component.highlightMode).toBeTruthy();
    expect(component.drawMode).toBeFalsy();
    component.onClickDrawToggle();
    expect(component.drawMode).toBeTruthy();
    expect(component.highlightMode).toBeFalsy();
  });

});
