import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TagItemModel } from '../../models/tag-item.model';

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
    const snakeCased = items.map(item => {
      return {
        ...item,
        name: this.snakeCase(item.name)
      };
    });

    this.tagItems = {
      ...this.tagItems,
      [annoId]: snakeCased
    };
  }

  private snakeCase = string => {
    // transform string_to_snake_case
    return string.replace(/\W+/g, " ")  // find space
      .split(/ |\B(?=[A-Z])/) // split it into array
      .map(word => word.toLowerCase()) // transform to lover case
      .join('_'); // trun array into sting using _
  };
}
