import {AfterContentInit, Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'mv-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['../../styles/main.scss']
})
export class SideBarComponent implements OnChanges, AfterContentInit {

  private showThumbnailView: boolean;
  private showOutlineView: boolean;
  private showAttachmentsView: boolean;

  @Input() url: string;

  constructor() {
  }

  ngAfterContentInit() {
    this.showThumbnailView = true;
    this.showOutlineView = false;
    this.showAttachmentsView = false;
  }

  async ngOnChanges(changes: SimpleChanges) {
    this.reset();
  }

  reset() {
    this.showThumbnailView = true;
    this.showOutlineView = false;
    this.showAttachmentsView = false;
  }

  selectThumbnailView() {
    this.showThumbnailView = true;
    this.showOutlineView = false;
    this.showAttachmentsView = false;
  }

  selectOutlineView() {
    this.showThumbnailView = false;
    this.showOutlineView = true;
    this.showAttachmentsView = false;
  }

  selectAttachmentView() {
    this.showThumbnailView = false;
    this.showOutlineView = false;
    this.showAttachmentsView = true;
  }
}
