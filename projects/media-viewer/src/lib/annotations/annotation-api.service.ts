import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import uuid from 'uuid/v4';
import { AnnotationSet } from './annotation-set/annotation-set.model';
import { Annotation } from './annotation-set/annotation/annotation.model';
import { Comment } from './annotation-set/annotation/comment/comment.model';

@Injectable()
export class AnnotationApiService {

  private annotationSetBaseUrl = '/em-anno/annotation-sets';
  private annotationBaseUrl = '/em-anno/annotation';

  constructor(
    private readonly httpClient: HttpClient
  ) { }

  public postAnnotationSet(body: Partial<AnnotationSet>): Observable<AnnotationSet> {
    return this.httpClient
      .post<AnnotationSet>(this.annotationSetBaseUrl, body, { observe: 'response' })
      .pipe(map(response => response.body));
  }

  public getAnnotationSet(documentId: string): Observable<AnnotationSet> {
    const url = `${this.annotationSetBaseUrl}/filter?documentId=${documentId}`;

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
    const url = `${this.annotationBaseUrl}/${annotationId}`;

    return this.httpClient
      .delete<null>(url, { observe: 'response' })
      .pipe(map(response => response.body));
  }

  public postAnnotation(annotation: Partial<Annotation>): Observable<Annotation> {
    return this.httpClient
      .post<Annotation>(this.annotationBaseUrl, annotation, { observe: 'response' })
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
    return `${this.annotationSetBaseUrl}/filter?documentId=${this.extractDocumentId(url)}`;
  }

  private extractDocumentId(url: string): string {
    return url.startsWith('/documents/') ? url.split('/')[2] : url;
  }

}
