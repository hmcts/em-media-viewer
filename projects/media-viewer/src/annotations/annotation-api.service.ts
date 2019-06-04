import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnnotationSet } from './annotation-set.model';
import { Annotation } from './annotation.model';

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

  public deleteAnnotation(annotation: Annotation): Observable<HttpResponse<Annotation>> {
    const url = `/em-anno/annotations/${annotation.id}`;

    return this.httpClient.delete<Annotation>(url, { observe: 'response' });
  }

  public createAnnotation(annotation: Annotation): Observable<HttpResponse<Annotation>> {
    const url = `/em-anno/annotations`;

    return this.httpClient.post<Annotation>(url, annotation, { observe: 'response' });
  }
}
