import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ViewerUtilService {
  constructor(
    private http: HttpClient) {
  }

  public validateFile(fileName: string) {
    return this.http.head(fileName);
  }
}
