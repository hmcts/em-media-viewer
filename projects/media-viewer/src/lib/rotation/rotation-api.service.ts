import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Rotation } from './rotation.model';

@Injectable()
export class RotationApiService {

  public rotationApiUrl = '/documents';

  constructor(
    private readonly httpClient: HttpClient
  ) {}

  public getRotation(documentId: string): Observable<any> { // todo add model
    const fixedUrl = `${this.rotationApiUrl}/${documentId}`;
    return this.httpClient
      .get<any>(fixedUrl, { observe: 'response' , withCredentials: true });
  }

  public saveRotation(payload: Rotation): Observable<any> { // todo add model
    const documentId = Object.keys(payload.metadata)[0];
    const body = payload;
    const fixedUrl = `${this.rotationApiUrl}/${documentId}`;

    return this.httpClient
      .patch<any>(fixedUrl, body, { observe: 'response' , withCredentials: true })
      .pipe(
        map(response => response),
        catchError(() => [])
      );
  }

}
