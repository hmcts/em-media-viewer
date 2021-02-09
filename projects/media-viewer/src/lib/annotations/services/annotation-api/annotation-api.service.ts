import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import uuid from 'uuid/v4';

import { AnnotationSet } from '../../annotation-set/annotation-set.model';
import { Annotation } from '../../annotation-set/annotation-view/annotation.model';
import { Comment } from '../../comment-set/comment/comment.model';

@Injectable()
export class AnnotationApiService {

  public annotationApiUrl = '/em-anno';

  private annotationSetBaseUrl = '/annotation-sets';
  private annotationBaseUrl = '/annotations';

  constructor(
    private readonly httpClient: HttpClient
  ) {}

  public getAnnotationSet(documentId: string): Observable<any> { // todo add model
    const fixedUrl = `${this.annotationSetsFullUrl}/filter?documentId=${documentId}`;
    return this.httpClient
      .get<AnnotationSet>(fixedUrl, { observe: 'response' , withCredentials: true });
  }

  public postAnnotationSet(body: Partial<AnnotationSet>): Observable<AnnotationSet> {
    return this.httpClient
      .post<AnnotationSet>(this.annotationSetsFullUrl, body, { observe: 'response' , withCredentials: true })
      .pipe(
        map(response => response.body),
        catchError(() => [])
      );
  }

  public getComments(annotationSet: Observable<AnnotationSet>): Observable<Comment[]> {
    return annotationSet
      .pipe(
        map(this.sortAnnotations),
        map(this.extractComments),
        catchError(() => [])
      );
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
      .delete<null>(url, { observe: 'response' , withCredentials: true })
      .pipe(map(response => response.body));
  }

  public postAnnotation(annotation: Partial<Annotation>): Observable<Annotation> {
    return this.httpClient
      .post<Annotation>(this.annotationFullsUrl, annotation, { observe: 'response' , withCredentials: true })
      .pipe(map(response => response.body));
  }

  get annotationSetsFullUrl() {
    return this.annotationApiUrl + this.annotationSetBaseUrl;
  }

  get annotationFullsUrl() {
    return this.annotationApiUrl + this.annotationBaseUrl;
  }
}
