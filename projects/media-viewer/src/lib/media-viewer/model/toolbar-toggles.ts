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
