import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import * as documentActions from '../actions/document.action';
import { DocumentEffects } from './document.effects';
import { DocumentConversionApiService } from '../../viewers/convertible-content-viewer/document-conversion-api.service';
import { HttpResponse } from '@angular/common/http';
import { hot } from 'jasmine-marbles';


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

  describe('convert$', () => {
    it('should return a ConvertSuccess', () => {
      let blob = new Blob(['aaaaa'], { type: 'text/plain' });
      const returnValue: HttpResponse<Blob> = new HttpResponse<Blob>({body: blob, url: 'test'});

      const originalUrl = '1bee8923-c936-47f6-9186-52581e4901fd';
      const action = new documentActions.Convert(originalUrl);
      UserServiceMock.convert.and.returnValue(of(returnValue));
      const url = URL.createObjectURL(returnValue.body);

      const completion = new documentActions.ConvertSuccess(url);
      actions$ = hot('-a', { a: action });
      expect(completion.payload).not.toEqual(originalUrl);
    });
  });

});
