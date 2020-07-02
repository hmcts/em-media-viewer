import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { catchError, exhaustMap, map, switchMap } from 'rxjs/operators';
import { DocumentConversionApiService } from '../../viewers/convertible-content-viewer/document-conversion-api.service';
import { RotationApiService } from '../../rotation/rotation-api.service';
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
    exhaustMap((docConversionPayload) => {
      return this.documentConversionService.convert(docConversionPayload).pipe(
        map((result: HttpResponse<Blob>) => {
          const url = URL.createObjectURL(result.body);
          return new documentActions.ConvertSuccess(url);
        }),
        catchError(error => {
          return of(new documentActions.ConvertFail(error));
        }));
    }));
    
  @Effect()
  loadRotation$ = this.actions$.pipe(
    ofType(documentActions.LOAD_ROTATION),
    map((action: documentActions.LoadRotation) => action.payload),
    switchMap((documentId) => {
      return this.rotationApiService.getRotation(documentId).pipe(
        map(rotation => {
          return new documentActions.LoadRotationSuccess(rotation);
        }),
        catchError(error => {
          return of(new documentActions.LoadRotationFail(error));
        }));
    }));

  @Effect()
  saveRotation$ = this.actions$.pipe(
    ofType(documentActions.SAVE_ROTATION),
    map((action: documentActions.SaveRotation) => action.payload),
    switchMap((payload) => {
      return this.rotationApiService.saveRotation(payload).pipe(
        map(response => {
          return new documentActions.SaveRotationSuccess(response);
        }),
        catchError(error => {
          return of(new documentActions.SaveRotationFail(error));
        }));
    }));
}
