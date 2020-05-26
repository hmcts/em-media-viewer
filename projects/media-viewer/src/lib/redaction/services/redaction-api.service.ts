import {Observable} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import {AnnotationSet} from '../../annotations/annotation-set/annotation-set.model';

@Injectable()
export class RedactionApiService {

  public redactionApiUrl = '/api/markups/';
  public redactApiUrl = '/api/redaction/';

  constructor(
    private readonly httpClient: HttpClient
  ) {}

  public getRedactions(documentId: string): Observable<any> { // todo add model
    const fixedUrl = `${this.redactionApiUrl}${documentId}`;
    return this.httpClient
      .get<AnnotationSet>(fixedUrl, { observe: 'response' , withCredentials: true });
  }

  public saveRedaction(body): Observable<any> {
    return this.httpClient
      .post<AnnotationSet>(this.redactionApiUrl, body, { observe: 'response' , withCredentials: true })
      .pipe(
        map(response => response.body),
        catchError(() => [])
      );
  }

  public deleteRedaction(payload): Observable<null> {
    const url = `${this.redactionApiUrl}${payload.documentId}/${payload.redactionId}`;
    return this.httpClient
      .delete<null>(url, { observe: 'response' , withCredentials: true })
      .pipe(map(response => response.body));
  }

  public deleteAllMarkers(payload): Observable<null> {
    const url = `${this.redactionApiUrl}/${payload}`;

    return this.httpClient
      .delete<null>(url, { observe: 'response' , withCredentials: true })
      .pipe(map(response => response.body));
  }

  public redact(payload): Observable<HttpResponse<Blob>> {
    return this.httpClient
      .post<Blob>(this.redactApiUrl, payload, { observe: 'response' , withCredentials: true, responseType: 'blob' as 'json' })
      .pipe(
        map(response => response),
        catchError(() => [])
      );
  }

}
