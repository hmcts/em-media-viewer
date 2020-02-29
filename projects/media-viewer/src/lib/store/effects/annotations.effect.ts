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
  loadAnnotation$ = this.actions$.pipe(
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

  @Effect()
  postAnnotation$ = this.actions$.pipe(
    ofType(annotationsActions.SAVE_ANNOTATION),
    map((action: annotationsActions.SaveAnnotation) => action.payload),
    switchMap((annotation) => {
      return this.annotationApiService.postAnnotation(annotation).pipe(
        map(annotations => {
          return new annotationsActions.SaveAnnotationSuccess(annotations);
        }),
        catchError(error => {
          return of(new annotationsActions.LoadAnnotationSetFail(error));
        }));
    }));
}

