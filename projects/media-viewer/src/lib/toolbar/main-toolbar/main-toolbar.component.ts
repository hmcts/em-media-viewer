import {Component, Input} from '@angular/core';

@Component({
  selector: 'mv-main-toolbar',
  templateUrl: './main-toolbar.component.html'
})
export class MainToolbarComponent {
  @Input() enableAnnotations = false;
  @Input() enableRedactions = false;
  @Input() enableICP = false;
  @Input() contentType = null;
}
