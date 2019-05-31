import { AppPage } from '../app.po';
import { browser, protractor } from 'protractor';

describe('navigate', () => {
  const until = protractor.ExpectedConditions;
  let page: AppPage;

  beforeEach(async () => {
    page = new AppPage();
    page.selectPdfViewer();
    await browser.wait(until.presenceOf(page.getPdfPage()), 3000, 'PDF viewer taking too long to load');
  });


  it('should display next page in pdf viewer', () => {
    page.selectPdfViewer();

    page.goToNextPage();

    const pageNumber = page.getPageNumberInput();

    expect(pageNumber.getAttribute('value')).toEqual('2');

    page.goToNextPage();
    expect(pageNumber.getAttribute('value')).toEqual('3');
  });

  it('should display previous page in pdf viewer', () => {
    page.goToPreviousPage();

    const pageNumber = page.getPageNumberInput();

    expect(pageNumber.getAttribute('value')).toEqual('2');

    page.goToPreviousPage();
    expect(pageNumber.getAttribute('value')).toEqual('1');
  });

  it('should display entered value page in pdf viewer', () => {
    const pageNumber = page.getPageNumberInput();
    pageNumber.sendKeys(protractor.Key.BACK_SPACE);
    pageNumber.sendKeys('10');
    pageNumber.sendKeys(protractor.Key.ENTER);

    expect(pageNumber.getAttribute('value')).toEqual('10');
  });
});
