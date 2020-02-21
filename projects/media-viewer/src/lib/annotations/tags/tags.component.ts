import {Component, Input} from '@angular/core';
import {TagItemModel} from '../models/tag-item.model';
import {TagsServices} from '../services/tags/tags.services';
import {debug} from 'ng-packagr/lib/util/log';

@Component({
  selector: 'mv-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent {
  @Input() tagItems: TagItemModel[];
  @Input() editable: boolean;
  @Input() commentId: string;
  @Input() set autocompleteItems(value) {
    this.availableTags = value;
  }

  availableTags: TagItemModel[];

  constructor(private tagsServices: TagsServices) {
  }

  onUpdateTags(value) {
    this.tagsServices.updateTagItems(value, this.commentId);
  }
}
