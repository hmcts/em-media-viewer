import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnnotationApiService } from 'projects/media-viewer/src/lib/annotations/annotation-api.service';
import { HttpResponse } from '@angular/common/http';
import dummyAnnotationSet from 'projects/media-viewer/src/assets/annotation-set.json';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AnnotationSet } from 'projects/media-viewer/src/lib/annotations/annotation-set.model';
import { Comment } from 'projects/media-viewer/src/lib/annotations/comment/comment.model';



import { browser, by, element } from 'protractor';
import { AppPage } from './app.po';
import { HttpClient } from 'selenium-webdriver/http';

export class CommentPage extends AppPage {

  async openModal() {
    const checked = element(by.css('input[id="showCommentSummary"]')).getAttribute('checked');
    if (!checked) {
        element(by.css('label[for="showCommentSummary"]')).click();
    }
    browser.sleep(100000);
  }

  getMockAnnotationSet(documentId: string): Observable<HttpResponse<AnnotationSet>> {
    const response = new Subject<HttpResponse<AnnotationSet>>();
    setTimeout(() => response.next(new HttpResponse({
        body: dummyAnnotationSet
    })), 1000);
    return response;
  }

}
