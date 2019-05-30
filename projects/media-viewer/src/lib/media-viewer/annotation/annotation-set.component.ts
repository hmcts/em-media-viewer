import {Component, Input} from '@angular/core';
import {AnnotationSet} from './annotation-set.model';

@Component({
  selector: 'mv-annotation-set',
  templateUrl: './annotation-set.component.html',
  styleUrls: []
})
export class AnnotationSetComponent {

  @Input() annotationSet: AnnotationSet;

}
