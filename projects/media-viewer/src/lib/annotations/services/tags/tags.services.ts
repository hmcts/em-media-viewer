import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TagItemModel} from '../../models/tag-item.model';

@Injectable()
export class TagsServices {

  constructor(private http: HttpClient) {}

  public getAllTags(): Observable<TagItemModel[]> {
    const url = 'add/url';
    return this.http.get<TagItemModel[]>(url);
  }

  public updateTags(payload): Observable<any> {
    const url = 'add/url';
    return this.http.patch<TagItemModel[]>(url, payload);
  }


}
