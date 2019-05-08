import { Component, OnInit } from '@angular/core';
import { RotateDirection, RotateOperation, SearchOperation, ZoomOperation } from '../media-viewer/service/media-viewer-message.model';
import { MediaViewerMessageService } from '../media-viewer/service/media-viewer-message.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(private readonly mediaViewerMessageService: MediaViewerMessageService) {}

  ngOnInit() {
  }

  rotate(rotateDirectionStr: string) {
    this.mediaViewerMessageService.sendMessage(new RotateOperation(RotateDirection[rotateDirectionStr]));
  }

  zoom(zoomFactor: number) {
    this.mediaViewerMessageService.sendMessage(new ZoomOperation(zoomFactor));
  }

  searchPrev(searchTerm: string) {
    this.mediaViewerMessageService.sendMessage(new SearchOperation(searchTerm, true));
  }

  searchNext(searchTerm: string) {
    this.mediaViewerMessageService.sendMessage(new SearchOperation(searchTerm));
  }

}
