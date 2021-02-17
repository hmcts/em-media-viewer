import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { IcpSessionApiService } from '../../icp/icp-session-api.service';
import { IcpUpdateService } from '../../icp/icp-update.service';
import * as icpActions from '../actions/icp.action' ;
import { IcpSession } from '../../icp/icp.interfaces';

@Injectable()
export class IcpEffects {

  constructor(private actions$: Actions,
              private icpApiService: IcpSessionApiService,
              private icpUpdateService: IcpUpdateService) {}

  @Effect()
  loadIcpSession$ = this.actions$.pipe(
    ofType(icpActions.LOAD_ICP_SESSION),
    map((action: icpActions.LoadIcpSession) => action.payload),
    exhaustMap((caseId: string) =>
      this.icpApiService.loadSession(caseId)
        .pipe(
          map(res => new icpActions.JoinIcpSocketSession(res)),
          catchError(error => of(new icpActions.LoadIcpSessionFailure(error)))
        )
    ));


  @Effect()
  joinIcpSocketSession$ = this.actions$.pipe(
    ofType(icpActions.JOIN_ICP_SOCKET_SESSION),
    map((action: icpActions.JoinIcpSocketSession) => action.payload),
    switchMap((res: {username: string, session: IcpSession}) =>
      this.icpUpdateService.joinSession(res.username, res.session)
        .pipe(map(participants => new icpActions.IcpSocketSessionJoined({session: res.session, participantInfo: participants})))
    ));
}
