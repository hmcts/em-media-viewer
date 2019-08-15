export enum ResponseType {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  UNSUPPORTED = 'UNSUPPORTED'
}

export interface ExceptionDetail {
  httpResponseCode?: string;
  message?: string;
}

export class ViewerException {
  exceptionType?: string;
  detail?: ExceptionDetail;

  constructor(exceptionType?: string, detail?: ExceptionDetail) {
    this.exceptionType = exceptionType;
    this.detail = detail;
  }
}
