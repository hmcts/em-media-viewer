import { Component, Input } from '@angular/core';

@Component({
  selector: 'mv-outline-view',
  templateUrl: './outline-view.component.html',
  styleUrls: ['../../../styles/main.scss'],
})
export class OutlineViewComponent {

  @Input() outline: [];
}
