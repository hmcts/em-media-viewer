import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TagsModel } from '../../models/tags.model';

@Injectable()
export class TagsServices {

  public tagItems: {[id: string]: TagsModel[]};

  constructor(private http: HttpClient) {}

  public getAllTags(createdBy: string): Observable<TagsModel[]> {
    const url = `/em-anno/tags/${createdBy}`;
    return this.http.get<TagsModel[]>(url);
  }

  // @TODO: Move everything below this to NgRx store
  getNewTags(annoid: string): TagsModel[] {
    return this.tagItems ? this.tagItems[annoid] : [];
  }

  updateTagItems(items: Array<TagsModel>, annoId: string) {
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
    return string.replace(/ +/g, ' ')  // find space
      .split(/ |\B(?=[A-Z])/) // split it into array
      .map(word => word.toLowerCase()) // transform to lover case
      .join('_'); // trun array into sting using _
  }
}
