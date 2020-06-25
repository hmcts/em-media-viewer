import { PdfJsWrapperFactory } from './pdf-js-wrapper.provider';
import { Subject } from 'rxjs';
import { ToolbarEventService } from '../../../toolbar/toolbar.module';

describe('PdfJsWrapperFactory', () => {

  it('creates a wrapper', () => {
    const elementRef = {
      nativeElement: {
        firstElementChild: document.createElement('div'),
        addEventListener: () => {}
      }
    } as any;
    const factory = new PdfJsWrapperFactory(new ToolbarEventService());
    const wrapper = factory.create(elementRef);

    expect(wrapper).not.toBeNull();
    expect(wrapper.documentLoadInit).toBeInstanceOf(Subject);
    expect(wrapper.documentLoadProgress).toBeInstanceOf(Subject);
    expect(wrapper.documentLoaded).toBeInstanceOf(Subject);
    expect(wrapper.outlineLoaded).toBeInstanceOf(Subject);
    expect(wrapper.documentLoadFailed).toBeInstanceOf(Subject);
    expect(wrapper.pageRendered).toBeInstanceOf(Subject);
    expect(wrapper.positionUpdated).toBeInstanceOf(Subject);
  });
});
