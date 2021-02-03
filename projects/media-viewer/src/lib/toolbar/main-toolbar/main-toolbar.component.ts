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
import { ConnectionPositionPair } from "@angular/cdk/overlay";

@Component({
  selector: 'mv-main-toolbar',
  templateUrl: './main-toolbar.component.html'
})
export class MainToolbarComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() enableAnnotations = false;
  @Input() enableRedactions = false;
  @Input() enableICP = false;
  @Input() contentType = null;

  @ViewChild('zoomSelect') public zoomSelect: ElementRef;
  @ViewChild('mvToolbarMain') public mvToolbarMain: ElementRef<HTMLElement>;
  @ViewChild('dropdownMenu') public mvMenuItems: ElementRef<HTMLElement>;

  private readonly subscriptions: Subscription[] = [];

  public icpEnabled = false;
  public redactionEnabled = false;
  public showCommentsPanel: boolean;

  public pageNumber = 1;
  public pageCount = 0;
  public isDropdownMenuOpen = false;
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
    private readonly numberHelper: NumberHelperService
  ) {
  }

  public ngOnInit() {
    this.subscriptions.push(
      this.toolbarEvents.setCurrentPageSubject.subscribe(pageNumber => this.setCurrentPage(pageNumber)),
      this.toolbarEvents.setCurrentPageInputValueSubject.subscribe(pageNumber => this.pageNumber = pageNumber),
      this.toolbarEvents.getPageCount().subscribe(count => this.pageCount = count),
      this.toolbarEvents.icp.enabled.subscribe(enabled => {
        this.icpEnabled = enabled;
        if (this.icpEnabled) {
          this.toolbarEvents.toggleCommentsPanel(!enabled);
          this.toolbarEvents.sidebarOpen.next(false);
        }
      }),
      this.toolbarEvents.redactionMode.subscribe(enabled => {
        this.redactionEnabled = enabled;
      }),
    );
  }

  public ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public ngAfterViewInit() {
    Array.from(this.mvToolbarMain.nativeElement.children).forEach(button => {
      this.allButtonsWidth += button.getBoundingClientRect().width;
      this.widthRequiredForBtn[button.id] = this.allButtonsWidth;
    });
    this.cdr.detectChanges();
  }

  @HostListener('window:resize', [])
  public onResize() {
    this.cdr.detectChanges();
  }

  public onClickHighlightToggle() {
    this.toolbarEvents.toggleHighlightMode();
  }
  public onClickDrawToggle() {
    this.toolbarEvents.toggleDrawMode();
  }

  public toggleSideBar() {
    this.toolbarEvents.sidebarOpen.next(!this.toolbarEvents.sidebarOpen.getValue());
  }

  public togglePresentBar() {
    this.toolbarEvents.searchBarHidden.next(true);
    this.toolbarEvents.icp.enable();
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
    this.toolbarEvents.setPage(Number.parseInt(pageNumber, 0));
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
  }

  public toggleRedactBar() {
    this.toolbarEvents.toggleRedactionMode();
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
