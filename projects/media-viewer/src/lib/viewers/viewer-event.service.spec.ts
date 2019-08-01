import {ViewerEventService} from './viewer-event.service';
import {Subscription} from 'rxjs';


describe('Viewer Events Service', () => {
  let service: ViewerEventService;
  let subscription: Subscription;

  const mockHighLight : any = {
    page : 2
  }

  beforeEach(() => {
    service = new ViewerEventService();
  });

  afterEach(() => {
    service = null;
    if (subscription) {
      subscription.unsubscribe();
    }
    subscription = null;
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should select the text', () => {
    const textSelectSpy = spyOn(service.highlightedText, 'next');
    service.onTextSelection(mockHighLight);

    expect(textSelectSpy).toHaveBeenCalledTimes(1);
  });

  it('should select the Shape', () => {
    const shapeSelectSpy = spyOn(service.highlightedShape, 'next');
    service.onShapeSelection(mockHighLight);

    expect(shapeSelectSpy).toHaveBeenCalledTimes(1);
  });

});
