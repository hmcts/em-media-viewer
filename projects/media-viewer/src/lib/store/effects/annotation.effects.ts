import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, concatMap, exhaustMap, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { AnnotationApiService } from '../../annotations/services/annotation-api/annotation-api.service';
import * as annotationsActions from '../actions/annotation.actions';
import { Store } from '@ngrx/store';

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
    switchMap((documentId) => {
      return this.annotationApiService.getAnnotationSet(documentId).pipe(
        map(res => {
          if (res.status === 204) {
            return new annotationsActions.LoadAnnotationSetFail(res);
          }
          return new annotationsActions.LoadAnnotationSetSucess(res);
        }),
        catchError(error => {
          return of(new annotationsActions.LoadAnnotationSetFail(error));
        }));
    }));

  @Effect()
  postAnnotation$ = this.actions$.pipe(
    ofType(annotationsActions.SAVE_ANNOTATION),
    concatMap((action: annotationsActions.SaveAnnotation) => {
      return this.annotationApiService.postAnnotation(action.payload).pipe(
        map(annotations => {
          return new annotationsActions.SaveAnnotationSuccess(annotations);
        }),
        catchError(error => {
          return of(new annotationsActions.LoadAnnotationSetFail(error));
        }));
    }));


  // map((action: annotationsActions.SaveAnnotation) => action.payload),
  // switchMap((annotation) => {
  //   return this.annotationApiService.postAnnotation(annotation).pipe(
  //     map(annotations => {
  //       return new annotationsActions.SaveAnnotationSuccess(annotations);
  //     }),
  //     catchError(error => {
  //       return of(new annotationsActions.LoadAnnotationSetFail(error));
  //     }));
  // }));

  @Effect()
  deleteAnnotation$ = this.actions$.pipe(
    ofType(annotationsActions.DELETE_ANNOTATION),
    map((action: annotationsActions.DeleteAnnotation) => action.payload),
    exhaustMap((annotation) => {
      return this.annotationApiService.deleteAnnotation(annotation).pipe(
        map(result => {
          return new annotationsActions.DeleteAnnotationSuccess(annotation);
        }),
        catchError(error => {
          return of(new annotationsActions.DeleteAnnotationFail(error));
        }));
    }));

  @Effect()
  saveAnnotationSet$ = this.actions$.pipe(
    ofType(annotationsActions.SAVE_ANNOTATION_SET),
    map((action: annotationsActions.SaveAnnotationSet) => action.payload),
    switchMap((annotationSet) => {
      return this.annotationApiService.postAnnotationSet(annotationSet).pipe(
        map(res => {
          return new annotationsActions.SaveAnnotationSetSucess(res);
        }),
        catchError(error => {
          return of(new annotationsActions.SaveAnnotationSetFail(error));
        }));
    }));
}
