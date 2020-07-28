import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { catchError, exhaustMap, map, switchMap } from 'rxjs/operators';
import { DocumentConversionApiService } from '../../viewers/convertible-content-viewer/document-conversion-api.service';
import { RotationApiService } from '../../viewers/rotation-persist/rotation-api.service';
import { of } from 'rxjs';
import * as documentActions from '../actions/document.action';

@Injectable()
export class DocumentEffects {
  constructor(
    private actions$: Actions,
    private documentConversionService: DocumentConversionApiService,
    private rotationApiService: RotationApiService,
  ) { }

  @Effect()
  convert$ = this.actions$.pipe(
    ofType(documentActions.CONVERT),
    map((action: documentActions.Convert) => action.payload),
    exhaustMap((documentId) => {
      return this.documentConversionService.convert(documentId).pipe(
        map((result: HttpResponse<Blob>) => {
          const url = URL.createObjectURL(result.body);
          return new documentActions.ConvertSuccess(url);
        }),
        catchError(error => {
          return of(new documentActions.ConvertFailure(error));
        }));
    }));

  @Effect()
  loadRotation$ = this.actions$.pipe(
    ofType(documentActions.LOAD_ROTATION),
    map((action: documentActions.LoadRotation) => action.payload),
    switchMap((documentId) => {
      return this.rotationApiService.getRotation(documentId).pipe(
        map(resp => {
          return new documentActions.LoadRotationSuccess(resp.body);
        }),
        catchError(error => {
          return of(new documentActions.LoadRotationFailure(error));
        }));
    }));

  @Effect()
  saveRotation$ = this.actions$.pipe(
    ofType(documentActions.SAVE_ROTATION),
    map((action: documentActions.SaveRotation) => action.payload),
    switchMap((payload) => {
      return this.rotationApiService.saveRotation(payload).pipe(
        map(resp => {
          return new documentActions.SaveRotationSuccess(resp.body);
        }),
        catchError(error => {
          return of(new documentActions.SaveRotationFailure(error));
        }));
    }));
}
