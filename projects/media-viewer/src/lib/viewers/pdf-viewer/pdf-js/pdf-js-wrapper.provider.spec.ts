import { PdfJsWrapperFactory } from './pdf-js-wrapper.provider';
import { PdfViewerComponent } from '../pdf-viewer.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorMessageComponent } from '../../error-message/error.message.component';

describe('PdfJsWrapperFactory', () => {
  let component: PdfViewerComponent;
  let fixture: ComponentFixture<PdfViewerComponent>;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [ PdfViewerComponent, ErrorMessageComponent ],
      providers: [
        PdfJsWrapperFactory
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfViewerComponent);
    component = fixture.componentInstance;
  });

  it('creates a wrapper', () => {
    const factory = new PdfJsWrapperFactory();
    const wrapper = factory.create(component.viewerContainer);

    expect(wrapper).not.toBeNull();
  });

});
