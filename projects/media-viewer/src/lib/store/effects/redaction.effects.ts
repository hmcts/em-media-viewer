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
    ofType(redactionActions.LOAD_REDUCTIONS),
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
    ofType(redactionActions.SAVE_REDUCTION),
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
    ofType(redactionActions.DELETE_REDUCTION),
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
          this.downloadDocument(result, redactionPayload.documentId);
          return new redactionActions.UnmarkAllSuccess();
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

  downloadDocument(result, documentId) {
    const attachmentHeader = result.headers.get('content-disposition').split('filename=');
    const objectURL = URL.createObjectURL(result.body);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = objectURL;
    a.download = attachmentHeader.length > 1 ? attachmentHeader[1].replace('"','') : `redacted-document-${documentId}`;
    a.click();
    a.remove();
  }
}

