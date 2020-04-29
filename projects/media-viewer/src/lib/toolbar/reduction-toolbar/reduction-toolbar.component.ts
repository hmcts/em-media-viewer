import {Component, Input} from '@angular/core';
import {ToolbarEventService} from '../toolbar-event.service';

@Component({
  selector: 'mv-reduction-toolbar',
  templateUrl: './reduction-toolbar.component.html'
})
export class ReductionToolbarComponent {
  constructor(
    public readonly toolbarEvents: ToolbarEventService,
    public readonly toolbarEventService: ToolbarEventService
  ) {}

  toggleTextReductionMode() {
    this.toolbarEventService.highlightTextReductionMode.next(true);
  }

}
