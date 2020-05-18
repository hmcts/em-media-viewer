import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {catchError, exhaustMap, map, switchMap} from 'rxjs/operators';
import { of } from 'rxjs';
import {RedactionApiService} from '../../redaction/services/redaction-api.service'
import * as redactionActions from '../actions/redaction.actions';
import {HttpResponse} from '@angular/common/http';

@Injectable()
export class RedactionEffects {
  constructor(
    private actions$: Actions,
    private redactionApiService: RedactionApiService,
  ) { }

  @Effect()
  loadRedactions$ = this.actions$.pipe(
    ofType(redactionActions.LOAD_REDACTIONS),
    map((action: redactionActions.LoadRedactions) => action.payload),
    switchMap((documentId) => {
      return this.redactionApiService.getRedactions(documentId).pipe(
        map(annotations => {
          return new redactionActions.LoadRedactionSuccess(annotations.body);
        }),
        catchError(error => {
          return of(new redactionActions.LoadRedactionFail(error));
        }));
    }));

  @Effect()
  saveRedaction = this.actions$.pipe(
    ofType(redactionActions.SAVE_REDACTION),
    map((action: redactionActions.SaveRedaction) => action.payload),
    exhaustMap((annotation) => {
      return this.redactionApiService.saveRedaction(annotation).pipe(
        map(annotations => {
          return new redactionActions.SaveRedactionSuccess(annotations);
        }),
        catchError(error => {
          return of(new redactionActions.SaveRedactionFail(error));
        }));
    }));

  @Effect()
  deleteRedaction$ = this.actions$.pipe(
    ofType(redactionActions.DELETE_REDACTION),
    map((action: redactionActions.DeleteRedaction) => action.payload),
    exhaustMap((redactionPayload) => {
      return this.redactionApiService.deleteRedaction(redactionPayload).pipe(
        map(result => {
          return new redactionActions.DeleteRedactionSuccess(redactionPayload);
        }),
        catchError(error => {
          return of(new redactionActions.DeleteRedactionFail(error));
        }));
    }));

  @Effect()
  redact$ = this.actions$.pipe(
    ofType(redactionActions.REDACT),
    map((action: redactionActions.Redact) => action.payload),
    exhaustMap((redactionPayload) => {
      return this.redactionApiService.redact(redactionPayload).pipe(
        map((result: HttpResponse<Blob>) => {
          const url = URL.createObjectURL(result.body);
          const header = result.headers.get('content-disposition').split('filename=');
          const filename = header.length > 1 ? header[1].replace(/"/g, '')
            : `redacted-document-${redactionPayload.documentId}`;
          return new redactionActions.RedactSuccess({ url, filename });
        }),
        catchError(error => {
          return of(new redactionActions.RedactFail(error));
        }));
    }));

  @Effect()
  unmarkAll = this.actions$.pipe(
    ofType(redactionActions.UNMARK_ALL),
    map((action: redactionActions.Redact) => action.payload),
    exhaustMap((redactionPayload) => {
      return this.redactionApiService.deleteAllMarkers(redactionPayload).pipe(
        map(result => {
          return new redactionActions.UnmarkAllSuccess();
        }),
        catchError(error => {
          return of(new redactionActions.DeleteRedactionFail(error));
        }));
    }));
}

