import { BehaviorSubject } from 'rxjs';

export class ToolbarToggles {

  public readonly subToolbarHidden = new BehaviorSubject(true);
  public readonly sidebarOpen = new BehaviorSubject(false);
  public readonly searchBarHidden = new BehaviorSubject(true);


  public readonly showPrintBtn = new BehaviorSubject(false);
  public readonly showDownloadBtn = new BehaviorSubject(false);

  public readonly showNavigationBtns = new BehaviorSubject(false);
  public readonly showZoomBtns = new BehaviorSubject(false);
  public readonly showRotateBtns = new BehaviorSubject(false);

  public readonly showPresentationModeBtn = new BehaviorSubject(false);
  public readonly showOpenFileBtn = new BehaviorSubject(false);
  public readonly showBookmarkBtn = new BehaviorSubject(false);

  public readonly showSearchbarToggleBtn = new BehaviorSubject(false);
  public readonly showSubToolbarToggleBtn = new BehaviorSubject(false);
  public readonly showSidebarToggleBtn = new BehaviorSubject(false);

}

export class ToolbarBtnToggles {

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
  public showSubToolbarToggleBtn = false;
  public showSidebarToggleBtn = false;

}

export class PdfViewerToolbarButtons extends ToolbarBtnToggles {
  public showPrintBtn = true;
  public showDownloadBtn = true;
  public showNavigationBtns = true;
  public showZoomBtns = true;
  public showRotateBtns = true;
  public showSearchbarToggleBtn = true;
}

export class ImageViewerToolbarButtons extends ToolbarBtnToggles {
  public showPrintBtn = true;
  public showDownloadBtn = true;
  public showZoomBtns = true;
  public showRotateBtns = true;
}

export class UnsupportedViewerToolbarButtons extends ToolbarBtnToggles {
  public showDownloadBtn = true;
}
