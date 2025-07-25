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
    private readonly icpEventService: IcpEventService
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
      }),
      this.toolbarEvents.redactAllInProgressSubject.subscribe(disable => {
        this.redactAllInProgress = disable;
      }),
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

  public onClickHighlightToggle() {
    this.toolbarEvents.toggleHighlightToolbar();
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
    this.isRedactOpen = !this.isRedactOpen;
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
    setTimeout(() => {
      if (this.mvMenuItems) {
        this.mvMenuItems.nativeElement.focus();
      }
    }, 100);
  }
}
