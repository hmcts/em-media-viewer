import { HtmlTemplatesHelper } from './html-templates.helper';

describe('Toolbar Event Service', () => {

  it('should set describedBy string', () => {
    const actual = HtmlTemplatesHelper.setDescribedBy(undefined, { hint: 'hint', id: 'id' });

    expect(actual).toBe('id-hint');
  });

  it('should set describedBy string', () => {
    const config = { hint: 'hint', id: 'id' };
    const actual = HtmlTemplatesHelper.setDescribedBy({ isInvalid: true }, config);

    expect(actual).toBe('id-hint id-error');
  });

  it('should set describedBy string', () => {
    const config = { id: 'id' };
    const actual = HtmlTemplatesHelper.setDescribedBy({ isInvalid: true }, config);

    expect(actual).toBe('id-error');
  });

  it('should set describedBy string', () => {
    const config = { hint: 'hint', id: 'id' };
    const actual = HtmlTemplatesHelper.setDescribedBy({ isInvalid: false }, config);

    expect(actual).toBe('id-hint');
  });

  it('should set describedBy string', () => {
    const config = { id: 'id' };
    const actual = HtmlTemplatesHelper.setDescribedBy({ isInvalid: false }, config);

    expect(actual).toBeNull();
  });
});
