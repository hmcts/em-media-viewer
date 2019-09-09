import * as pdfjsLib from 'pdfjs-dist';
import { AfterContentInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'mv-outline-view',
  templateUrl: './outline-view.component.html',
  styleUrls: ['../../../styles/main.scss'],
})
export class OutlineViewComponent implements OnChanges, AfterContentInit {

  @Input() url: string;
  @ViewChild('outlineContainer') outlineContainer: ElementRef;

  outline = [];

  constructor() {
  }

  async ngAfterContentInit() {
    this.renderOutlineView();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.url) {
      this.outline = [];
      await this.renderOutlineView();
    }
  }

  async renderOutlineView() {
    const pdf = await pdfjsLib.getDocument({
      url: this.url,
      cMapUrl: 'assets/minified/cmaps',
      cMapPacked: true,
      withCredentials: true
    });

    this.outline = await pdf.getOutline();
  }
}
