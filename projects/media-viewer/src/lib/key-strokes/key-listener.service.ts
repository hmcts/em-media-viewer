import { Injectable } from '@angular/core';
import {ToolbarEventService} from '../toolbar/toolbar-event.service';

import * as defaultKeyBindings from './defult-key-bindings.json';

@Injectable({
  providedIn: 'root'
})
export class KeyListenerService {

  keyPressBindings: Array<KeyPressBinding>;

  readonly keyPressActions: Record<string, Function>;

  constructor(public readonly toolbarEvents: ToolbarEventService) {
    this.keyPressActions = {};
    this.keyPressActions['NEXT_PAGE'] = () => this.toolbarEvents.changePageByDelta.next(1);
    this.keyPressActions['ROTATE_90_CLOCKWISE'] = () => this.toolbarEvents.rotate.next(90);
    this.keyPressBindings = (defaultKeyBindings  as  any).default;
  }

  keyPressed(e: KeyboardEvent) {
    const keyMatcher = this.keyPressBindings.find(a => a.code === e.code && a.altKey === e.altKey && a.ctrlKey === e.ctrlKey);
    if (keyMatcher && this.keyPressActions[keyMatcher.actionId]) {
      this.keyPressActions[keyMatcher.actionId]();
    }
  }

}

interface KeyPressBinding {
  code: string;
  ctrlKey: boolean;
  altKey: boolean;
  actionId: string;
}

