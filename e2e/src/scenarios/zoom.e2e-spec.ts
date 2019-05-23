import { AppPage } from '../app.po';

describe('zoom', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });


  it('should display pdf zoomed in', () => {
    page.getPdfViewer().click();

    const currentZoomValue = page.getCurrentZoomOption();
    expect(currentZoomValue.getAttribute('value')).toEqual('1');
    expect(currentZoomValue.getText()).toEqual('100%');

    page.getZoomInButton().click();

    expect(currentZoomValue.getAttribute('value')).toEqual('1.2');
    expect(currentZoomValue.getText()).toEqual('120%');
  });

  it('should display pdf zoomed out', () => {
    const currentZoomValue = page.getCurrentZoomOption();

    page.getZoomOutButton().click();

    expect(currentZoomValue.getAttribute('value')).toEqual('1');
    expect(currentZoomValue.getText()).toEqual('100%');

    page.getZoomOutButton().click();

    expect(currentZoomValue.getAttribute('value')).toEqual('0.8');
    expect(currentZoomValue.getText()).toEqual('80%');
  });

  it('should display pdf zoomed to selected scale', () => {
    const currentZoomValue = page.getCurrentZoomOption();

    page.getZoomSelect().click();
    page.selectZoomValue('25%').click();

    expect(currentZoomValue.getAttribute('value')).toEqual('0.25');
    expect(currentZoomValue.getText()).toEqual('25%');
  });

  it('should not zoom more pdf than max scale', () => {
    const currentZoomValue = page.getCurrentZoomOption();

    page.getZoomSelect().click();
    page.selectZoomValue('500%').click();
    page.getZoomInButton().click();

    expect(currentZoomValue.getAttribute('value')).toEqual('5');
    expect(currentZoomValue.getText()).toEqual('500%');
  });

  it('should not zoom pdf less than min scale', () => {
    const currentZoomValue = page.getCurrentZoomOption();

    page.getZoomSelect().click();
    page.selectZoomValue('10%').click();
    page.getZoomOutButton().click();

    expect(currentZoomValue.getAttribute('value')).toEqual('0.1');
    expect(currentZoomValue.getText()).toEqual('10%');
  });

  it('should display image zoomed in', () => {
    page.getImageViewer().click();

    const currentZoomValue = page.getCurrentZoomOption();
    expect(currentZoomValue.getAttribute('value')).toEqual('1');
    expect(currentZoomValue.getText()).toEqual('100%');

    page.getZoomInButton().click();

    expect(currentZoomValue.getAttribute('value')).toEqual('1.2');
    expect(currentZoomValue.getText()).toEqual('120%');
  });

  it('should display image zoomed out', () => {
    const currentZoomValue = page.getCurrentZoomOption();

    page.getZoomOutButton().click();

    expect(currentZoomValue.getAttribute('value')).toEqual('1');
    expect(currentZoomValue.getText()).toEqual('100%');

    page.getZoomOutButton().click();

    expect(currentZoomValue.getAttribute('value')).toEqual('0.8');
    expect(currentZoomValue.getText()).toEqual('80%');
  });

  it('should display image zoomed to selected scale', () => {
    const currentZoomValue = page.getCurrentZoomOption();

    page.getZoomSelect().click();
    page.selectZoomValue('500%').click();

    expect(currentZoomValue.getAttribute('value')).toEqual('5');
    expect(currentZoomValue.getText()).toEqual('500%');
  });

  it('should not zoom more image than max scale', () => {
    const currentZoomValue = page.getCurrentZoomOption();

    page.getZoomSelect().click();
    page.selectZoomValue('500%').click();
    page.getZoomInButton().click();

    expect(currentZoomValue.getAttribute('value')).toEqual('5');
    expect(currentZoomValue.getText()).toEqual('500%');
  });

  it('should not zoom image less than min scale', () => {
    const currentZoomValue = page.getCurrentZoomOption();

    page.getZoomSelect().click();
    page.selectZoomValue('10%').click();
    page.getZoomOutButton().click();

    expect(currentZoomValue.getAttribute('value')).toEqual('0.1');
    expect(currentZoomValue.getText()).toEqual('10%');
  });
});
