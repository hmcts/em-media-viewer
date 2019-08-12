export interface MediaLoadStatus {
  statusType: ResponseType;
  statusCode?: number;
  statusMessage?: string;
}

export enum ResponseType {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  UNSUPPORTED = 'UNSUPPORTED'
}

export enum ExceptionType {

}

export class MediaLoadException {
  type: ExceptionType;
  result: ResponseType;
  message: string;

  constructor(type: ExceptionType, result: ResponseType, message: string) {
    this.type = type;
    this.result = result;
    this.message = message;
  }
}
