import { ConnectionPositionPair } from '@angular/cdk/overlay';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ToolbarEventService } from '../toolbar-event.service';
import { ToolbarButtonVisibilityService } from '../toolbar-button-visibility.service';
import { NumberHelperService } from '../../../lib/shared/util/services/number.helper.service';
import { IcpEventService } from '../icp-event.service';
import { ToolbarFocusService } from '../toolbar-focus.service';
import { HtmlTemplatesHelper } from '../../shared/util/helpers/html-templates.helper';

@Component({
  selector: 'mv-main-toolbar',
  templateUrl: './main-toolbar.component.html'
})
export class MainToolbarComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() enableAnnotations = false;
  @Input() enableRedactions = false;
  @Input() enableICP = false;
  @Input() contentType = null;

  @ViewChild('zoomSelect', { static: false }) public zoomSelect: ElementRef;
  @ViewChild('mvToolbarMain', { static: false }) public mvToolbarMain: ElementRef<HTMLElement>;
  @ViewChild('dropdownMenu', { static: false }) public mvMenuItems: ElementRef<HTMLElement>;

  private readonly subscriptions: Subscription[] = [];

  public icpEnabled = false;
  public redactionEnabled = false;
  public showCommentsPanel: boolean;
  public redactAllInProgress: boolean;

  public pageNumber = 1;
  public pageCount = 0;
  public isDropdownMenuOpen = false;
  public isBookmarksOpen = false;
  public isIndexOpen = false;
  public isRedactOpen = false;
  public isCommentsOpen = false;
  public isHighlightOpen = false;
  public dropdownMenuPositions = [
    new ConnectionPositionPair(
      {
        originX: 'end',
        originY: 'bottom'
      },
      {
        overlayX: 'end',
        overlayY: 'top'
      },
      0,
      3)
  ];

  public zoomScales = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2.5, 3, 5];

  allButtonsWidth = 0;
  widthRequiredForBtn: { [id: string]: number } = {};

  public constructor(
    public readonly toolbarEvents: ToolbarEventService,
    public readonly toolbarButtons: ToolbarButtonVisibilityService,
    private readonly cdr: ChangeDetectorRef,
    private readonly numberHelper: NumberHelperService,
    private readonly icpEventService: IcpEventService,
    private readonly toolbarFocusService: ToolbarFocusService
  ) {
  }

  public ngOnInit() {
    this.subscriptions.push(
      this.toolbarEvents.setCurrentPageSubject.subscribe(pageNumber => this.setCurrentPage(pageNumber)),
      this.toolbarEvents.setCurrentPageInputValueSubject.subscribe(pageNumber => this.pageNumber = pageNumber),
      this.toolbarEvents.getPageCount().subscribe(count => this.pageCount = count),
      this.icpEventService.enabled.subscribe(enabled => {
        this.icpEnabled = enabled;
        if (this.icpEnabled) {
          this.toolbarEvents.toggleCommentsPanel(!enabled);
          this.toolbarEvents.sidebarOpen.next(false);
        }
      }),
      this.toolbarEvents.redactionMode.subscribe(enabled => {
        this.redactionEnabled = enabled;
        this.isRedactOpen = enabled;
      }),
      this.toolbarEvents.redactAllInProgressSubject.subscribe(disable => {
        this.redactAllInProgress = disable;
      }),
      this.toolbarEvents.highlightToolbarSubject.subscribe(isOpen => {
        this.isHighlightOpen = isOpen;
      })
    );
  }

  public ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public ngAfterViewInit() {
    Array.from(this.mvToolbarMain.nativeElement.children).forEach((button: HTMLElement) => {
      this.allButtonsWidth += HtmlTemplatesHelper.getAdjustedBoundingRect(button).width;
      this.widthRequiredForBtn[button.id] = this.allButtonsWidth;
    });
    this.cdr.detectChanges();
  }

  @HostListener('window:resize', [])
  public onResize() {
    this.cdr.detectChanges();
  }

  @HostListener('document:keydown.control.p', ['$event'])
  @HostListener('document:keydown.meta.p', ['$event'])
  public onControlPrint(event: KeyboardEvent) {
    event.preventDefault();
    this.printFile();
  }

@HostListener('document:keydown.escape', ['$event'])
  public onEscapeKey(event: KeyboardEvent) {
    if (this.isDropdownMenuOpen) {
      event.preventDefault();
      event.stopPropagation();
      this.isDropdownMenuOpen = false;
      // const moreOptionsBtn = document.querySelector('#mvMoreOptionsBtn') as HTMLElement;
      // if (moreOptionsBtn) {
      //   moreOptionsBtn.focus();
      // }
      this.toolbarFocusService.focusToolbarButton('#mvMoreOptionsBtn');
    }
  }

  public onMoreOptionsKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' && !this.isDropdownMenuOpen) {
      event.preventDefault();
      event.stopPropagation();
      this.toggleMoreOptions();
    }
  }

  public onHighlightKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      event.stopPropagation();
      if (!this.isHighlightOpen) {
        this.openHighlightToolbarAndFocus();
      } else {
        this.focusHighlightButton();
      }
    }
  }

  public onClickHighlightToggle() {
    this.toolbarEvents.toggleHighlightToolbar();
  }

  private openHighlightToolbarAndFocus() {
    if (!this.isHighlightOpen) {
      this.toolbarEvents.toggleHighlightToolbar();
      this.focusHighlightButton();
    }
  }

  private focusHighlightButton() {
    // setTimeout(() => {
    //   const highlightToolbar = document.querySelector('.redaction');
    //   if (highlightToolbar) {
    //     const tabbableButton = highlightToolbar.querySelector('button[tabindex="0"]') as HTMLElement;
    //     if (tabbableButton) {
    //       tabbableButton.focus();
    //     }
    //   }
    // }, 0);
    this.toolbarFocusService.focusToolbarButton('.redaction');
  }

  public onClickDrawToggle() {
    this.toolbarEvents.toggleDrawMode();
  }

  public toggleIndexSideBar() {
    const sidebarOpen = this.toolbarEvents.sidebarOpen.getValue();
    const sidebarView = this.toolbarEvents.sidebarOutlineView.getValue();
    if (!(sidebarOpen && !sidebarView)) {
      this.toolbarEvents.toggleSideBar(!sidebarOpen);
    }
    this.toolbarEvents.toggleSideBarView(true);
    this.isIndexOpen = !this.isIndexOpen;
  }

  public onToolBarOffSetChange(buttonId: string) {
    if (this.mvToolbarMain && this.mvToolbarMain.nativeElement.offsetWidth < this.widthRequiredForBtn[buttonId]) {
      return "button-hidden-on-toolbar";

    }
    return "button-hidden-on-dropdown";
  }

  public toggleBookmarksSideBar() {
    const sidebarOpen = this.toolbarEvents.sidebarOpen.getValue();
    const sidebarView = this.toolbarEvents.sidebarOutlineView.getValue();
    if (!(sidebarOpen && sidebarView)) {
      this.toolbarEvents.toggleSideBar(!sidebarOpen);
    }
    this.toolbarEvents.toggleSideBarView(false);
    this.isBookmarksOpen = !this.isBookmarksOpen;
  }

  public togglePresentBar() {
    this.toolbarEvents.searchBarHidden.next(true);
    this.icpEventService.enable();
  }

  public increasePageNumber() {
    this.toolbarEvents.incrementPage(1);
  }

  public decreasePageNumber() {
    this.toolbarEvents.incrementPage(-1);
  }

  public onPageNumberInputChange(pageNumber: string) {
    if (Number(pageNumber) < 1) {
      pageNumber = '1';
    }
    if (Number(pageNumber) > this.pageCount) {
      pageNumber = this.pageCount.toString();
    }

    this.toolbarEvents.setPage(Number.parseInt(pageNumber, 10));
  }

  private setCurrentPage(pageNumber: number) {
    this.pageNumber = pageNumber;
  }

  public rotate(rotation: number) {
    this.toolbarEvents.rotate(rotation);
  }

  public printFile() {
    this.toolbarEvents.print();
  }

  public downloadFile() {
    this.toolbarEvents.download();
  }

  public zoom(zoomFactor: string) {
    this.toolbarEvents.zoom(+zoomFactor);
  }

  public stepZoom(zoomFactor: number) {
    this.toolbarEvents.stepZoom(zoomFactor);
    this.zoomSelect.nativeElement.selected = 'selected';
  }

  public toggleCommentsPanel() {
    this.toolbarEvents.toggleCommentsPanel(!this.toolbarEvents.commentsPanelVisible.getValue());
    this.isCommentsOpen = !this.isCommentsOpen;
  }

  public toggleRedactBar() {
    this.toolbarEvents.toggleRedactionMode();
  }

  public onRedactKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      event.stopPropagation();
      if (!this.isRedactOpen) {
        this.openRedactToolbarAndFocus();
      } else {
        this.focusRedactButton();
      }
    }
  }

  private openRedactToolbarAndFocus() {
    if (!this.isRedactOpen) {
      this.toolbarEvents.toggleRedactionMode();
      this.focusRedactButton();
    }
  }

  private focusRedactButton() {
    // setTimeout(() => {
    //   const redactionToolbar = document.querySelector('mv-redaction-toolbar .redaction');
    //   if (redactionToolbar) {
    //     const tabbableButton = redactionToolbar.querySelector('button[tabindex="0"]') as HTMLElement;
    //     if (tabbableButton) {
    //       tabbableButton.focus();
    //     }
    //   }
    // }, 0);
    this.toolbarFocusService.focusToolbarButton('mv-redaction-toolbar .redaction');
  }

  public toggleGrabNDrag() {
    this.toolbarEvents.toggleGrabNDrag();
  }

  public isPdf() {
    return this.contentType === 'pdf';
  }

  public toggleSearchBar() {
    this.toolbarEvents.searchBarHidden.next(!this.toolbarEvents.searchBarHidden.getValue());
  }

  public toggleMoreOptions() {
    this.isDropdownMenuOpen = !this.isDropdownMenuOpen;
    if (this.isDropdownMenuOpen) {
      // setTimeout(() => {
      //   const overlayPane = document.querySelector('.cdk-overlay-pane');
      //   if (overlayPane) {
      //     const firstButton = overlayPane.querySelector('.dropdown-menu button[tabindex="0"]') as HTMLElement;
      //     if (firstButton) {
      //       firstButton.focus();
      //     }
      //   }
      // }, 0);
      this.toolbarFocusService.focusToolbarButton('.cdk-overlay-pane .dropdown-menu');
    }
  }
}
