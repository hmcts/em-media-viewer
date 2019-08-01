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
    service.onTextSelection(mockHighLight);
    expect(service).toBeTruthy();
  });

  it('should select the Shape', () => {
    service.onShapeSelection(mockHighLight);
    console.log('jjj ' , service.highlightedShape)
    expect(service).toBeTruthy();
  });

});
