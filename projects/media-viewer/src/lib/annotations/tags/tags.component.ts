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

  @Input() tagItems: TagItemModel[];
  @Input() autocompleteItems: TagItemModel[];
  @Input() editable: boolean;
  @Input() commentId: string;
  public validators = [this.minLength, this.maxLength20];
  public errorMessages: {[id: string]: string} = {
    'minLength': 'Minimum of 2 characters',
    'maxLength20': 'Maximum of 20 characters'
  };

  constructor(private tagsServices: TagsServices) {}

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
