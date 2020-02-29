import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {AnnotationApiService} from '../../annotations/annotation-api.service';
import * as annotationsActions from '../actions';

@Injectable()
export class AnnotationEffects {
  constructor(
    private actions$: Actions,
    private annotationApiService: AnnotationApiService,
  ) { }

  @Effect()
  loadUsers$ = this.actions$.pipe(
    ofType(annotationsActions.LOAD_ANNOTATION_SET),
    map((action: annotationsActions.LoadAnnotationSet) => action.payload),
    switchMap((url) => {
      return this.annotationApiService.getAnnotationSet(url).pipe(
        map(annotations => {
          return new annotationsActions.LoadAnnotationSetSucess(annotations);
        }),
        catchError(error => {
          return of(new annotationsActions.LoadAnnotationSetFail(error));
        }));
    }));
}

