import * as fromRedaction from './redaction.reducer';
import { initialRedactionState } from './redaction.reducer';
import {
  DeleteRedactionSuccess,
  LoadRedactions,
  LoadRedactionSuccess,
  RedactSuccess,
  ResetRedactedDocument,
  SaveRedactionSuccess,
  SelectRedaction,
  UnmarkAllSuccess
} from '../actions/redaction.actions';

describe('DocumentReducer', () => {

  const redaction = { redactionId: 'redaction-id', documentId: 'document-id', page: 1, rectangles: [] };
  const redactionState = {
    redactionEntities: { 'redaction-id': redaction },
  redactionPageEntities: undefined,
  selectedRedaction: undefined,
  redactedDocumentInfo: undefined,
  documentId: 'document-id'
};

  it('should return the default state', () => {
    const { initialRedactionState } = fromRedaction;
    const action = new LoadRedactions('document-id');
    const state = fromRedaction.redactionReducer(undefined, action);

    expect(state).toEqual(initialRedactionState);
  });

  it('should set loaded redactions in the state', () => {
    const state = fromRedaction.redactionReducer({ ...redactionState }, new LoadRedactionSuccess([redaction]));

    expect(state.redactionEntities).toEqual({ 'redaction-id': redaction });
    expect(state.redactionPageEntities).toEqual({ '1': [redaction] });
  });

  it('should set saved redactions in the state', () => {
    const savedRedaction = { redactionId: 'redactionID', documentId: 'documentID', page: 2, rectangles: [] };
    const state = fromRedaction.redactionReducer({ ...redactionState }, new SaveRedactionSuccess(savedRedaction));

    expect(state.redactionEntities).toEqual({ 'redaction-id': redaction, 'redactionID': savedRedaction });
    expect(state.redactionPageEntities).toEqual({ '1': [redaction], '2': [savedRedaction] });
  });

  it('should set the selected redaction', () => {
    const selected = { annotationId: 'annotationId', editable: true, selected: true };
    const state = fromRedaction.redactionReducer({ ...redactionState }, new SelectRedaction(selected));

    expect(state.selectedRedaction).toEqual(selected);
  });

  it('should remove deleted redaction', () => {
    const action = new LoadRedactionSuccess([redaction]);
    let state = fromRedaction.redactionReducer({ ...redactionState }, action);
    state = fromRedaction.redactionReducer({ ...state }, new DeleteRedactionSuccess(redaction));

    expect(state.redactionEntities).toEqual({});
    expect(state.redactionPageEntities).toEqual({ '1': []});
  });

  it('should set redacted document info', () => {
    const payload = { blob: 'blob' as any, filename: 'file-name' };
    const state = fromRedaction.redactionReducer({ ...redactionState }, new RedactSuccess(payload));

    expect(state.redactedDocumentInfo).toEqual(payload);
  });

  it('should set redacted document info', () => {
    const payload = { blob: 'blob' as any, filename: 'file-name' };
    let state = fromRedaction.redactionReducer({ ...redactionState }, new RedactSuccess(payload));
    state = fromRedaction.redactionReducer({ ...state }, new ResetRedactedDocument());

    expect(state.redactedDocumentInfo).toBeUndefined();
  });

  it('should delete all marked redactions', () => {
    const payload = { blob: 'blob' as any, filename: 'file-name' };
    let state = fromRedaction.redactionReducer({ ...redactionState }, new RedactSuccess(payload));
    state = fromRedaction.redactionReducer({ ...state }, new UnmarkAllSuccess());

    expect(state).toEqual(initialRedactionState);
  });
});
