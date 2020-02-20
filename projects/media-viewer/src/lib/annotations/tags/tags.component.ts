import {Component, Input} from '@angular/core';
import {TagItemModel} from '../models/tag-item.model';

@Component({
  selector: 'mv-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent {
  @Input() tagItems: TagItemModel[];
  @Input() autocompleteItems: TagItemModel[];
}
