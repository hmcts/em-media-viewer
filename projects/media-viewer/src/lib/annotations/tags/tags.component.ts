import {Component, Input} from '@angular/core';
import {TagItemModel} from '../models/tag-item.model';
import {debug} from 'ng-packagr/lib/util/log';

@Component({
  selector: 'mv-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent {
  @Input() tagItems: TagItemModel[];
  @Input() autocompleteItems: TagItemModel[];
  isEdit = false;

  manageTags(): void {
    this.isEdit = !this.isEdit;
  }
}
