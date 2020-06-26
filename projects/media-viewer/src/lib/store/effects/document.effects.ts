import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { DocumentConversionApiService } from '../../viewers/convertible-content-viewer/document-conversion-api.service';
import { of } from 'rxjs';
import * as documentActions from '../actions/document.action';

@Injectable()
export class DocumentEffects {
  constructor(
    private actions$: Actions,
    private documentConversionService: DocumentConversionApiService,
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
}
