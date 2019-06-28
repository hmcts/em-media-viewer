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

  constructor(
    private readonly httpClient: HttpClient
  ) { }

  public postAnnotationSet(body: Partial<AnnotationSet>): Observable<AnnotationSet> {
    const url = '/em-anno/annotation-sets';

    return this.httpClient
      .post<AnnotationSet>(url, body, { observe: 'response' })
      .pipe(map(response => response.body));
  }

  public getAnnotationSet(documentId: string): Observable<AnnotationSet> {
    const url = `/em-anno/annotation-sets/filter?documentId=${documentId}`;

    return this.httpClient
      .get<AnnotationSet>(url, { observe: 'response' })
      .pipe(map(response => response.body))
      .pipe(catchError(() => []));
  }

  public getComments(documentId: string): Observable<Comment[]> {
    return this.getAnnotationSet(documentId)
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
    const url = `/em-anno/annotations/${annotationId}`;

    return this.httpClient
      .delete<null>(url, { observe: 'response' })
      .pipe(map(response => response.body));
  }

  public postAnnotation(annotation: Partial<Annotation>): Observable<Annotation> {
    const url = `/em-anno/annotations`;

    return this.httpClient
      .post<Annotation>(url, annotation, { observe: 'response' })
      .pipe(map(response => response.body));
  }

  public getOrCreateAnnotationSet(documentId: string): Observable<AnnotationSet> {
    const url = `/em-anno/annotation-sets/filter?documentId=${documentId}`;

    return this.httpClient
      .get<AnnotationSet>(url, { observe: 'response' })
      .pipe(map(response => response.body))
      .pipe(catchError(() => this.postAnnotationSet({ id: uuid(), documentId })));
  }
}
