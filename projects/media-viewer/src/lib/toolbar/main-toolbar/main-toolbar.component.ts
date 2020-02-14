import {Component, Input} from '@angular/core';

@Component({
  selector: 'mv-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['../../../assets/sass/toolbar/main.scss']
})
export class MainToolbarComponent {
  @Input() enableAnnotations = false;
}
