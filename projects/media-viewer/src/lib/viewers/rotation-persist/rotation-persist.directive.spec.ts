import { ElementRef } from '@angular/core';
import { RotationPersistDirective } from './rotation-persist.directive';
import * as fromDocumentActions from '../../store/actions/document.action';
import { of, Subject } from 'rxjs';

describe('RotationPersistDirective', () => {
  let directive: RotationPersistDirective;
  const toolbarEvents = { rotateSubject: new Subject(), saveRotationSubject: new Subject() } as any;
  const toolbarButtons = { showSaveRotationButton: undefined } as any;
  const store = { dispatch: () => {}, pipe: () => {} } as any;
  const hostElement = document.createElement('div');
  const elementRef = new ElementRef<HTMLElement>(hostElement);

  beforeEach(() => {
    directive = new RotationPersistDirective(elementRef, store, toolbarButtons, toolbarEvents);
  });

  it('should set initial rotation on media load', () => {
    directive.url = 'document-url';
    directive.savedRotation = 90;
    spyOn(store, 'pipe').and.returnValue(of(true));
    spyOn(store, 'dispatch');
    spyOn(toolbarEvents.rotateSubject, 'next');

    directive.onMediaLoad({} as any);

    expect(store.dispatch).toHaveBeenCalledWith(new fromDocumentActions.LoadRotation('document-url'));
    expect(toolbarEvents.rotateSubject.next).toHaveBeenCalledWith(90);
  });

  it('should set rotation and toggle save button', () => {
    directive.rotation = 90;
    directive.savedRotation = 90;
    spyOn(store, 'pipe').and.returnValue(of(null));

    directive.ngOnInit();
    toolbarEvents.rotateSubject.next(90);

    expect(directive.rotation).toBe(180);
    expect(toolbarButtons.showSaveRotationButton).toBeTrue();
  });

  it('should save rotation', () => {
    directive.url = 'document-url';
    directive.rotation = 90;
    spyOn(store, 'pipe').and.returnValue(of(null));
    spyOn(store, 'dispatch');

    directive.ngOnInit();
    toolbarEvents.saveRotationSubject.next();

    const action = new fromDocumentActions.SaveRotation({ documentId: 'document-url', rotationAngle: 90 });
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
