import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// @todo check if I can juts ref the BookmarksApiService in the annotations module instead?
@Injectable()
export class BookmarksApiService {

  private readonly ANNOTATIONS_API = '/em-anno';

  constructor(
    private readonly httpClient: HttpClient
  ) {}

  public getBookmarks(documentId: string): Observable<any> {
    return this.httpClient
      .get(`${this.ANNOTATIONS_API}/${documentId}/bookmarks`,
        { observe: 'response' , withCredentials: true });
  }
}

