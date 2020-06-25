import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { hot, cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import * as documentActions from '../actions/document.action';
import { DocumentEffects } from './document.effects';
import { DocumentConversionApiService } from '../../viewers/convertible-content-viewer/document-conversion-api.service';
import { HttpResponse } from '@angular/common/http';


describe('Document Effects', () => {
  let actions$;
  let effects: DocumentEffects;
  const UserServiceMock = jasmine.createSpyObj('DocumentConversionApiService', [
    'convert'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: DocumentConversionApiService,
          useValue: UserServiceMock,
        },
        DocumentEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(DocumentEffects);

  });

  const blob = new Blob(['aaaaa'], { type: 'text/plain' });
  blob['lastModifiedDate'] = '';
  blob['name'] = 'fileName';
  const returnValue: HttpResponse<Blob> = new HttpResponse<Blob>({body: blob, url: 'test'});

  // describe('covert$', () => {
  //   it('should return a ConvertSuccess', () => {
  //     const action = new documentActions.Convert('1bee8923-c936-47f6-9186-52581e4901fd');
  //     UserServiceMock.convert.and.returnValue(of({returnValue}));
  //     const completion = new documentActions.ConvertSuccess(URL.createObjectURL(returnValue.body));
  //     actions$ = hot('-a', { a: action });
  //     const expected = cold('-b', { b: completion });
  //     expect(effects.covert$).toBeObservable(expected);
  //   });
  // });

});
