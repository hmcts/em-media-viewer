import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {TagItemModel} from '../../models/tag-item.model';

@Injectable()
export class TagsServices {

  private autocompleteItemsAsObjects = [
    {name: 'divorce', label: 'Divorce'},
    {name: 'witness', label: 'Witness'},
    {name: 'dispute', label: 'Dispute'},
    {name: 'critical', label: 'Critical'}
  ];

  public tagItems: {[id: string]: TagItemModel[]};

  constructor(private http: HttpClient) {}

  public getAllTags(): Observable<TagItemModel[]> {
    const url = 'add/url';
    // return this.http.get<TagItemModel[]>(url);
    return of(this.autocompleteItemsAsObjects)
  }

  getTagItems(commentId): TagItemModel[] {
    return this.tagItems ? this.tagItems[commentId] : [];
  }

  updateTagItems(items, commentId) {
    this.tagItems = {
      [commentId]: items
    };
  }

}
