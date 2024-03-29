import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { RedactionApiService } from '../../redaction/services/redaction-api.service';
import * as redactionActions from '../actions/redaction.actions';
import { HttpResponse } from '@angular/common/http';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';

@Injectable()
export class RedactionEffects {
  constructor(
    private actions$: Actions,
    private redactionApiService: RedactionApiService,
    private toolbarEvents: ToolbarEventService
  ) { }

  loadRedactions$ = createEffect(() =>
    this.actions$.pipe(
    ofType(redactionActions.LOAD_REDACTIONS),
    map((action: redactionActions.LoadRedactions) => action.payload),
    switchMap((documentId) => {
      return this.redactionApiService.getRedactions(documentId).pipe(
        map(resp => {
          return new redactionActions.LoadRedactionSuccess(resp.body);
        }),
        catchError(error => {
          return of(new redactionActions.LoadRedactionFailure(error));
        }));
    }))
  );

  saveRedaction$ = createEffect(() =>
    this.actions$.pipe(
    ofType(redactionActions.SAVE_REDACTION),
    map((action: redactionActions.SaveRedaction) => action.payload),
    exhaustMap((redaction) => {
      return this.redactionApiService.saveRedaction(redaction).pipe(
        map(resp => {
          return new redactionActions.SaveRedactionSuccess(resp);
        }),
        catchError(error => {
          return of(new redactionActions.SaveRedactionFailure(error));
        }));
    }))
  );

  saveBulkRedaction$ = createEffect(() =>
    this.actions$.pipe(
    ofType(redactionActions.SAVE_BULK_REDACTION),
    map((action: redactionActions.SaveRedaction) => action.payload),
    exhaustMap((redaction) => {
      return this.redactionApiService.saveBulkRedaction(redaction).pipe(
        tap(() => this.toolbarEvents.redactAllInProgressSubject.next(false))).pipe(map(resp => {
          return new redactionActions.SaveBulkRedactionSuccess(resp);
        }),
          catchError(error => {
            return of(new redactionActions.SaveBulkRedactionFailure(error));
          }));
    }))
  );

  deleteRedaction$ = createEffect(() =>
    this.actions$.pipe(
    ofType(redactionActions.DELETE_REDACTION),
    map((action: redactionActions.DeleteRedaction) => action.payload),
    exhaustMap((redactionPayload) => {
      return this.redactionApiService.deleteRedaction(redactionPayload).pipe(
        map(() => {
          return new redactionActions.DeleteRedactionSuccess(redactionPayload);
        }),
        catchError(error => {
          return of(new redactionActions.DeleteRedactionFailure(error));
        }));
    }))
  );

  redact$ = createEffect(() =>
    this.actions$.pipe(
    ofType(redactionActions.REDACT),
    map((action: redactionActions.Redact) => action.payload),
    exhaustMap((redactionPayload) => {
      return this.redactionApiService.redact(redactionPayload).pipe(
        map((result: HttpResponse<Blob>) => {
          const header = result.headers.get('content-disposition').split('filename=');
          const filename = header.length > 1 ? header[1].replace(/"/g, '')
            : `redacted-document-${redactionPayload.documentId}`;
          return new redactionActions.RedactSuccess({ blob: result.body, filename });
        }),
        catchError(error => {
          return of(new redactionActions.RedactFailure(error));
        }));
    }))
  );

  unmarkAll$ = createEffect(() =>
    this.actions$.pipe(
    ofType(redactionActions.UNMARK_ALL),
    map((action: redactionActions.UnmarkAll) => action.payload),
    exhaustMap((documentId) => {
      return this.redactionApiService.deleteAllMarkers(documentId).pipe(
        map(result => {
          return new redactionActions.UnmarkAllSuccess();
        }),
        catchError(error => {
          return of(new redactionActions.DeleteRedactionFailure(error));
        }));
    }))
  );
}

