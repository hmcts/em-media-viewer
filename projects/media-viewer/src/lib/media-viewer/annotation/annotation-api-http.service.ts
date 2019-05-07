import {Observable, of} from 'rxjs';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { tap } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';
import {HttpResponse, HttpClient} from '@angular/common/http';
import {Injectable, PLATFORM_ID, Inject} from '@angular/core';
import {Annotation, IAnnotation, IAnnotationSet} from './annotation-set.model';
import { EmLoggerService } from '../../logging/em-logger.service';

@Injectable()
export class AnnotationApiHttpService {
    private baseUrl: string;

    constructor(private log: EmLoggerService,
                private httpClient: HttpClient,
                @Inject(PLATFORM_ID) private platformId,
                private transferState: TransferState) {
        log.setClass('AnnotationApiHttpService');
    }

    setBaseUrl(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    getBaseUrl(): string {
        return this.baseUrl;
    }

    createAnnotationSet(baseUrl, body): Observable<HttpResponse<IAnnotationSet>> {
        return this.httpClient.post<IAnnotationSet>(`${baseUrl}/em-anno/annotation-sets`,
            body, {observe: 'response'});
    }

    fetch(baseUrl, dmDocumentId): Observable<HttpResponse<IAnnotationSet>> {
        const STATE_KEY = makeStateKey<HttpResponse<IAnnotationSet>>('annotationSet-' + dmDocumentId);
        if (this.transferState.hasKey(STATE_KEY)) {
            const annotationSet = this.transferState.get<HttpResponse<IAnnotationSet>>(STATE_KEY, null);
            this.transferState.remove(STATE_KEY);
            return of(annotationSet);
        } else {
            const url = `${baseUrl}/em-anno/annotation-sets/${dmDocumentId}`;
            return this.httpClient.get<IAnnotationSet>(url, {observe: 'response'})
                    .pipe(
                        tap(annotationSet => {
                            if (isPlatformServer(this.platformId)) {
                                this.transferState.set(STATE_KEY, annotationSet);
                            }
                        })
                    );
        }
    }

    deleteAnnotation(annotation: Annotation): Observable<HttpResponse<IAnnotation>> {
        const url = `${this.baseUrl}/em-anno/annotations/${annotation.id}`;
        return this.httpClient.delete<IAnnotation>(url, {observe: 'response'});
    }

    saveAnnotation(annotation: Annotation): Observable<HttpResponse<IAnnotation>> {
        const url = `${this.baseUrl}/em-anno/annotations`;
        return this.httpClient.post<IAnnotation>(url, annotation, {observe: 'response'});
    }
}
