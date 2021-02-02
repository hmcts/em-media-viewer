import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-custom-toolbar',
  templateUrl: './custom-toolbar.component.html'
})
export class CustomToolbarComponent implements OnInit {

  @Input() toolbarEvents;
  @Input() contentType;
  zoomValue: number;
  search: boolean;
  currentPageNumber = 1;

  @ViewChild('zoomSelect', { static: false }) zoomSelect: ElementRef;

  constructor() { }

  ngOnInit() {
    this.search = false;
    this.toolbarEvents.getZoomValue().subscribe(zoom => this.zoomValue = zoom);
    this.toolbarEvents.getCurrentPageNumber().subscribe(page => this.currentPageNumber = page);
  }

  nextPage(): void {
    this.toolbarEvents.incrementPage(1);
  }

  prevPage(): void {
    this.toolbarEvents.incrementPage(-1);
  }

  rotate(value: number) {
    this.toolbarEvents.rotate(value);
  }

  stepZoom(value: number) {
    this.toolbarEvents.stepZoom(value);
    this.zoomSelect.nativeElement.selected = 'selected';
  }

  zoom(value: number) {
    this.toolbarEvents.zoom(value);
  }

  print() {
    this.toolbarEvents.print();
  }

  download() {
    this.toolbarEvents.download();
  }

  enterPage(value: number) {
    this.toolbarEvents.setPage(value);
  }

  highlight() {
    this.toolbarEvents.toggleHighlightMode();
  }

  draw() {
    this.toolbarEvents.toggleDrawMode();
  }
}
