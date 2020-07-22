import { select, Store, StoreModule } from '@ngrx/store';
import { reducers, State } from '../reducers/reducers';
import { TestBed } from '@angular/core/testing';
import * as fromSelectors from './icp.selectors';
import * as fromActions from '../actions/icp.action';

const icpState = {
  session : {
    caseId: 'caseId',
    sessionId: 'sessionId',
    dateOfHearing: new Date()
  },
  client: {
    id: 'clientId',
    username: 'name'
  },
  presenter: {
    id: 'presenterId',
    username: 'name'
  },
  participants: [ {
    id: 'participantId',
    username: 'name'
  } ]
};

describe('Icp selectors', () => {
  let store: Store<State>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('media-viewer', reducers),
      ],
    });
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getIcpState', () => {
    it('should return the state', () => {
      let result;
      store.pipe(select(fromSelectors.getIcpState)).subscribe(value => result = value);

      const joinPayload = {
        session: icpState.session,
        participantInfo: {
          client: icpState.client,
          presenter: icpState.presenter
        }
      };
      store.dispatch(new fromActions.IcpSocketSessionJoined(joinPayload));

      const participantPayload = { 'participantId': 'name' }
      store.dispatch(new fromActions.IcpParticipantListUpdated(participantPayload));

      expect(result).toEqual(icpState);
    });
  });

  describe('getCaseId', () => {
    it('should return the case id', () => {
      let result;
      store.pipe(select(fromSelectors.getCaseId)).subscribe(value => result = value);

      store.dispatch(new fromActions.SetCaseId(icpState.session.caseId));
      expect(result).toEqual(icpState.session.caseId);
    });
  });

  describe('getIcpSession', () => {
    it('should return the session', () => {
      let result;
      store.pipe(select(fromSelectors.getIcpSession)).subscribe(value => result = value);

      const payload = {
        session: icpState.session,
        participantInfo: {
          client: icpState.client,
          presenter: icpState.presenter
        }
      };
      store.dispatch(new fromActions.IcpSocketSessionJoined(payload));
      expect(result).toEqual(icpState.session);
    });
  });

  describe('getIcpPresenter', () => {
    it('should return icp presenter', () => {
      let result;
      store.pipe(select(fromSelectors.getPresenter)).subscribe(value => result = value);
      store.dispatch(new fromActions.IcpPresenterUpdated(icpState.presenter));
      expect(result).toEqual(icpState.presenter);
    });
  });

  describe('getIcpPresenterName', () => {
    it('should return the presenter name', () => {
      let result;
      store.pipe(select(fromSelectors.getPresenterName)).subscribe(value => result = value);
      store.dispatch(new fromActions.IcpPresenterUpdated(icpState.presenter));
      expect(result).toEqual(icpState.presenter.username);
    });
  });

  describe('isPresenter', () => {
    it('should return true if client is presenter', () => {
      let result;
      store.pipe(select(fromSelectors.isPresenter)).subscribe(value => result = value);

      const payload = {
        session: icpState.session,
        participantInfo: {
          client: icpState.client,
          presenter: icpState.presenter
        }
      };
      store.dispatch(new fromActions.IcpSocketSessionJoined(payload));

      const newPresenter = {
        id: 'clientId',
        username: 'name'
      };
      store.dispatch(new fromActions.IcpPresenterUpdated(newPresenter));
      expect(result).toEqual(true);
    });
  });
});
