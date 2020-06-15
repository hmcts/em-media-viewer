import { PdfPosition } from '../viewers/pdf-viewer/side-bar/bookmarks/bookmarks.interfaces';

export interface IcpState {
  session: IcpSession;
  presenter: IcpParticipant;
  client: IcpParticipant;
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
