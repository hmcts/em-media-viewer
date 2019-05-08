import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaViewerComponent } from './media-viewer.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement, Renderer2 } from '@angular/core';
import { MediaViewerService } from './media-viewer.service';
import { of } from 'rxjs';
import { TransferState } from '@angular/platform-browser';
import { MediaViewerModule } from '../media-viewer.module';
import { EmLoggerService } from '../logging/em-logger.service';
import { PdfJsWrapper } from './viewers/pdf-viewer/pdf-js/pdf-js-wrapper';

const originalUrl = 'http://api-gateway.dm.com/documents/1234-1234-1234';

class MockTransferState {
    remove() {}
    set() {}
}

class MockPdfWrapper {
    getDocument() {}
    initViewer() {
        return [{}, {}];
    }
}

class MockMediaViewerService {
    public document;

    getDocumentMetadata() {
        return of(this.document);
    }
}

const createMockDocuments = (mimeType, documentName, url) => {
    return {
        mimeType: mimeType,
        originalDocumentName: documentName,
        _links: {
            binary: {
                href: `${url}/binary`
            },
            self: {
                href: `${url}`
            }
        }
    };
};

describe('MediaViewerComponent', () => {
    const mockTransferState = new MockTransferState();
    const mockPdfWrapper = new MockPdfWrapper();
    const mockMediaViewerService = new MockMediaViewerService();
    let component: MediaViewerComponent;
    let fixture: ComponentFixture<MediaViewerComponent>;
    let element: DebugElement;

    const createComponent = (contentType: string) => {
        fixture = TestBed.createComponent(MediaViewerComponent);
        component = fixture.componentInstance;
        component.url = originalUrl;
        component.contentType = contentType;
        element = fixture.debugElement;
        fixture.detectChanges();
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MediaViewerModule, HttpClientTestingModule],
            providers: [
                EmLoggerService,
                Renderer2,
                { provide: TransferState, useFactory: () => mockTransferState },
                { provide: MediaViewerService, useFactory: () => mockMediaViewerService },
                { provide: PdfJsWrapper, useFactory: () => mockPdfWrapper }
            ]
        }).compileComponents();
    }));


    describe('when the mime type is an image', () => {
        beforeEach(() => {
            mockMediaViewerService.document = createMockDocuments('image/jpeg', 'image.jpeg', originalUrl);
            createComponent('image');
        });

        it('img element should be visible', () => {
            expect(element.nativeElement.querySelector('app-image-viewer')).toBeTruthy();
        });

        it('and pdf element should not be visible', () => {
            expect(element.nativeElement.querySelector('app-pdf-viewer')).not.toBeTruthy();
        });

        describe('when the url is changed', () => {
            const newUrl = 'http://api-gateway.dm.com/documents/5678-5678-5678';
            beforeEach(() => {
                component.url = newUrl;
                fixture.detectChanges();
            });

            beforeEach(() => {
                mockMediaViewerService.document = createMockDocuments('image/jpeg', 'new-image.jpeg', newUrl);
            });

            it('img element should still be visible', () => {
                expect(element.nativeElement.querySelector('app-image-viewer')).toBeTruthy();
            });

            it('and pdf element should still not be visible', () => {
                expect(element.nativeElement.querySelector('app-pdf-viewer')).not.toBeTruthy();
            });
        });
    });

    describe('when the mime type is pdf', () => {
        beforeEach(() => {
            mockMediaViewerService.document = createMockDocuments('application/pdf', 'cert.pdf', originalUrl);
            createComponent('pdf');
        });

        it('img element should not be visible', () => {
            expect(element.nativeElement.querySelector('app-image-viewer')).not.toBeTruthy();
        });

        it('pdf element should be visible', () => {
            expect(element.nativeElement.querySelector('app-pdf-viewer')).toBeTruthy();
        });
        it('img element should not be visible', () => {
            expect(element.nativeElement.querySelector('app-image-viewer')).not.toBeTruthy();
        });
    });
});
