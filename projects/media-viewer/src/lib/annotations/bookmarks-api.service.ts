import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Bookmark } from '../store/reducers/bookmarks.reducer';

@Injectable()
export class BookmarksApiService {

  private readonly ANNOTATIONS_API = '/em-anno';

  constructor(
    private readonly httpClient: HttpClient
  ) {}

  public getBookmarks(url: string): Observable<any> {
    const documentId = this.extractDocumentId(url);
    return this.httpClient
      .get(`${this.ANNOTATIONS_API}/${documentId}/bookmarks`,
        { observe: 'response' , withCredentials: true });
  }

  public createBookmark(bookmark: Partial<Bookmark>): Observable<Bookmark> {
    return this.httpClient
      .post<Bookmark>(`${this.ANNOTATIONS_API}/bookmarks`,
        bookmark, { observe: 'response' , withCredentials: true })
      .pipe(map(response => response.body));
  }

  public updateBookmark(bookmark: Partial<Bookmark>): Observable<Bookmark> {
    return this.httpClient
      .put<Bookmark>(`${this.ANNOTATIONS_API}/bookmarks`,
        bookmark, { observe: 'response' , withCredentials: true })
      .pipe(map(response => response.body));
  }

  public deleteBookmark(bookmarkId: string): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.ANNOTATIONS_API}/bookmarks/${bookmarkId}`,
        { observe: 'response' , withCredentials: true })
      .pipe(map(response => response.body));
  }

  private extractDocumentId(url: string): string {
    url = url.includes('/documents/') ? url.split('/documents/')[1] : url;
    return url.replace('/binary', '');
  }
}

