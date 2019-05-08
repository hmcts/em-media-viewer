import { Component, Input } from '@angular/core';
import { ActionEvents, RotateOperation, SearchOperation, ZoomOperation } from '../media-viewer/media-viewer.model';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {

  sidebarToggle = false;
  searchToggle = false;
  secondaryToolbarToggle = false;

  constructor(private readonly mediaViewerMessageService: MediaViewerMessageService) {}
  @Input() actionEvents: ActionEvents;

  ngOnInit() {
  }

  toggleSidebar() {
    this.sidebarToggle = !this.sidebarToggle;
  }

  toggleSearch() {
    this.searchToggle = !this.searchToggle;
  }

  toggleSecondaryToolbar() {
    this.secondaryToolbarToggle = !this.secondaryToolbarToggle;
  }

  rotate(rotateDirectionStr: string) {
    this.mediaViewerMessageService.sendMessage(new RotateOperation(RotateDirection[rotateDirectionStr]));
  }

  zoom(zoomFactor: number) {
    this.actionEvents.zoom.next(new ZoomOperation(zoomFactor));
  }

  searchPrev(searchTerm: string) {
    this.actionEvents.search.next(new SearchOperation(searchTerm, true));
  }

  searchNext(searchTerm: string) {
    this.actionEvents.search.next(new SearchOperation(searchTerm));
  }
}
