import { Component, Input } from '@angular/core';
import { ActionEvents, RotateOperation, SearchOperation, ZoomOperation } from '../media-viewer.model';
import {PdfJsWrapper} from '../viewers/pdf-viewer/pdf-js/pdf-js-wrapper';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {

  @Input() url = '';
  @Input() contentType: string;
  @Input() downloadFileName = null;
  sidebarToggle = false;
  searchToggle = false;
  secondaryToolbarToggle = false;

  constructor(private pdfWrapper: PdfJsWrapper) {}

  @Input() actionEvents: ActionEvents;

  toggleSidebar() {
    this.sidebarToggle = !this.sidebarToggle;
  }

  toggleSearch() {
    this.searchToggle = !this.searchToggle;
  }

  toggleSecondaryToolbar() {
    this.secondaryToolbarToggle = !this.secondaryToolbarToggle;
  }

  rotate(rotation: number) {
    this.actionEvents.rotate.next(new RotateOperation(rotation));
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

  downloadFile() {
    this.pdfWrapper.downloadFile(this.url, this.downloadFileName);
  }
}
