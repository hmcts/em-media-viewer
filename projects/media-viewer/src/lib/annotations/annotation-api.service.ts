import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnnotationSet } from './annotation-set.model';
import { Annotation } from './annotation.model';
import { Comment } from './comment/comment.model';
import dummyAnnotationSet from '../../assets/annotation-set.json';
import { map } from 'rxjs/operators';

@Injectable()
export class AnnotationApiService {

  constructor(
    private readonly httpClient: HttpClient
  ) { }

  public createAnnotationSet(body: Partial<AnnotationSet>): Observable<HttpResponse<AnnotationSet>> {
    const url = '/em-anno/annotation-sets';

    return this.httpClient.post<AnnotationSet>(url, body, { observe: 'response' });
  }

  public getAnnotationSet(documentId: string): Observable<HttpResponse<AnnotationSet>> {
    const url = `/em-anno/annotation-sets/filter?documentId=${documentId}`;

    return this.httpClient.get<AnnotationSet>(url, { observe: 'response' });
  }

  public getComments(documentId: string): Observable<Comment[]> {
    const response = new Subject<HttpResponse<AnnotationSet>>();

    setTimeout(() => response.next(new HttpResponse({
      body: dummyAnnotationSet
    })), 1000);

    // uncomment after removing the mock
    // return this.getAnnotationSet(documentId)
    return response
      .pipe(map(this.sortAnnotations))
      .pipe(map(this.extractComments));
  }

  /**
   * Sort the annotations in the response by page and then y position of their first rectangle
   */
  private sortAnnotations(r: HttpResponse<AnnotationSet>): Annotation[] {
    return r.body.annotations.sort((a, b) => a.page !== b.page ? a.page - b.page : a.rectangles[0].y - b.rectangles[0].y);
  }

  private extractComments(annotations: Annotation[]) {
    return [].concat(...annotations.map(a => a.comments));
  }

  public deleteAnnotation(annotation: Annotation): Observable<HttpResponse<Annotation>> {
    const url = `/em-anno/annotations/${annotation.id}`;

    return this.httpClient.delete<Annotation>(url, { observe: 'response' });
  }

  public createAnnotation(annotation: Annotation): Observable<HttpResponse<Annotation>> {
    const url = `/em-anno/annotations`;

    return this.httpClient.post<Annotation>(url, annotation, { observe: 'response' });
  }
}
