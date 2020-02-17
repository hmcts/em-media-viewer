import { Component, Input } from '@angular/core';

@Component({
  selector: 'mv-side-bar',
  templateUrl: './side-bar.component.html',
})
export class SideBarComponent {

  @Input() url: string;

  constructor() {
  }
}
