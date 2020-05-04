import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import {AnnotationSet} from '../../annotations/annotation-set/annotation-set.model';

@Injectable()
export class ReductionApiService {

  public annotationApiUrl = '/em-anno';

  private annotationSetBaseUrl = '/annotation-sets';
  private annotationBaseUrl = '/annotations';

  constructor(
    private readonly httpClient: HttpClient
  ) {}

  public getReductions(documentId: string): Observable<any> { // todo add model
    const fixedUrl = `${this.annotationSetsFullUrl}/filter?documentId=${documentId}`;
    return this.httpClient
      .get<AnnotationSet>(fixedUrl, { observe: 'response' , withCredentials: true });
  }

  public saveReduction(body: Partial<AnnotationSet>): Observable<AnnotationSet> {
    return this.httpClient
      .post<AnnotationSet>(this.annotationSetsFullUrl, body, { observe: 'response' , withCredentials: true })
      .pipe(
        map(response => response.body),
        catchError(() => [])
      );
  }

  public deleteReduction(annotationId: string): Observable<null> {
    const url = `${this.annotationApiUrl}/${annotationId}`;

    return this.httpClient
      .delete<null>(url, { observe: 'response' , withCredentials: true })
      .pipe(map(response => response.body));
  }

  get annotationSetsFullUrl() {
    return this.annotationApiUrl + this.annotationSetBaseUrl;
  }

}
