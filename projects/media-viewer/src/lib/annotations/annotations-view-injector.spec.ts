import { pdfAnnotationSet } from '../../../../../src/assets/mock-data/pdf-annotation-set';
import {
  ComponentFactory,
  ComponentFactoryResolver,
  CUSTOM_ELEMENTS_SCHEMA,
  DebugElement,
  ElementRef,
  ViewContainerRef
} from '@angular/core';
import { AnnotationsComponent } from './annotations.component';
import { AnnotationsViewInjector } from './annotations-view.injector';
import { BehaviorSubject } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AngularDraggableModule } from 'angular2-draggable';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { PdfViewerComponent } from '../viewers/pdf-viewer/pdf-viewer.component';
import { PdfJsWrapperFactory } from '../viewers/pdf-viewer/pdf-js/pdf-js-wrapper.provider';

describe('AnnotationsViewInjector', () => {

  let injector: AnnotationsViewInjector;
  let pdfViewerMock: ElementRef;
  let pdfViewerComponent: PdfViewerComponent;
  let fixture: ComponentFixture<PdfViewerComponent>;
  let debugElement: DebugElement;
  let annotationFactory: ComponentFactory<AnnotationsComponent>;
  let viewContainerRef: ViewContainerRef;
  let page: HTMLElement;

  beforeEach(() => {

    const pdfWrapperMock = {
      currentPageChanged: { subscribe: () => {} },
      searchResults: { subscribe: () => {} },
      documentLoadInit: { subscribe: () => {} },
      documentLoadProgress: { subscribe: () => {} },
      documentLoaded: { subscribe: () => {} },
      documentLoadFailed: { subscribe: () => {} },
      pagesRendered: { subscribe: () => {} } ,
      loadDocument: () => {}
    };

    TestBed.configureTestingModule({
      declarations: [
        AnnotationsComponent,
        PdfViewerComponent
      ],
      imports: [
        FormsModule,
        AngularDraggableModule
      ],
      providers: [{ provide: PdfJsWrapperFactory, useValue: { create: () => pdfWrapperMock } }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [AnnotationsComponent]
      }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfViewerComponent);
    pdfViewerComponent = fixture.componentInstance;
    debugElement = fixture.debugElement;

    fixture.detectChanges();

    annotationFactory = fixture.debugElement.injector.get(ComponentFactoryResolver)
      .resolveComponentFactory(AnnotationsComponent);
    viewContainerRef = fixture.debugElement.injector.get(ViewContainerRef);


    const pdfViewerHtml = document.createElement('div');
    page = document.createElement('div');
    page.setAttribute('class', 'page');
    pdfViewerHtml.appendChild(page);
    pdfViewerMock = { nativeElement: pdfViewerHtml } as ElementRef;
  });


  it('should be created', () => {
    const annotations = pdfAnnotationSet.annotations
      .filter(annotation => annotation.page = 1);
    const zoomSubject = new BehaviorSubject({ value: 1 });


    injector = new AnnotationsViewInjector(annotationFactory, viewContainerRef);
    injector.addToDom(annotations, zoomSubject, pdfViewerMock);

    expect(page.firstElementChild.tagName).toBe('MV-ANNOTATION');
  });
});
