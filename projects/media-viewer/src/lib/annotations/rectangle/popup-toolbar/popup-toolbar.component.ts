import { Component, Input } from '@angular/core';

@Component({
  selector: 'mv-popup-toolbar',
  templateUrl: './popup-toolbar.component.html',
  styleUrls: ['./popup-toolbar.component.scss']
})
export class PopupToolbarComponent {

  readonly HEIGHT = 70;
  readonly WIDTH = 100;

  @Input() top: number;
  @Input() left: number;

}
