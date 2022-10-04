import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import * as documentActions from '../actions/document.actions';
import { DocumentEffects } from './document.effects';
import { DocumentConversionApiService } from '../../viewers/convertible-content-viewer/document-conversion-api.service';
import { cold, hot } from 'jasmine-marbles';
import { RotationApiService } from '../../viewers/rotation-persist/rotation-api.service';


describe('Document Effects', () => {
  let actions$;
  let effects: DocumentEffects;
  const rotateApi = jasmine.createSpyObj('RotationApiService', ['getRotation', 'saveRotation']);
  const docConvertApi = jasmine.createSpyObj('DocumentConversionApiService', ['convert']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DocumentConversionApiService, useValue: docConvertApi },
        { provide: RotationApiService, useValue: rotateApi },
        DocumentEffects,
        provideMockActions(() => actions$)
      ]
    });
    effects = TestBed.get(DocumentEffects);
  });

  describe('convert$', () => {
    it('should return a ConvertSuccess', () => {
      const action = new documentActions.Convert('document-id');
      docConvertApi.convert.and.returnValue(of({ body: 'blob' }));
      spyOn(URL, 'createObjectURL').and.returnValue('blob-url');

      const completion = new documentActions.ConvertSuccess('blob-url');
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.convert$).toBeObservable(expected);
    });

    it('should return a ConvertFailure', () => {
      const action = new documentActions.Convert('document-url');
      docConvertApi.convert.and.returnValue(throwError('error converting document'));

      const completion = new documentActions.ConvertFailure('error converting document');
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.convert$).toBeObservable(expected);
    });
  });

  describe('loadRotation$', () => {
    it('should return a LoadRotationSuccess', () => {
      const action = new documentActions.LoadRotation('document-id');
      rotateApi.getRotation.and.returnValue(of({ body: { rotationAngle: 90 } }));

      const completion = new documentActions.LoadRotationSuccess({ rotationAngle: 90 });
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadRotation$).toBeObservable(expected);
    });

    it('should return a LoadRotationFailure', () => {
      const action = new documentActions.LoadRotation('document-id');
      rotateApi.getRotation.and.returnValue(throwError(new Error('error loading rotation')));
      const completion = new documentActions.LoadRotationFailure(new Error('error loading rotation'));
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadRotation$).toBeObservable(expected);
    });
  });

  describe('saveRotation$', () => {
    it('should return a SaveRotationSuccess', () => {
        const action = new documentActions.SaveRotation({ documentId: 'documentId', rotationAngle: 180 });
        rotateApi.saveRotation.and.returnValue(of({ body: { rotationAngle: 180 } }));

        const completion = new documentActions.SaveRotationSuccess({ rotationAngle: 180 });
        actions$ = hot('-a', { a: action });
        const expected = cold('-b', { b: completion });
        expect(effects.saveRotation$).toBeObservable(expected);
      });

    it('should return a SaveRotationFailure', () => {
      const action = new documentActions.SaveRotation({ documentId: 'documentId', rotationAngle: 180 });
      rotateApi.saveRotation.and.returnValue(throwError(new Error('error saving rotation')));
      const completion = new documentActions.SaveRotationFailure(new Error('error saving rotation'));
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.saveRotation$).toBeObservable(expected);
    });
  });
});
