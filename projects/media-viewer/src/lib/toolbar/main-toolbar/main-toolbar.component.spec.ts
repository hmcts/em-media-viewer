import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MainToolbarComponent } from './main-toolbar.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { reducers } from '../../store/reducers/reducers';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { StoreModule } from '@ngrx/store';
import { ToolbarButtonVisibilityService } from '../toolbar-button-visibility.service';
import { ToolbarEventService } from '../toolbar-event.service';
import { RouterTestingModule } from '@angular/router/testing';


describe('MainToolbarComponent', () => {
  let component: MainToolbarComponent;
  let fixture: ComponentFixture<MainToolbarComponent>;
  let nativeElement;
  let toolbarService: ToolbarEventService;

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [
        MainToolbarComponent,
        SearchBarComponent
      ],
      imports: [
        FormsModule,
        StoreModule.forFeature('media-viewer', reducers),
        StoreModule.forRoot({}),
        OverlayModule,
        RouterTestingModule
      ],
      providers: [ToolbarButtonVisibilityService, ToolbarEventService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainToolbarComponent);
    component = fixture.componentInstance;
    toolbarService = TestBed.inject(ToolbarEventService);
    nativeElement = fixture.debugElement.nativeElement;
    component.toolbarButtons.showHighlightButton = true;
    component.toolbarButtons.showDrawButton = true;
    component.toolbarButtons.showRotate = true;
    component.toolbarButtons.showZoom = true;
    component.toolbarButtons.showPrint = true;
    component.toolbarButtons.showDownload = true;
    component.toolbarButtons.showCommentSummary = true;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle searchbar visible', fakeAsync((done) => {
    component.toggleSearchBar();

    component.toolbarEvents.searchBarHidden.asObservable()
      .subscribe(
        searchBarHidden => expect(searchBarHidden).toBeFalsy()
        , error => done(error)
      );
  }));

  it('should get the page number of the current page', () => {
    component.ngOnInit();
    toolbarService.setCurrentPageInputValueSubject.next(2);

    expect(component.pageNumber).toEqual(2);
  });

  it('should not show sidebar', fakeAsync((done) => {
    component.toolbarEvents.sidebarOpen.asObservable()
      .subscribe(
        sidebarOpen => expect(sidebarOpen).toBeFalsy()
        , error => done(error)
      );
  }));

  it('should toggle sidebar open', fakeAsync((done) => {
    component.toggleSideBar();

    component.toolbarEvents.sidebarOpen.asObservable()
      .subscribe(
        sidebarOpen => expect(sidebarOpen).toBeTruthy()
        , error => done(error)
      );
  }));

  it('should not show searchbar', fakeAsync((done) => {
    component.toolbarEvents.searchBarHidden.asObservable()
      .subscribe(
        searchBarHidden => expect(searchBarHidden).toBeTruthy()
        , error => done(error)
      );
  }));

  it('should go to next page', () => {
    const pageChangerSpy = spyOn(component.toolbarEvents.changePageByDeltaSubject, 'next');
    component.increasePageNumber();
    expect(pageChangerSpy).toHaveBeenCalledWith(1);
  });

  it('should go to previous page', () => {
    const pageChangerSpy = spyOn(component.toolbarEvents.changePageByDeltaSubject, 'next');
    component.decreasePageNumber();
    expect(pageChangerSpy).toHaveBeenCalledWith(-1);
  });

  describe('onPageNumberInputChange', () => {
    it('should go to selected page', () => {
      const pageChangerSpy = spyOn(component.toolbarEvents.setCurrentPageSubject, 'next');
      component.pageCount = 21;
      component.onPageNumberInputChange('4');
      expect(pageChangerSpy).toHaveBeenCalledWith(4);
    });

    it('should emit pageNumber as 1 when given value < 1', () => {
      component.pageCount = 4;
      const setPageSpy = spyOn(toolbarService, 'setPage');
      component.onPageNumberInputChange('0');

      expect(setPageSpy).toHaveBeenCalledWith(1);
    });

    it('should emit pageCount value when provided value too big', () => {
      component.pageCount = 4;
      const setPageSpy = spyOn(toolbarService, 'setPage');
      component.onPageNumberInputChange('5');

      expect(setPageSpy).toHaveBeenCalledWith(4);
    });
  });

  it('should update page number', () => {
    component.toolbarEvents.setPage(4);
    expect(component.pageNumber).toEqual(4);
  });

  it('should start with both annotation modes deactivated', () => {
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--draw')).nativeElement).not.toHaveClass('toggled');
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--highlight')).nativeElement).not.toHaveClass('toggled');
  });

  it('should toggle on the highlight button', () => {
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--highlight')).nativeElement).not.toHaveClass('toggled');
    component.onClickHighlightToggle();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--highlight')).nativeElement).toHaveClass('toggled');
  });

  it('should toggle off the highlight button', () => {
    component.onClickHighlightToggle();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--highlight')).nativeElement).toHaveClass('toggled');
    component.onClickHighlightToggle();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--highlight')).nativeElement).not.toHaveClass('toggled');
  });

  it('should show the draw button if permitted', () => {
    component.toolbarButtons.showHighlightButton = true;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--draw')).nativeElement).toBeTruthy();
  });

  it('should toggle on the draw button', () => {
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--draw')).nativeElement).not.toHaveClass('toggled');
    component.onClickDrawToggle();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--draw')).nativeElement).toHaveClass('toggled');
  });

  it('should  toggle off the draw button', () => {
    component.onClickDrawToggle();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--draw')).nativeElement).toHaveClass('toggled');
    component.onClickDrawToggle();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--draw')).nativeElement).not.toHaveClass('toggled');
  });

  it('should turn draw mode off when highlight is selected', () => {
    component.onClickDrawToggle();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--draw')).nativeElement).toHaveClass('toggled');
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--highlight')).nativeElement).not.toHaveClass('toggled');
    component.onClickHighlightToggle();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--highlight')).nativeElement).toHaveClass('toggled');
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--draw')).nativeElement).not.toHaveClass('toggled');
  });

  it('should turn highlight mode off when draw is selected', () => {
    component.onClickHighlightToggle();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--highlight')).nativeElement).toHaveClass('toggled');
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--draw')).nativeElement).not.toHaveClass('toggled');
    component.onClickDrawToggle();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--draw')).nativeElement).toHaveClass('toggled');
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--highlight')).nativeElement).not.toHaveClass('toggled');
  });

  it('should emit rotate event with 90 degrees', () => {
    const rotateSpy = spyOn(component.toolbarEvents.rotateSubject, 'next');
    const rotateClkwiseBtn = nativeElement.querySelector('button[id=mvRotateRightBtn]');
    rotateClkwiseBtn.click();

    expect(rotateSpy).toHaveBeenCalledWith(90);
  });

  it('should emit rotate event with 270 degrees', () => {
    const rotateSpy = spyOn(component.toolbarEvents.rotateSubject, 'next');
    const rotateCtrClkwiseBtn = nativeElement.querySelector('button[id=mvRotateLeftBtn]');
    rotateCtrClkwiseBtn.click();

    expect(rotateSpy).toHaveBeenCalledWith(270);
  });

  it('should emit zoom out event', () => {
    const stepZoom = spyOn(component.toolbarEvents.stepZoomSubject, 'next');
    const zoomOutButton = nativeElement.querySelector('button[id=mvMinusBtn]');
    zoomOutButton.click();

    expect(stepZoom).toHaveBeenCalledWith(-0.1);
  });

  it('should emit zoom in event', () => {
    const stepZoom = spyOn(component.toolbarEvents.stepZoomSubject, 'next');
    const zoomInButton = nativeElement.querySelector('button[id=mvPlusBtn]');
    zoomInButton.click();

    expect(stepZoom).toHaveBeenCalledWith(0.1);
  });

  it('should emit zoom in event', () => {
    const zoomSpy = spyOn(component.toolbarEvents.zoomSubject, 'next');
    component.zoom('25');

    expect(zoomSpy).toHaveBeenCalledWith(25);
  });

  it('should emit print event', () => {
    const printSpy = spyOn(component.toolbarEvents.printSubject, 'next');
    const printButton = nativeElement.querySelector('button[id=mvPrintBtn]');
    printButton.click();

    expect(printSpy).toHaveBeenCalledWith();
  });

  it('should emit download event', () => {
    const downloadSpy = spyOn(component.toolbarEvents.downloadSubject, 'next');
    const downloadButton = nativeElement.querySelector('button[id=mvDownloadBtn]');
    downloadButton.click();

    expect(downloadSpy).toHaveBeenCalledWith();
  });

  it('should return true is contentType equals pdf', () => {
    component.contentType = 'pdf';

    expect(component.isPdf()).toBeTrue();
  });

  it('should invert toggleCommentsPanel value', () => {
    const value = toolbarService.commentsPanelVisible.getValue();
    const toggleCommentsPanelSpy = spyOn(toolbarService, 'toggleCommentsPanel');
    component.toggleCommentsPanel();

    expect(toggleCommentsPanelSpy).toHaveBeenCalledWith(!value);
  });

  it('should call toggleRedactionMode', () => {
    const toggleRedactionModeSpy = spyOn(toolbarService, 'toggleRedactionMode');
    component.toggleRedactBar();

    expect(toggleRedactionModeSpy).toHaveBeenCalled();
  });

  it('should call toggleGrabNDrag', () => {
    const toggleGrabNDragSpy = spyOn(toolbarService, 'toggleGrabNDrag');
    component.toggleGrabNDrag();

    expect(toggleGrabNDragSpy).toHaveBeenCalled();
  });
});
