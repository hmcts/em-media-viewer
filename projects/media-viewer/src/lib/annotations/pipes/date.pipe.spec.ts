import { MomentDatePipe } from './date.pipe';
import * as moment from 'moment-timezone';

describe('MomentDatePipe', () => {
  let pipe: MomentDatePipe;

  beforeEach(() => {
    pipe = new MomentDatePipe('en-UK');
  });

  it('should return empty array', () => {
    const date = new Date();
    const expected = moment(date).tz('Europe/London').format('MMM D, YYYY');

    const actual = pipe.transform(date);

    expect(actual).toEqual(expected);
  });
});
