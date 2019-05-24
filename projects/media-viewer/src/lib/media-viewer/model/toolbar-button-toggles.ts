import { BehaviorSubject } from 'rxjs';

export class ToolbarButtonToggles {

  public readonly subToolbarHidden = new BehaviorSubject(true);
  public readonly sidebarOpen = new BehaviorSubject(false);
  public readonly searchBarHidden = new BehaviorSubject(true);

  public showPrintBtn = false;
  public showDownloadBtn = false;

  public showNavigationBtns = false;
  public showZoomBtns = false;
  public showRotateBtns = false;

  public showPresentationModeBtn = false;
  public showOpenFileBtn = false;
  public showBookmarkBtn = false;

  public showSearchbarToggleBtn = false;
  public showSubToolbarToggleBtn = true;
  public showSidebarToggleBtn = true;

}

export class PdfViewerToolbarButtons extends ToolbarButtonToggles {
  public showPrintBtn = true;
  public showDownloadBtn = true;
  public showNavigationBtns = true;
  public showZoomBtns = true;
  public showRotateBtns = true;
  public showSearchbarToggleBtn = true;
}

export class ImageViewerToolbarButtons extends ToolbarButtonToggles {
  public showPrintBtn = true;
  public showDownloadBtn = true;
  public showZoomBtns = true;
  public showRotateBtns = true;
}

export class UnsupportedViewerToolbarButtons extends ToolbarButtonToggles {
  public showDownloadBtn = true;
}
