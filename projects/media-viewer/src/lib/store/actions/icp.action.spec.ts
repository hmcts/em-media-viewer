import * as fromIcp from './icp.action';
import {IcpParticipant} from '../reducers/icp.reducer';

describe('Icp actions', () => {
  describe('Load Session', () => {
    describe('Load Session', () => {
      it('should create an action', () => {
        const action = new fromIcp.LoadIcpSession('caseId');
        expect({...action}).toEqual({
          type: fromIcp.LOAD_ICP_SESSION,
          payload: 'caseId'
        });
      });
    });

    describe('Load Session Failure', () => {
      it('should create an action', () => {
        const error: any = 'some error';
        const action = new fromIcp.LoadIcpSessionFailure(error);
        expect({...action}).toEqual({
          type: fromIcp.LOAD_ICP_SESSION_FAIL,
          payload: error
        });
      });
    });
  });

  describe('Join Socket Session ', () => {
    describe('Join Socket Session', () => {
      it('should create an action', () => {
        const payload = {
          username: 'name',
          session: {
            sessionId: 'sessionId',
            caseId: 'caseId',
            dateOfHearing: new Date()
          }
        };
        const action = new fromIcp.JoinIcpSocketSession(payload);
        expect({...action}).toEqual({
          type: fromIcp.JOIN_ICP_SOCKET_SESSION,
          payload: payload
        });
      });

      describe('Socket Session Joined', () => {
        it('should create an action', () => {
          const payload = {
            participantInfo: {
              client: {
                id: 'clientId',
                username: 'name'
              },
              presenter: {
                id: 'presenterId',
                username: 'name'
              },
            },
            session: {
              sessionId: 'sessionId',
              caseId: 'caseId',
              dateOfHearing: new Date()
            }
          };

          const action = new fromIcp.IcpSocketSessionJoined(payload);
          expect({...action}).toEqual({
            type: fromIcp.ICP_SOCKET_SESSION_JOINED,
            payload: payload
          });
        });
      });
    });
  });

  describe('Leave Socket Session', () => {
    it('should create an action', () => {
      const action = new fromIcp.LeaveIcpSocketSession();
      expect({...action}).toEqual({
        type: fromIcp.LEAVE_ICP_SOCKET_SESSION
      });
    });
  });

  describe('Presenter Updated', () => {
    it('should create an action', () => {
      const payload: IcpParticipant = {id: 'id', username: 'name'};
      const action = new fromIcp.IcpPresenterUpdated(payload);
      expect({...action}).toEqual({
        type: fromIcp.ICP_PRESENTER_UPDATED,
        payload: payload
      });
    });
  });
});
