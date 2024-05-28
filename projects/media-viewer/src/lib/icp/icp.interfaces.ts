import { PdfPosition } from '../store/reducers/document.reducer';

export interface IcpState {
  session: IcpSession;
  presenter: IcpParticipant;
  client: IcpParticipant;
  participants: IcpParticipant[];
}

export interface IcpSession {
  sessionId: string;
  documentId: string;
  caseId: string;
  dateOfHearing: Date;
  connectionUrl: string;
}

export interface IcpParticipant {
  id: string;
  username: string;
}

export interface IcpScreenUpdate {
  pdfPosition: PdfPosition;
  document: string;
}
