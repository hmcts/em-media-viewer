import { PdfPosition } from '../store/reducers/document.reducer';

export interface IcpState {
  session: IcpSession;
  presenter: IcpParticipant;
  client: IcpParticipant;
  participants: IcpParticipant[];
}

export interface IcpSession {
  sessionId: string;
  caseId: string;
  dateOfHearing: Date;
}

export interface IcpParticipant {
  id: string;
  username: string;
}

export interface IcpScreenUpdate {
  pdfPosition: PdfPosition;
  document: string;
}
