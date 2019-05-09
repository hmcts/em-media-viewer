import { Component, Input } from '@angular/core';
import { ActionEvents, RotateOperation, SearchOperation, ZoomOperation } from '../media-viewer/media-viewer.model';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {

  @Input() actionEvents: ActionEvents;

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
}
