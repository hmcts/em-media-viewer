import {Component, Input} from '@angular/core';
import {TagItemModel} from '../models/tag-item.model';
import {TagsServices} from '../services/tags/tags.services';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'mv-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent {
  @Input() set autocompleteItems(value) {
    this.availableTags = value;
  }
  constructor(private tagsServices: TagsServices) {
  }
  @Input() tagItems: TagItemModel[];
  @Input() editable: boolean;
  @Input() commentId: string;

  availableTags: TagItemModel[];
  public validators = [this.minLength, this.maxLength20];

  public errorMessages: {[id: string]: string} = {
    'minLength': 'Minimum of 2 characters',
    'maxLength20': 'Maximum of 20 characters'
  };

  onUpdateTags(value) {
    this.tagsServices.updateTagItems(value, this.commentId);
  }

  private minLength(control: FormControl) {
    if (control.value.length < 2) {
      return {
        'minLength': true
      };
    }
    return null;
  }

  private maxLength20(control: FormControl) {
    if (control.value.length >= 20) {
      return {
        'maxLength20': true
      };
    }
    return null;
  }
}
