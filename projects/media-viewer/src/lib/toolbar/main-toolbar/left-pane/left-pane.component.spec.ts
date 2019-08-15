import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarLeftPaneComponent } from './left-pane.component';
import { By } from '@angular/platform-browser';
import { ToolbarEventService } from '../../toolbar-event.service';
import { ToolbarButtonVisibilityService } from '../../toolbar-button-visibility.service';

describe('ToolbarLeftPaneComponent', () => {
  let component: ToolbarLeftPaneComponent;
  let fixture: ComponentFixture<ToolbarLeftPaneComponent>;
  let toolbarService: ToolbarEventService;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [ ToolbarLeftPaneComponent ],
      providers: [ ToolbarEventService, ToolbarButtonVisibilityService ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarLeftPaneComponent);
    component = fixture.componentInstance;
    toolbarService = TestBed.get(ToolbarEventService);
    component.toolbarButtons.showHighlightButton = true;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should get the page number of the current page', () => {
    component.ngOnInit();
    toolbarService.setCurrentPageInputValue.next(2);

    expect(component.pageNumber).toEqual(2);
  });

  it('should not show sidebar', async(() => {
    component.toolbarButtons.sidebarOpen.asObservable()
      .subscribe(sidebarOpen => expect(sidebarOpen).toBeFalsy());
  }));

  it('should toggle sidebar open', async(() => {
    component.toggleSideBar();

    component.toolbarButtons.sidebarOpen.asObservable()
      .subscribe(sidebarOpen => expect(sidebarOpen).toBeTruthy());
  }));

  it('should not show searchbar', async(() => {
    component.toolbarButtons.searchBarHidden.asObservable()
      .subscribe(searchBarHidden => expect(searchBarHidden).toBeTruthy());
  }));

  it('should toggle searchbar visible', async(() => {
    component.toggleSearchBar();

    component.toolbarButtons.searchBarHidden.asObservable()
      .subscribe(searchBarHidden => expect(searchBarHidden).toBeFalsy());
  }));

  it('should go to next page', () => {
    const pageChangerSpy = spyOn(component.toolbarEvents.changePageByDelta, 'next');
    component.increasePageNumber();
    expect(pageChangerSpy).toHaveBeenCalledWith(1);
  });

  it('should go to previous page', () => {
    const pageChangerSpy = spyOn(component.toolbarEvents.changePageByDelta, 'next');
    component.decreasePageNumber();
    expect(pageChangerSpy).toHaveBeenCalledWith(-1);
  });

  it('should go to selected page', () => {
    const pageChangerSpy = spyOn(component.toolbarEvents.setCurrentPage, 'next');
    component.onPageNumberInputChange('4');
    expect(pageChangerSpy).toHaveBeenCalledWith(4);
  });

  it('should update page number', () => {
    component.toolbarEvents.setCurrentPage.next(4);
    expect(component.pageNumber).toEqual(4);
  });

  it('should start with both annotation modes deactivated', () => {
    expect(fixture.debugElement.query(By.css('.drawBtn')).nativeElement).not.toHaveClass('toggled');
    expect(fixture.debugElement.query(By.css('.highlightBtn')).nativeElement).not.toHaveClass('toggled');
  });

  it('should toggle on the highlight button', () => {
    expect(fixture.debugElement.query(By.css('.highlightBtn')).nativeElement).not.toHaveClass('toggled');
    component.onClickHighlightToggle();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.highlightBtn')).nativeElement).toHaveClass('toggled');
  });

  it('should toggle off the highlight button', () => {
    component.onClickHighlightToggle();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.highlightBtn')).nativeElement).toHaveClass('toggled');
    component.onClickHighlightToggle();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.highlightBtn')).nativeElement).not.toHaveClass('toggled');
  });

  it('should show the draw button if permitted', () => {
    component.toolbarButtons.showHighlightButton = true;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.drawBtn')).nativeElement).toBeTruthy();
  });

  it('should toggle on the draw button', () => {
    expect(fixture.debugElement.query(By.css('.drawBtn')).nativeElement).not.toHaveClass('toggled');
    component.onClickDrawToggle();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.drawBtn')).nativeElement).toHaveClass('toggled');
  });

  it('should  toggle off the draw button', () => {
    component.onClickDrawToggle();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.drawBtn')).nativeElement).toHaveClass('toggled');
    component.onClickDrawToggle();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.drawBtn')).nativeElement).not.toHaveClass('toggled');
  });

  it('should turn draw mode off when highlight is selected', () => {
    component.onClickDrawToggle();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.drawBtn')).nativeElement).toHaveClass('toggled');
    expect(fixture.debugElement.query(By.css('.highlightBtn')).nativeElement).not.toHaveClass('toggled');
    component.onClickHighlightToggle();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.highlightBtn')).nativeElement).toHaveClass('toggled');
    expect(fixture.debugElement.query(By.css('.drawBtn')).nativeElement).not.toHaveClass('toggled');
  });

  it('should turn highlight mode off when draw is selected', () => {
    component.onClickHighlightToggle();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.highlightBtn')).nativeElement).toHaveClass('toggled');
    expect(fixture.debugElement.query(By.css('.drawBtn')).nativeElement).not.toHaveClass('toggled');
    component.onClickDrawToggle();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.drawBtn')).nativeElement).toHaveClass('toggled');
    expect(fixture.debugElement.query(By.css('.highlightBtn')).nativeElement).not.toHaveClass('toggled');
  });
});
