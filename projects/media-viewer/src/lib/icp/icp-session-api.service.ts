import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IcpSession } from './icp.interfaces';

@Injectable({ providedIn: 'root' })
export class IcpSessionApiService {

  public ICP_SESSION_API = '/icp/sessions';

  constructor(private readonly httpClient: HttpClient) { }

  public loadSession(payload: { caseId: string, documentId: string }): Observable<any> {
    return this.httpClient
      .get<{ username: string, session: IcpSession }>(`${this.ICP_SESSION_API}/${payload.caseId}/${payload.documentId}`,
        { observe: 'response', withCredentials: true })
      .pipe(map(response => response.body));
  }
}
