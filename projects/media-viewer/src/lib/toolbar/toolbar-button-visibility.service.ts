import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ToolbarButtonVisibilityService {
  public subToolbarHidden = new BehaviorSubject(true);
  public sidebarOpen = new BehaviorSubject(false);
  public searchBarHidden = new BehaviorSubject(true);

  public showPrint = false;
  public showDownload = false;
  public showNavigation = false;
  public showZoom = false;
  public showRotate = false;
  public showPresentationMode = false;
  public showOpenFile = false;
  public showBookmark = false;
  public showHighlightButton = false;
  public showDrawButton = false;
  public showSearchBar = false;
  public showSubToolbar = false;
  public showSidebar = false;
  public showCommentSummary = false;

  /**
   * Reset the visibility of all buttons to false then set the value from the options
   */
  public setup(options: Partial<ToolbarButtonVisibilityService>): void {
    this.subToolbarHidden.next(true);
    this.sidebarOpen.next(false);
    this.searchBarHidden.next(true);
    this.showPrint = false;
    this.showDownload = false;
    this.showNavigation = false;
    this.showZoom = false;
    this.showRotate = false;
    this.showPresentationMode = false;
    this.showOpenFile = false;
    this.showBookmark = false;
    this.showHighlightButton = false;
    this.showDrawButton = false;
    this.showSearchBar = false;
    this.showSubToolbar = false;
    this.showSidebar = false;
    this.showCommentSummary = false;

    for (const key in options) {
      this[key] = options[key];
    }
  }
}

/**
 * Default toolbar state for the PDF viewer
 */
export const defaultPdfOptions = {
  showDownload: true,
  showNavigation: true,
  showZoom: true,
  showRotate: true,
  showSearchBar: true,
  showSidebar: true
};

/**
 * Default toolbar state for the image viewer
 */
export const defaultImageOptions = {
  showDownload: true,
  showZoom: true,
  showRotate: true
};

/**
 * Default toolbar state for unsupported media
 */
export const defaultUnsupportedOptions = {
  showDownload: true,
  showCommentSummary: false
};
