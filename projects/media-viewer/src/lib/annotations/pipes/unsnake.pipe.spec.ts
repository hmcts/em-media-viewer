import { UnsnakePipe } from './unsnake.pipe';

describe('UnsnakePipe', () => {
  let pipe: UnsnakePipe;

  beforeEach(() => {
    pipe = new UnsnakePipe();
  });

  it('should return unsnaked string', () => {
    const expected = pipe.transform('item1_item2_item3');

    expect(expected).toEqual('item1 item2 item3');
  });
});
