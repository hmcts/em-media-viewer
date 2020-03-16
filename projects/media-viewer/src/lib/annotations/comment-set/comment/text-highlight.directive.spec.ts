import { ElementRef } from '@angular/core';
import { TextHighlightDirective } from './text-highlight.directive';
import { AnnotationEventService } from '../../annotation-event.service';

describe('TextHighlightDirective', () => {
  let directive: TextHighlightDirective;

  beforeEach(() => {
    directive = new TextHighlightDirective(new ElementRef<HTMLElement>(document.createElement('div')),
      new AnnotationEventService());
  });

  it('should highlight search string', () => {
    directive.ngAfterViewChecked();
  });

  it('should reset highlight', () => {
    directive.resetHighlight();
  });
});
