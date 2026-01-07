import { RpxTranslationModule } from 'rpx-xui-translation';
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
import { ToolbarFocusService } from '../toolbar-focus.service';
import { RouterTestingModule } from '@angular/router/testing';


describe('MainToolbarComponent', () => {
  let component: MainToolbarComponent;
  let fixture: ComponentFixture<MainToolbarComponent>;
  let nativeElement;
  let toolbarService: ToolbarEventService;
  let toolbarFocusService: ToolbarFocusService

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
      providers: [ToolbarButtonVisibilityService, ToolbarEventService, ToolbarFocusService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainToolbarComponent);
    component = fixture.componentInstance;
    toolbarService = TestBed.inject(ToolbarEventService);
    toolbarFocusService = TestBed.inject(ToolbarFocusService);
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
    component.toggleIndexSideBar();

    component.toolbarEvents.sidebarOpen.asObservable()
      .subscribe(
        sidebarOpen => expect(sidebarOpen).toBeTruthy()
        , error => done(error)
      );
    component.toolbarEvents.sidebarOutlineView.asObservable()
      .subscribe(
        sidebarOutlineView => expect(sidebarOutlineView).toBeTruthy()
        , error => done(error)
      );
  }));

  it('should toggle bookmarks sidebar open', fakeAsync((done) => {
    component.toggleBookmarksSideBar();

    component.toolbarEvents.sidebarOpen.asObservable()
      .subscribe(
        sidebarOpen => expect(sidebarOpen).toBeTruthy()
        , error => done(error)
      );
    component.toolbarEvents.sidebarOutlineView.asObservable()
      .subscribe(
        sidebarOutlineView => expect(sidebarOutlineView).toBeFalsy()
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

    it('should mvPresentBtn width is greater than mvToolbarMain width then "button-hidden-on-toolbar" should be return', () => {

      const mockMvToolbarMain = jasmine.createSpyObj("ElementRef", [], { 'nativeElement': { 'offsetWidth': 10 } })
      component.mvToolbarMain = mockMvToolbarMain;
      component.widthRequiredForBtn['mvPresentBtn'] = 11;
      const result = component.onToolBarOffSetChange('mvPresentBtn');

      expect(result).toEqual("button-hidden-on-toolbar");
    });

    it('should mvPresentBtn width is less than mvToolbarMain width then "button-hidden-on-dropdown" should be return', () => {

      const mockMvToolbarMain = jasmine.createSpyObj("ElementRef", [], { 'nativeElement': { 'offsetWidth': 12 } })
      component.mvToolbarMain = mockMvToolbarMain;
      component.widthRequiredForBtn['mvPresentBtn'] = 11;
      const result = component.onToolBarOffSetChange('mvPresentBtn');

      expect(result).toEqual("button-hidden-on-dropdown");
    });
  });

  it('should update page number', () => {
    component.toolbarEvents.setPage(4);
    expect(component.pageNumber).toEqual(4);
  });

  it('should toggle highlight toolbar', () => {
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--highlight')).nativeElement).not.toHaveClass('toggled');
    component.onClickHighlightToggle();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--highlight')).nativeElement).toHaveClass('toggled');
  });

  it('should toggle off the highlight toolbar', () => {
    component.onClickHighlightToggle();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--highlight')).nativeElement).toHaveClass('toggled');
    component.onClickHighlightToggle();
    fixture.detectChanges();
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

  it('should emit step zoom in event', () => {
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

  it('should call onControlPrint', () => {
    const togglePrint = spyOn(toolbarService, 'print');
    const mockEvent = jasmine.createSpyObj('event', ['preventDefault']);
    component.onControlPrint(mockEvent);

    expect(togglePrint).toHaveBeenCalled();
  });

  describe('keyboard navigation', () => {
    describe('onEscapeKey', () => {
      it('should close dropdown menu and focus toolbar button when dropdown is open', () => {
        component.isDropdownMenuOpen = true;
        const moreOptionsButton = nativeElement.querySelector('#mvMoreOptionsBtn') as HTMLButtonElement;
        const mockEvent = {
          target: moreOptionsButton,
          preventDefault: jasmine.createSpy('preventDefault'),
          stopPropagation: jasmine.createSpy('stopPropagation'),
          composedPath: () => [moreOptionsButton]
        } as unknown as KeyboardEvent;
        const focusSpy = spyOn(toolbarFocusService, 'focusToolbarButton');

        component.onEscapeKey(mockEvent);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(mockEvent.stopPropagation).toHaveBeenCalled();
        expect(component.isDropdownMenuOpen).toBeFalse();
        expect(focusSpy).toHaveBeenCalledWith('#mvToolbarMain', 'mvMoreOptionsBtn', 50);
      });

      it('should close search bar and focus search button when escape pressed in search input', () => {
        component.toolbarButtons.showSearchBar = true;
        component.toolbarEvents.searchBarHidden.next(false);
        fixture.detectChanges();
        const searchInput = nativeElement.querySelector('mv-search-bar input') as HTMLInputElement;
        const searchBar = nativeElement.querySelector('mv-search-bar') as HTMLElement;
        const mockEvent = {
          target: searchInput,
          preventDefault: jasmine.createSpy('preventDefault'),
          stopPropagation: jasmine.createSpy('stopPropagation'),
          composedPath: () => [searchInput, searchBar]
        } as unknown as KeyboardEvent;
        const focusSpy = spyOn(toolbarFocusService, 'focusToolbarButton');

        component.onEscapeKey(mockEvent);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(mockEvent.stopPropagation).toHaveBeenCalled();
        expect(component.toolbarEvents.searchBarHidden.getValue()).toBeTrue();
        expect(focusSpy).toHaveBeenCalledWith('#mvToolbarMain', 'mvSearchBtn');
      });

      it('should close bookmarks sidebar and focus bookmarks button when within bookmarks sidebar', () => {
        const sidebarRoot = document.createElement('div');
        sidebarRoot.id = 'sidebarContainer';
        const bookmarkContainer = document.createElement('div');
        bookmarkContainer.id = 'bookmarkContainer';
        const sidebarChild = document.createElement('div');
        sidebarRoot.appendChild(sidebarChild);
        sidebarRoot.appendChild(bookmarkContainer);
        document.body.appendChild(sidebarRoot);
        component.toolbarEvents.sidebarOpen.next(true);
        component.isIndexOpen = true;
        component.isBookmarksOpen = true;
        const toggleSideBarSpy = spyOn(toolbarService, 'toggleSideBar');
        const focusSpy = spyOn(toolbarFocusService, 'focusToolbarButton');
        const mockEvent = {
          target: sidebarChild,
          preventDefault: jasmine.createSpy('preventDefault'),
          stopPropagation: jasmine.createSpy('stopPropagation'),
          composedPath: () => [sidebarChild, sidebarRoot]
        } as unknown as KeyboardEvent;

        component.onEscapeKey(mockEvent);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(mockEvent.stopPropagation).toHaveBeenCalled();
        expect(toggleSideBarSpy).toHaveBeenCalledWith(false);
        expect(component.isIndexOpen).toBeFalse();
        expect(component.isBookmarksOpen).toBeFalse();
        expect(focusSpy).toHaveBeenCalledWith('#mvToolbarMain', 'mvBookmarksBtn', 50);
        document.body.removeChild(sidebarRoot);
      });

      it('should close index sidebar and focus index button when within index sidebar', () => {
        const sidebarRoot = document.createElement('div');
        sidebarRoot.id = 'sidebarContainer';
        const sidebarChild = document.createElement('div');
        sidebarRoot.appendChild(sidebarChild);
        document.body.appendChild(sidebarRoot);
        component.toolbarEvents.sidebarOpen.next(true);
        component.isIndexOpen = true;
        component.isBookmarksOpen = true;
        const toggleSideBarSpy = spyOn(toolbarService, 'toggleSideBar');
        const focusSpy = spyOn(toolbarFocusService, 'focusToolbarButton');
        const mockEvent = {
          target: sidebarChild,
          preventDefault: jasmine.createSpy('preventDefault'),
          stopPropagation: jasmine.createSpy('stopPropagation'),
          composedPath: () => [sidebarChild, sidebarRoot]
        } as unknown as KeyboardEvent;

        component.onEscapeKey(mockEvent);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(mockEvent.stopPropagation).toHaveBeenCalled();
        expect(toggleSideBarSpy).toHaveBeenCalledWith(false);
        expect(component.isIndexOpen).toBeFalse();
        expect(component.isBookmarksOpen).toBeFalse();
        expect(focusSpy).toHaveBeenCalledWith('#mvToolbarMain', 'mvIndexBtn', 50);
        document.body.removeChild(sidebarRoot);
      });

      it('should not close dropdown when it is not open', () => {
        component.isDropdownMenuOpen = false;
        const mockEvent = new KeyboardEvent('keydown', { key: 'Escape' });
        const focusSpy = spyOn(toolbarFocusService, 'focusToolbarButton');

        component.onEscapeKey(mockEvent);

        expect(component.isDropdownMenuOpen).toBeFalse();
        expect(focusSpy).not.toHaveBeenCalled();
      });
    });

    describe('onMoreOptionsKeyDown', () => {
      it('should toggle more options menu on ArrowDown when menu is closed', () => {
        component.isDropdownMenuOpen = false;
        const mockEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        const preventDefaultSpy = spyOn(mockEvent, 'preventDefault');
        const stopPropagationSpy = spyOn(mockEvent, 'stopPropagation');
        const toggleSpy = spyOn(component, 'toggleMoreOptions');

        component.onMoreOptionsKeyDown(mockEvent);

        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(stopPropagationSpy).toHaveBeenCalled();
        expect(toggleSpy).toHaveBeenCalled();
      });

      it('should not toggle more options menu on ArrowDown when menu is already open', () => {
        component.isDropdownMenuOpen = true;
        const mockEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        const preventDefaultSpy = spyOn(mockEvent, 'preventDefault');
        const toggleSpy = spyOn(component, 'toggleMoreOptions');

        component.onMoreOptionsKeyDown(mockEvent);

        expect(preventDefaultSpy).not.toHaveBeenCalled();
        expect(toggleSpy).not.toHaveBeenCalled();
      });
    });

    describe('onHighlightKeyDown', () => {
      it('should open highlight toolbar and focus button when ArrowDown pressed and toolbar is closed', () => {
        component.isHighlightOpen = false;
        const mockEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        const preventDefaultSpy = spyOn(mockEvent, 'preventDefault');
        const stopPropagationSpy = spyOn(mockEvent, 'stopPropagation');
        const toggleSpy = spyOn(toolbarService, 'toggleHighlightToolbar');
        const focusSpy = spyOn(toolbarFocusService, 'focusToolbarButton');

        component.onHighlightKeyDown(mockEvent);

        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(stopPropagationSpy).toHaveBeenCalled();
        expect(toggleSpy).toHaveBeenCalled();
        expect(focusSpy).toHaveBeenCalledWith('.redaction');
      });

      it('should focus button when ArrowDown pressed and toolbar is already open', () => {
        component.isHighlightOpen = true;
        const mockEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        const preventDefaultSpy = spyOn(mockEvent, 'preventDefault');
        const stopPropagationSpy = spyOn(mockEvent, 'stopPropagation');
        const toggleSpy = spyOn(toolbarService, 'toggleHighlightToolbar');
        const focusSpy = spyOn(toolbarFocusService, 'focusToolbarButton');

        component.onHighlightKeyDown(mockEvent);

        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(stopPropagationSpy).toHaveBeenCalled();
        expect(toggleSpy).not.toHaveBeenCalled();
        expect(focusSpy).toHaveBeenCalledWith('.redaction');
      });
    });

    describe('onRedactKeyDown', () => {
      it('should open redaction toolbar and focus button when ArrowDown pressed and toolbar is closed', () => {
        component.isRedactOpen = false;
        const mockEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        const preventDefaultSpy = spyOn(mockEvent, 'preventDefault');
        const stopPropagationSpy = spyOn(mockEvent, 'stopPropagation');
        const toggleSpy = spyOn(toolbarService, 'toggleRedactionMode');
        const focusSpy = spyOn(toolbarFocusService, 'focusToolbarButton');

        component.onRedactKeyDown(mockEvent);

        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(stopPropagationSpy).toHaveBeenCalled();
        expect(toggleSpy).toHaveBeenCalled();
        expect(focusSpy).toHaveBeenCalledWith('mv-redaction-toolbar .redaction');
      });

      it('should focus button when ArrowDown pressed and toolbar is already open', () => {
        component.isRedactOpen = true;
        const mockEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        const preventDefaultSpy = spyOn(mockEvent, 'preventDefault');
        const stopPropagationSpy = spyOn(mockEvent, 'stopPropagation');
        const toggleSpy = spyOn(toolbarService, 'toggleRedactionMode');
        const focusSpy = spyOn(toolbarFocusService, 'focusToolbarButton');

        component.onRedactKeyDown(mockEvent);

        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(stopPropagationSpy).toHaveBeenCalled();
        expect(toggleSpy).not.toHaveBeenCalled();
        expect(focusSpy).toHaveBeenCalledWith('mv-redaction-toolbar .redaction');
      });
    });

    describe('toggleMoreOptions', () => {
      it('should open dropdown and focus menu when closed', () => {
        component.isDropdownMenuOpen = false;
        const focusSpy = spyOn(toolbarFocusService, 'focusToolbarButton');

        component.toggleMoreOptions();

        expect(component.isDropdownMenuOpen).toBeTrue();
        expect(focusSpy).toHaveBeenCalledWith('.cdk-overlay-pane .dropdown-menu');
      });

      it('should close dropdown and not focus when already open', () => {
        component.isDropdownMenuOpen = true;
        const focusSpy = spyOn(toolbarFocusService, 'focusToolbarButton');

        component.toggleMoreOptions();

        expect(component.isDropdownMenuOpen).toBeFalse();
        expect(focusSpy).not.toHaveBeenCalled();
      });
    });

    describe('highlight toolbar state tracking', () => {
      it('should update isHighlightOpen when highlight toolbar is toggled', () => {
        component.ngOnInit();
        expect(component.isHighlightOpen).toBeFalse();

        toolbarService.highlightToolbarSubject.next(true);
        expect(component.isHighlightOpen).toBeTrue();

        toolbarService.highlightToolbarSubject.next(false);
        expect(component.isHighlightOpen).toBeFalse();
      });
    });

    describe('redaction toolbar state tracking', () => {
      it('should update isRedactOpen when redaction mode is toggled', () => {
        component.ngOnInit();
        expect(component.isRedactOpen).toBeFalse();

        toolbarService.redactionMode.next(true);
        expect(component.isRedactOpen).toBeTrue();

        toolbarService.redactionMode.next(false);
        expect(component.isRedactOpen).toBeFalse();
      });
    });
  });
});
