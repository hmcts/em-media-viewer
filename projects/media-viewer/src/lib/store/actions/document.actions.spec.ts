import * as fromDocument from './document.action';

describe('Document actions', () => {

    it('should create AddPage action', () => {
      const payload = {div: {}, pageNumber:1,  scale: '', rotation: ''};
      const action = new fromDocument.AddPage(payload);
      expect({ ...action }).toEqual({
        type: fromDocument.ADD_PAGE,
        payload
      });
    });
});
