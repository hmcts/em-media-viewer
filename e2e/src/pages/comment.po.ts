import { Observable } from 'rxjs';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { browser, by, element } from 'protractor';
import { AppPage } from './app.po';
import { AnnotationSet } from '../../../projects/media-viewer/src/lib/annotations/annotation-set.model';

export class CommentPage extends AppPage {
  private readonly httpClient: HttpClient;

  async openModal() {
    console.log('in openModal');
    const checked = await element(by.css('input[id="toggleCommentSummary"]')).getAttribute('checked');
    console.log('checked is ', checked);
    if (!checked) {
        element(by.css('label[for="toggleCommentSummary"]')).click();
    }
    console.log('now, checked is ', await element(by.css('input[id="toggleCommentSummary"]')).getAttribute('checked'));
    console.log('about to leave openModal');
    browser.sleep(5000);
  }

  getMockAnnotationSet(documentId: string): Observable<HttpResponse<AnnotationSet>> {
    const url = '/projects/media-viewer/src/assets/annotation-set.json';
    return this.httpClient.get<AnnotationSet>(url, { observe: 'response' });
  }

}
