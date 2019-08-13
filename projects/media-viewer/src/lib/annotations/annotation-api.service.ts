import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import uuid from 'uuid/v4';
import { AnnotationSet } from './annotation-set/annotation-set.model';
import { Annotation } from './annotation-set/annotation/annotation.model';
import { Comment } from './comment-set/comment/comment.model';

@Injectable()
export class AnnotationApiService {

  public annotationApiUrl = '/em-anno';

  private annotationSetBaseUrl = '/annotation-sets';
  private annotationBaseUrl = '/annotations';

  constructor(
    private readonly httpClient: HttpClient
  ) { }

  public postAnnotationSet(body: Partial<AnnotationSet>): Observable<AnnotationSet> {
    return this.httpClient
      .post<AnnotationSet>(this.annotationSetsFullUrl, body, { observe: 'response' })
      .pipe(map(response => response.body));
  }

  public getAnnotationSet(documentId: string): Observable<AnnotationSet> {
    const url = `${this.annotationSetsFullUrl}/filter?documentId=${documentId}`;

    return this.httpClient
      .get<AnnotationSet>(url, { observe: 'response' })
      .pipe(map(response => response.body))
      .pipe(catchError(() => []));
  }

  public getComments(annotationSet: Observable<AnnotationSet>): Observable<Comment[]> {
    return annotationSet
      .pipe(map(this.sortAnnotations))
      .pipe(map(this.extractComments))
      .pipe(catchError(() => []));
  }

  /**
   * Sort the annotations in the response by page and then y position of their first rectangle
   */
  private sortAnnotations(r: AnnotationSet): Annotation[] {
    return r.annotations.sort((a, b) => a.page !== b.page ? a.page - b.page : a.rectangles[0].y - b.rectangles[0].y);
  }

  private extractComments(annotations: Annotation[]) {
    return [].concat(...annotations.map(a => a.comments));
  }

  public deleteAnnotation(annotationId: string): Observable<null> {
    const url = `${this.annotationFullsUrl}/${annotationId}`;

    return this.httpClient
      .delete<null>(url, { observe: 'response' })
      .pipe(map(response => response.body));
  }

  public postAnnotation(annotation: Partial<Annotation>): Observable<Annotation> {
    return this.httpClient
      .post<Annotation>(this.annotationFullsUrl, annotation, { observe: 'response' })
      .pipe(map(response => response.body));
  }

  public getOrCreateAnnotationSet(url: string): Observable<AnnotationSet> {
    const fixedUrl = this.fixFindCall(url);

    return this.httpClient
      .get<AnnotationSet>(fixedUrl, { observe: 'response' })
      .pipe(map(response => response.body))
      .pipe(catchError(() => this.postAnnotationSet({ id: uuid(), documentId: this.extractDocumentId(url) })));
  }

  private fixFindCall(url: string): string {
    return `${this.annotationSetsFullUrl}/filter?documentId=${this.extractDocumentId(url)}`;
  }

  private extractDocumentId(url: string): string {
    url = url.includes('/documents/') ? url.split('/documents/')[1] : url;
    return url.replace('/binary', '');
  }

  get annotationSetsFullUrl() {
    return this.annotationApiUrl + this.annotationSetBaseUrl;
  }

  get annotationFullsUrl() {
    return this.annotationApiUrl + this.annotationBaseUrl;
  }

}
