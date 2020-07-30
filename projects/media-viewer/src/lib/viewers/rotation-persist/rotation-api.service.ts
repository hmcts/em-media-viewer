import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Rotation } from './rotation.model';

@Injectable()
export class RotationApiService {

  public rotationApiUrl = '/em-anno/metadata';

  constructor(
    private readonly httpClient: HttpClient
  ) {}

  public getRotation(documentId: string): Observable<HttpResponse<Rotation>> {
    const fixedUrl = `${this.rotationApiUrl}/${documentId}`;
    return this.httpClient
      .get<Rotation>(fixedUrl, { observe: 'response' , withCredentials: true });
  }

  public saveRotation(payload: Rotation): Observable<HttpResponse<Rotation>> {
    const fixedUrl = `${this.rotationApiUrl}/`;
    return this.httpClient
      .post<any>(fixedUrl, payload, { observe: 'response' , withCredentials: true })
      .pipe(
        map(response => response),
        catchError(() => [])
      );
  }

}
