import {Component, Input} from '@angular/core';
import {TagItemModel} from '../models/tag-item.model';
import {TagsServices} from '../services/tags/tags.services';

@Component({
  selector: 'mv-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent {
  @Input() tagItems: TagItemModel[];
  @Input() autocompleteItems: TagItemModel[];
  @Input() editable: boolean;
  @Input() commentId: string

  constructor(private tagsServices: TagsServices) {
  }

  onUpdateTags(value) {
    this.tagsServices.updateTagItems(value, this.commentId);
  }
}
