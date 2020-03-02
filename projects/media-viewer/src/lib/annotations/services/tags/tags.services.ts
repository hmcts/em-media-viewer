import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable,} from 'rxjs';
import {TagItemModel} from '../../models/tag-item.model';

@Injectable()
export class TagsServices {

  public tagItems: {[id: string]: TagItemModel[]};

  constructor(private http: HttpClient) {}

  public getAllTags(createdBy): Observable<TagItemModel[]> {
    const url = `/em-anno/tags/${createdBy}`;
    return this.http.get<TagItemModel[]>(url);
  }

  getTagItems(annoid): TagItemModel[] {
    return this.tagItems ? this.tagItems[annoid] : [];
  }

  updateTagItems(items, annoId) {
    const snakeCasedWithId = items.map(item => {
      return {
        ...item,
        name: this.snakeCase(item.name)
      };
    });

    this.tagItems = {
      ...this.tagItems,
      [annoId]: snakeCasedWithId
    };
    console.log(this.tagItems);
  }

  private snakeCase = string => {
    return string.replace(/\W+/g, " ")
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('_');
  };
}
