import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import uuid from 'uuid';
import { Subscription } from 'rxjs';
import { BoxHighlightCreateService } from './box-highlight-create.service';
import {distinctUntilChanged, sampleTime} from 'rxjs/operators';


@Component({
  selector: 'mv-box-highlight-create',
  templateUrl: './box-highlight-create.component.html',
})
export class BoxHighlightCreateComponent implements OnInit, OnDestroy {

  @Input() pageHeight: number;
  @Input() pageWidth: number;
  @Input() rotate: number;
  @Input() zoom: number;
  @Input() container: { top: number, left: number };
  @Output() highlightCreated = new EventEmitter();

  @ViewChild('boxHighlight') highlight: ElementRef;

  drawStartX = -1;
  drawStartY = -1;
  top: number;
  left: number;
  height: number;
  width: number;
  display: string;

  private subscriptions: Subscription[] = [];

  constructor(private readonly boxHighlightEvents: BoxHighlightCreateService) {}

  ngOnInit(): void {
    this.subscriptions = [
      this.boxHighlightEvents.initHighlight
        .pipe(distinctUntilChanged()).subscribe(event => this.initHighlight(event)),
      this.boxHighlightEvents.updateHighlight
        .pipe(sampleTime(50), distinctUntilChanged()).subscribe(event => this.updateHighlight(event)),
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe()
    });
  }

  initHighlight(event) {
    this.drawStartX = event.offsetX;
    this.drawStartY = event.offsetY;

    this.display = 'block';
    this.height = 50;
    this.width = 50;

    this.top = this.drawStartY;
    this.left = this.drawStartX;

    switch (this.rotate) {
      case 90:
        this.top = this.drawStartY - this.height;
        break;
      case 180:
        this.top = this.drawStartY - this.height;
        this.left = this.drawStartX - this.width;
        break;
      case 270:
        this.left = this.drawStartX - this.width;
        break;
    }
  }

  updateHighlight(event: MouseEvent) {
    if (this.drawStartX > 0 && this.drawStartY > 0) {
      this.height = Math.abs(event.offsetY - this.drawStartY);
      this.width = Math.abs(event.offsetX - this.drawStartX);
      this.top = Math.min(event.offsetY, this.drawStartY);
      this.left = Math.min(event.offsetX, this.drawStartX);
    }
  }

  createHighlight(highlightPage: number) {
      this.highlightCreated.emit({
        id: uuid(),
        x: + this.left / this.zoom,
        y: + this.top / this.zoom,
        width: + this.width / this.zoom,
        height: + this.height / this.zoom,
        page: highlightPage
      });
      this.resetHighlight();
  }

  private resetHighlight() {
    this.drawStartX = -1;
    this.drawStartY = -1;
    this.display = 'none';
    this.width = 0;
    this.height = 0;
  }
}
