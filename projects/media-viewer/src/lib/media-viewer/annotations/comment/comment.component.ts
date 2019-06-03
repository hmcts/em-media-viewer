import { Component } from '@angular/core';

@Component({
  selector: 'mv-anno-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {

  comment = { content: 'test'};
  user = { forename: 'forename', surname: 'surname', email: 'email@email.com' };
  selected = false;

  onMouseDown() {
    console.log('selected');
    this.selected = true;
  }

  onMouseUp() {
    console.log('unselected');
    this.selected = false;
  }
}
