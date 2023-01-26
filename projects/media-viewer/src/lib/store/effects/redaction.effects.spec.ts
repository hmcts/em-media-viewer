import { TestBed } from '@angular/core/testing';
import { cold, hot } from 'jasmine-marbles';
import { EMPTY, of, throwError } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import * as redactActions from '../actions/redaction.actions';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../reducers/reducers';
import { RedactionEffects } from './redaction.effects';
import { RedactionApiService } from '../../redaction/services/redaction-api.service';
import { Redaction } from '../../redaction/services/redaction.model';

describe('Redaction Effects', () => {
  let actions$;
  let effects: RedactionEffects;
  const redactionApi = jasmine.createSpyObj('RedactionApiService', [
    'redact',
    'deleteAllMarkers',
    'deleteRedaction',
    'saveRedaction',
    'getRedactions'
  ]);

  const redaction: Redaction = {
    redactionId: 'redactionId', documentId: 'documentId', page: 1, rectangles: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forFeature('media-viewer', reducers),
        StoreModule.forRoot({})
      ],
      providers: [
        { provide: RedactionApiService, useValue: redactionApi },
        RedactionEffects,
        provideMockActions(() => actions$)
      ]
    });
    effects = TestBed.inject(RedactionEffects);
  });

  describe('LoadRedactions', () => {
    it('should return a LoadRedactionSuccess', () => {
      const action = new redactActions.LoadRedactions('documentId');
      redactionApi.getRedactions.and.returnValue(of({ body: [redaction] }));
      const completion = new redactActions.LoadRedactionSuccess([redaction]);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadRedactions$).toBeObservable(expected);
    });

    it('should return a LoadRedactionFailure', () => {
      const action = new redactActions.LoadRedactions('documentId');
      redactionApi.getRedactions.and.returnValue(throwError('problem loading redactions'));
      const completion = new redactActions.LoadRedactionFailure('problem loading redactions');
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadRedactions$).toBeObservable(expected);
    });
  });

  describe('SaveRedaction', () => {
    it('should return a SaveRedactionSuccess', () => {
      const action = new redactActions.SaveRedaction(redaction);
      redactionApi.saveRedaction.and.returnValue(of(redaction));
      const completion = new redactActions.SaveRedactionSuccess(redaction);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.saveRedaction$).toBeObservable(expected);
    });

    it('should return a SaveRedactionFailure', () => {
      const action = new redactActions.SaveRedaction(redaction);
      redactionApi.saveRedaction.and.returnValue(throwError('problem saving redaction'));
      const completion = new redactActions.SaveRedactionFailure('problem saving redaction');
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.saveRedaction$).toBeObservable(expected);
    });
  });

  describe('DeleteRedaction', () => {
    it('should return a DeleteRedactionSuccess', () => {
      const action = new redactActions.DeleteRedaction({} as any);
      redactionApi.deleteRedaction.and.returnValue(of(null));
      const completion = new redactActions.DeleteRedactionSuccess({});
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.deleteRedaction$).toBeObservable(expected);
    });

    it('should return a SaveRedactionFailure', () => {
      const action = new redactActions.DeleteRedaction({} as any);
      redactionApi.deleteRedaction.and.returnValue(throwError('problem deleting redaction'));
      const completion = new redactActions.DeleteRedactionFailure('problem deleting redaction');
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.deleteRedaction$).toBeObservable(expected);
    });
  });

  describe('redact', () => {
    it('should return a RedactSuccess', () => {
      const action = new redactActions.Redact({
        redactions: [redaction], documentId: 'id'
      });
      const resp = { headers: { get: () => '' }, body: {} };
      redactionApi.redact.and.returnValue(of(resp));
      const completion = new redactActions.RedactSuccess({
        blob: {} as any, filename: 'redacted-document-id'
      });
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.redact$).toBeObservable(expected);
    });

    it('should return a RedactFailure', () => {
      const action = new redactActions.Redact({
        redactions: [redaction], documentId: 'documentId'
      });
      redactionApi.redact.and.returnValue(throwError('problem redacting'));
      const completion = new redactActions.RedactFailure('problem redacting');
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.redact$).toBeObservable(expected);
    });
  });

  describe('unmarkAll', () => {
    it('should return a UnmarkAllSuccess', () => {
      const action = new redactActions.UnmarkAll('documentId');
      redactionApi.deleteAllMarkers.and.returnValue(of(null));
      const completion = new redactActions.UnmarkAllSuccess();
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.unmarkAll$).toBeObservable(expected);
    });

    it('should return a DeleteRedactionFailure', () => {
      const action = new redactActions.UnmarkAll('documentId');
      redactionApi.deleteAllMarkers.and.returnValue(throwError('problem deleting all markers'));
      const completion = new redactActions.DeleteRedactionFailure('problem deleting all markers');
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.unmarkAll$).toBeObservable(expected);
    });
  });
});

