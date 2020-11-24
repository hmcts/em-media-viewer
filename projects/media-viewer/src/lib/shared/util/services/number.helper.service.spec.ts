import { NumberHelperService } from './number.helper.service';

describe('Number Helper Service', () => {
    let service: NumberHelperService;

    beforeEach(() => {
        service = new NumberHelperService();
    });

    describe('isNumber', () => {
      it('should be true when an integer number', () => {
        expect(service.isNumber(1234)).toBeTruthy();
      });

      it('should be true when a decimal number', () => {
        expect(service.isNumber(1234.56)).toBeTruthy();
      });

      it('should be true when a negative decimal number', () => {
        expect(service.isNumber(-1234.56)).toBeTruthy();
      });

      it('should be true when zero', () => {
        expect(service.isNumber(0)).toBeTruthy();
      });

      it('should be true when a string quoted number', () => {
        expect(service.isNumber('1234.56')).toBeTruthy();
      });

      it('should be false when not a number', () => {
        expect(service.isNumber('a1234.56')).toBeFalsy();
      });

      it('should be false when null', () => {
        expect(service.isNumber(null)).toBeFalsy();
      });

      it('should be false when undefined', () => {
        expect(service.isNumber(undefined)).toBeFalsy();
      });

      it('should be false when empty string', () => {
        expect(service.isNumber('')).toBeFalsy();
      });
    });
});
