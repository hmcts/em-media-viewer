import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {catchError, exhaustMap, map, switchMap} from 'rxjs/operators';
import { of } from 'rxjs';
import {AnnotationApiService} from '../../annotations/annotation-api.service';
import * as annotationsActions from '../actions/annotations.action';

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
          return new annotationsActions.LoadAnnotationSetSucess(annotations.body);
        }),
        catchError(error => {
          return of(new annotationsActions.LoadAnnotationSetFail(error));
        }));
    }));

  @Effect()
  postAnnotation$ = this.actions$.pipe(
    ofType(annotationsActions.SAVE_ANNOTATION),
    map((action: annotationsActions.SaveAnnotation) => action.payload),
    exhaustMap((annotation) => {
      return this.annotationApiService.postAnnotation(annotation).pipe(
        map(annotations => {
          return new annotationsActions.SaveAnnotationSuccess(annotations);
        }),
        catchError(error => {
          return of(new annotationsActions.LoadAnnotationSetFail(error));
        }));
    }));

  @Effect()
  deleteAnnotation$ = this.actions$.pipe(
    ofType(annotationsActions.DELETE_ANNOTATION),
    map((action: annotationsActions.DeleteAnnotation) => action.payload),
    exhaustMap((annotation) => {
      return this.annotationApiService.deleteAnnotation(annotation).pipe(
        map(result => {
          return new annotationsActions.DeleteAnnotationSucess(annotation);
        }),
        catchError(error => {
          return of(new annotationsActions.DeleteAnnotationFail(error));
        }));
    }));
}

