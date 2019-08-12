import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ViewerUtilService {
  constructor(private http: HttpClient) {
  }

  public validateFile(name: string) {
    return this.http.head(name).subscribe(
      response => console.log('success', response),
      error => console.log('error erorrrrreerer', error)
    );
  }
}
