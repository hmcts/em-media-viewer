import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Bookmark } from '../../../viewers/pdf-viewer/side-bar/bookmarks/bookmarks.interfaces';

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

  public updateMultipleBookmarks(bookmarks: Partial<Bookmark[]>): Observable<Bookmark[]> {
    return this.httpClient
      .put<Bookmark[]>(`${this.ANNOTATIONS_API}/bookmarks_multiple`,
        bookmarks, { observe: 'response' , withCredentials: true })
      .pipe(map(response => response.body));
  }

  public deleteBookmark(bookmarkId: string): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.ANNOTATIONS_API}/bookmarks/${bookmarkId}`,
        { observe: 'response' , withCredentials: true })
      .pipe(map(response => response.body));
  }

  public deleteMultipleBookmarks(payload: { deleted: string[], updated: Bookmark }): Observable<void> {
    return this.httpClient
      .request<void>('DELETE',`${this.ANNOTATIONS_API}/bookmarks_multiple`,
        { body: payload, observe: 'response' , withCredentials: true })
      .pipe(map(response => response.body));
  }
}
