import * as fromDocument from './document.action';

describe('Document actions', () => {

    it('should create AddPages action', () => {
      const payload = [{div: {}, scale: 1, rotation: 0, id: '1'}];
      const action = new fromDocument.AddPages(payload);
      expect({ ...action }).toEqual({
        type: fromDocument.ADD_PAGES,
        payload
      });
    });
});
