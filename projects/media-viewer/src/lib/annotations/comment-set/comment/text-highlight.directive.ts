import { AfterViewChecked, Directive, ElementRef, Input, OnDestroy, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[mvTextHighlight]'
})
export class TextHighlightDirective implements AfterViewChecked, OnDestroy {

  @Input() textToHighlight: string;

  private subscription: Subscription;

  constructor(private element: ElementRef<HTMLElement>,) {
    // this.subscription = annotationEvents.resetHighlightEvent.subscribe(() => this.resetHighlight());
  }

  ngAfterViewChecked(): void {
    if (this.textToHighlight) {
      this.highlightSearchString(this.textToHighlight);
    }
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }

  highlightSearchString(searchString: string) {
    this.resetHighlight();
    this.textToHighlight = searchString;
    const searchPattern = new RegExp(searchString, 'gi');
    const searchElement = this.element.nativeElement;
    if (searchElement.innerHTML.match(searchPattern)) {
      searchElement.innerHTML = searchElement.innerHTML
        .replace(searchPattern, this.highlightPattern('$&'));
    }
    this.textToHighlight = undefined;
  }

  resetHighlight() {
    const searchElement = this.element.nativeElement;
    const searchPattern = new RegExp(this.highlightPattern('(.*?)'), 'gi');
    while(searchElement.innerHTML.match(searchPattern)) {
      const matchGroups = searchPattern.exec(searchElement.innerHTML);
      if (matchGroups) {
        searchElement.innerHTML = searchElement.innerHTML.replace(matchGroups[0], matchGroups[1]);
      }
    }
  }

  private highlightPattern(dynamicText: string) {
    return '<span class="mvTextHighlight">' + dynamicText + '</span>'
  }
}
