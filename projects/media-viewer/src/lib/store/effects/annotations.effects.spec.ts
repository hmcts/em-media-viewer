import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { hot, cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import * as annotationActions from '../actions/annotations.action';
import {AnnotationApiService} from '../../annotations/annotation-api.service';
import {AnnotationEffects} from './annotations.effect';


describe('Annotations Effects', () => {
  let actions$;
  let effects: AnnotationEffects;
  const UserServiceMock = jasmine.createSpyObj('AnnotationApiService', [
    'getAnnotationSet',
    'postAnnotation',
    'deleteAnnotation'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: AnnotationApiService,
          useValue: UserServiceMock,
        },
        AnnotationEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(AnnotationEffects);

  });

  const returnValue: any = {
      mock1: 'something',
      mock2: 'something',
      mock3: 'something',
      tags: []
  };

  describe('loadAnnotation$', () => {
    it('should return a LoadAnnotationSetSuccess', () => {
      const action = new annotationActions.LoadAnnotationSet('assets/example4.pdf');
      UserServiceMock.getAnnotationSet.and.returnValue(of({ body: returnValue, status: 200 }));
      const completion = new annotationActions.LoadAnnotationSetSucess({ body: returnValue, status: 200 });
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadAnnotation$).toBeObservable(expected);
    });
  });

  describe('postAnnotation$', () => {
    it('should return a SaveAnnotationSuccess', () => {
      const action = new annotationActions.SaveAnnotation('12345');
      UserServiceMock.postAnnotation.and.returnValue(of(returnValue));
      const completion = new annotationActions.SaveAnnotationSuccess(returnValue);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.postAnnotation$).toBeObservable(expected);
    });
  });

  describe('deleteAnnotation$', () => {
    it('should return a DeleteAnnotationSuccess', () => {
      const action = new annotationActions.DeleteAnnotation('1bee8923-c936-47f6-9186-52581e4901fd');
      UserServiceMock.deleteAnnotation.and.returnValue(of('1bee8923-c936-47f6-9186-52581e4901fd'));
      const completion = new annotationActions.DeleteAnnotationSuccess('1bee8923-c936-47f6-9186-52581e4901fd');
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.deleteAnnotation$).toBeObservable(expected);
    });
  });


});
