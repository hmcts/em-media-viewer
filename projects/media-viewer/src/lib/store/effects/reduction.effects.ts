import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {catchError, exhaustMap, map, switchMap} from 'rxjs/operators';
import { of } from 'rxjs';
import {ReductionApiService} from '../../reductions/services/reduction-api.service'
import * as reductionActions from '../actions/reduction.actions';

@Injectable()
export class ReductionEffects {
  constructor(
    private actions$: Actions,
    private reductionApiService: ReductionApiService,
  ) { }

  @Effect()
  loadReductions$ = this.actions$.pipe(
    ofType(reductionActions.LOAD_REDUCTIONS),
    map((action: reductionActions.LoadReductions) => action.payload),
    switchMap((documentId) => {
      return this.reductionApiService.getReductions(documentId).pipe(
        map(annotations => {
          return new reductionActions.LoadReductionSuccess(annotations.body);
        }),
        catchError(error => {
          return of(new reductionActions.LoadReductionFail(error));
        }));
    }));

  @Effect()
  saveReduction = this.actions$.pipe(
    ofType(reductionActions.SAVE_REDUCTION),
    map((action: reductionActions.SaveReduction) => action.payload),
    exhaustMap((annotation) => {
      return this.reductionApiService.saveReduction(annotation).pipe(
        map(annotations => {
          return new reductionActions.SaveReductionSuccess(annotations);
        }),
        catchError(error => {
          return of(new reductionActions.SaveReductionFail(error));
        }));
    }));

  @Effect()
  deleteReduction$ = this.actions$.pipe(
    ofType(reductionActions.DELETE_REDUCTION),
    map((action: reductionActions.DeleteReduction) => action.payload),
    exhaustMap((redactionPayload) => {
      return this.reductionApiService.deleteRedaction(redactionPayload).pipe(
        map(result => {
          return new reductionActions.DeleteReductionSuccess(redactionPayload);
        }),
        catchError(error => {
          return of(new reductionActions.DeleteReductionFail(error));
        }));
    }));

  @Effect()
  redact$ = this.actions$.pipe(
    ofType(reductionActions.REDACT),
    map((action: reductionActions.Redact) => action.payload),
    exhaustMap((redactionPayload) => {
      return this.reductionApiService.redact(redactionPayload).pipe(
        map(result => {

          return new reductionActions.DeleteReductionSuccess(result);
        }),
        catchError(error => {
          return of(new reductionActions.DeleteReductionFail(error));
        }));
    }));

  @Effect()
  unmarkAll = this.actions$.pipe(
    ofType(reductionActions.UNMARK_ALL),
    map((action: reductionActions.Redact) => action.payload),
    exhaustMap((redactionPayload) => {
      return this.reductionApiService.deleteAllMarkers(redactionPayload).pipe(
        map(result => {
          return new reductionActions.UnmarkAllSuccess();
        }),
        catchError(error => {
          return of(new reductionActions.DeleteReductionFail(error));
        }));
    }));
}
