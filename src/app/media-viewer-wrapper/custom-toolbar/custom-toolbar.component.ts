import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-custom-toolbar',
  templateUrl: './custom-toolbar.component.html',
  styleUrls: ['./custom-toolbar.component.css']
})
export class CustomToolbarComponent implements OnInit {

  @Input() toolbarEvents;
  zoomValue: number;

  @ViewChild('zoomSelect') zoomSelect: ElementRef;

  constructor() { }
  ngOnInit() {
    this.toolbarEvents.getZoomValue().subscribe(zoom => this.zoomValue = zoom);
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
}
