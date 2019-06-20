import { Component, Input } from '@angular/core';
import { Annotation } from './annotation.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'mv-annotations',
  styleUrls: ['./annotations.component.scss'],
  templateUrl: './annotations.component.html'
})
export class AnnotationsComponent {

  @Input() annotations: Annotation[];
  @Input() selectedAnnotation: Subject<string>;
  @Input() zoom: number;
  @Input() rotate: number;
  @Input() width: number;
  @Input() height: number;

}
