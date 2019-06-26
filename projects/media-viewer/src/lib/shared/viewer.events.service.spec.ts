import {ViewerEventsService} from './viewer.events.service';
import {Subscription} from 'rxjs';


describe('Viewer Events Service', () => {
  let service: ViewerEventsService;
  let subscription: Subscription;
  beforeEach(() => {
    service = new ViewerEventsService();
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
