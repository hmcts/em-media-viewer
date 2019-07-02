import {ViewerEventService} from './viewer-event.service';
import {Subscription} from 'rxjs';


describe('Viewer Events Service', () => {
  let service: ViewerEventService;
  let subscription: Subscription;
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
});
