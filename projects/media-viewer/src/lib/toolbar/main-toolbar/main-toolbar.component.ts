import { ConnectionPositionPair } from '@angular/cdk/overlay';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToolbarEventService } from '../toolbar-event.service';
import { ToolbarButtonVisibilityService } from '../toolbar-button-visibility.service';
import { NumberHelperService } from '../../../lib/shared/util/services/number.helper.service';

export interface ButtonState {
  id: string;
  showOnToolbar: boolean;
}

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
  @ViewChild('mvMenuItems') public mvMenuItems: ElementRef<HTMLElement>;

  private totalButtonSpace = 0;
  private readonly subscriptions: Subscription[] = [];
  private readonly breakWidths: number[] = [];
  private readonly toolbarButtonVisibilityStates: ButtonState[] = [];

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

  public zoomScales = [this.scaleFactor(0.1), this.scaleFactor(0.25), this.scaleFactor(0.5),
  this.scaleFactor(0.75), this.scaleFactor(1), this.scaleFactor(1.25),
  this.scaleFactor(1.5), this.scaleFactor(2.5), this.scaleFactor(3),
  this.scaleFactor(5)];

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

      this.toolbarEvents.commentsPanelVisible.subscribe(toggle => this.showCommentsPanel = toggle)
    );
  }

  public ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public ngAfterViewInit() {
    let totalSpace = 0;

    // Get all toolbar elements
    const toolbarElements: HTMLElement[] = Array.prototype.slice.call(this.mvToolbarMain.nativeElement.children);

    // Set a flag for each element's visibility and push to array of button states
    for (const element of toolbarElements) {
      this.toolbarButtonVisibilityStates.push({ id: element.id, showOnToolbar: true } as ButtonState);
    }

    // Trigger change detection (necessary to ensure all toolbar elements are rendered fully - and have a size - at this stage)
    this.cdr.detectChanges();

    for (const element of toolbarElements) {
      this.totalButtonSpace += element.getBoundingClientRect().width;
    }

    // add the main toolbar left margin to the available space
    this.totalButtonSpace = this.totalButtonSpace + this.mvToolbarMain.nativeElement.getBoundingClientRect().left;

    // Loop over all elements and set sum of widths for each toolbar element
    for (const element of toolbarElements) {
      // Use bounding client rectangle width for accuracy
      totalSpace += element.getBoundingClientRect().width;
      this.breakWidths.push(totalSpace);
    }
    // Call calculation method
    this.checkCalculation();
  }

  @HostListener('window:resize', [])
  public onResize() {
    this.cdr.detectChanges();
    // Call calculation method
    this.checkCalculation();
  }

  private checkCalculation() {
    // if the more options button is visible and we have enough space to all the buttons then show them all
    if (this.totalButtonSpace < this.mvMenuItems.nativeElement.getBoundingClientRect().width) {
      for (const buttonState of this.toolbarButtonVisibilityStates) {
        buttonState.showOnToolbar = true;
      }
      return;
    }

    // Get current space of main toolbar element, including the right margin (if any) to the "More options" button
    const availableSpace = this.mvToolbarMain.nativeElement.getBoundingClientRect().width +
      parseFloat(getComputedStyle(this.mvToolbarMain.nativeElement).marginRight);
    // Get space required for all elements in main toolbar element (i.e. break-width of the last visible element from breakWidth array)
    const indexOfLastVisibleElement = this.getIndexOfLastVisibleToolbarButton();
    const totalSpaceRequired = this.breakWidths[indexOfLastVisibleElement];

    // If more space is needed than is available, hide last element
    if (totalSpaceRequired > availableSpace) {
      // Mark the toolbar button as hidden in the button states array
      this.setToolbarButtonVisible(this.toolbarButtonVisibilityStates[indexOfLastVisibleElement].id, false);

      // Apply changes
      this.cdr.detectChanges();

      // Call this method to recalculate for rest of toolbar elements
      this.checkCalculation();
    } else if (this.toolbarHasHiddenButtons() && this.breakWidths[indexOfLastVisibleElement + 1] <= availableSpace) {
      // If there are some toolbar buttons marked as hidden in the button states array, AND there is room for the first of these,
      // mark the button as visible
      for (const buttonState of this.toolbarButtonVisibilityStates) {
        if (!buttonState.showOnToolbar) {
          buttonState.showOnToolbar = true;
          break;
        }
      }

      // Call this method to recalculate for rest of toolbar elements
      this.checkCalculation();
    }
  }

  public isToolbarButtonVisible(buttonId: string): boolean {
    const button = this.toolbarButtonVisibilityStates.find(vs => vs.id === buttonId);
    if (button) { return button.showOnToolbar; }
  }

  private setToolbarButtonVisible(buttonId: string, visible: boolean) {
    const button = this.toolbarButtonVisibilityStates.find(vs => vs.id === buttonId);
    if (button) { button.showOnToolbar = visible; }
  }

  public toolbarHasHiddenButtons(): boolean {
    return this.toolbarButtonVisibilityStates.some(buttonState => buttonState.showOnToolbar === false);
  }

  private getIndexOfLastVisibleToolbarButton(): number {
    for (let i = this.toolbarButtonVisibilityStates.length - 1; i >= 0; i--) {
      if (this.toolbarButtonVisibilityStates[i].showOnToolbar) {
        return i;
      }
    }
  }

  // Handler onClick Event of the Highlight Mode Button
  public onClickHighlightToggle() {
    // Emit an event that HighlightMode has been enabled/disabled
    this.toolbarEvents.toggleHighlightMode();
  }
  // Handler onClick Event of the Draw Mode Button
  public onClickDrawToggle() {
    // Emit an event that HighlightMode has been enabled/disabled
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
    if (!pageNumber || !this.numberHelper.isNumber(pageNumber)) {
      pageNumber = '1';
    }
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

  private scaleFactor(scaleFactor: number) {
    return {
      value: scaleFactor,
      scale: scaleFactor * 100
    };
  }
}
