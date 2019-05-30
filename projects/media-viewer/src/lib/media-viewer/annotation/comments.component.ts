import {Component, Input} from '@angular/core';
import {AnnotationSet} from './annotation-set.model';

@Component({
  selector: 'mv-comments',
  templateUrl: './annotation-set.component.html',
  styleUrls: []
})
export class CommentsComponent {

  @Input() annotationSet: AnnotationSet;

}
