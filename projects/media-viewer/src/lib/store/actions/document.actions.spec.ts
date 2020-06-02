import * as fromDocument from './document.action';

describe('Document actions', () => {

    it('should create AddPages action', () => {
      const payload = {div: {}, pageNumber:1,  scale: '', rotation: ''};
      const action = new fromDocument.AddPages(payload);
      expect({ ...action }).toEqual({
        type: fromDocument.ADD_PAGES,
        payload
      });
    });
});
