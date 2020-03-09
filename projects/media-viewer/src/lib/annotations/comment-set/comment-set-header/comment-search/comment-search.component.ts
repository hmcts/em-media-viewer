import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { AnnotationEventService } from '../../../annotation-event.service';
import { Rectangle } from '../../../annotation-set/annotation-view/rectangle/rectangle.model';
import { AnnotationSet } from '../../../annotation-set/annotation-set.model';

@Component({
  selector: 'mv-comment-search',
  templateUrl: './comment-search.component.html',
  styleUrls: ['./comment-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CommentSearchComponent implements AfterViewInit, OnDestroy {

  @Input() public readonly annotationSet: AnnotationSet;

  @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;

  searchString: string;
  searchResults: string[] = [];
  searchIndex = 0;

  constructor(private annotationEvents: AnnotationEventService) {}

  ngAfterViewInit(): void {
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  ngOnDestroy(): void {
    this.annotationEvents.resetTextHighlight();
  }

  searchComments(searchText: string): void {
    this.clearSearch();
    if (searchText.length > 2) {
      this.searchString = searchText;
      this.searchResults = this.annotationSet.annotations
        .filter(annotation => annotation.comments.length > 0)
        .map(annotation => ({
          content: annotation.comments[0].content,
          annotationId: annotation.id,
          page: annotation.page,
          rectangle: this.upperRectangle(annotation.rectangles),
        }))
        .filter(mappedComment => mappedComment.content.toLowerCase().includes(this.searchString.toLowerCase()))
        .sort(this.sortComments)
        .map(mappedComment => mappedComment.annotationId);
      if (this.searchResults.length > 0) {
        this.annotationEvents.selectAnnotation({ annotationId: this.searchResults[0], editable: false });
        this.annotationEvents.onCommentSearch(this.searchString);
      }
    }
  }

  clearSearch() {
    this.searchString = undefined;
    this.searchResults = [];
    this.searchIndex = 0;
    this.annotationEvents.resetTextHighlight();
  }

  upperRectangle(rectangles: Rectangle[]) {
    rectangles.sort((rect1, rect2) => rect1.y - rect2.y);
    return { x: rectangles[0].x, y: rectangles[0].y };
  }

  sortComments(mappedCommentA, mappedCommentB) {
    if (mappedCommentA.page !== mappedCommentB.page) {
      return mappedCommentA.page - mappedCommentB.page;
    } else {
      const rectA = mappedCommentA.rectangle;
      const rectB = mappedCommentB.rectangle;
      if(rectA.y !== rectB.y) {
        return rectA.y - rectB.y;
      } else {
        return rectA.x - rectB.x;
      }
    }
  }


  nextSearchItem() {
    if (this.searchIndex < this.searchResults.length - 1) {
      this.searchIndex += 1;
      this.annotationEvents.selectAnnotation({
        annotationId: this.searchResults[this.searchIndex],
        editable: false
      });
    }
  }

  prevSearchItem() {
    if (this.searchIndex > 0) {
      this.searchIndex -= 1;
      this.annotationEvents.selectAnnotation({
        annotationId: this.searchResults[this.searchIndex],
        editable: false
      });
    }
  }
}
