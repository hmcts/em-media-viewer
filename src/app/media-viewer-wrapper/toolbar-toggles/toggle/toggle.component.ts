import { Component, Input } from '@angular/core';
import { ToolbarButtonVisibilityService } from '../../../../../projects/media-viewer/src/lib/toolbar/toolbar-button-visibility.service';

@Component({
  selector: '[app-toggle]',
  templateUrl: './toggle.component.html',
  styleUrls: ['../toolbar-toggles.component.scss']
})
export class ToggleComponent {
  @Input() subject: keyof ToolbarButtonVisibilityService;
  @Input() label: string;

  constructor(
    public readonly toolbarButtons: ToolbarButtonVisibilityService
  ) {}
}
