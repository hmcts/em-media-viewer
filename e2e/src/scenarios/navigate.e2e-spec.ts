import { AppPage } from '../app.po';
import { browser, protractor } from 'protractor';

describe('navigate', () => {
  const until = protractor.ExpectedConditions;
  let page: AppPage;

  beforeEach(async () => {
    page = new AppPage();
    page.getPdfViewer().click();
    await browser.wait(until.presenceOf(page.getPdfPage()), 5000, 'PDF viewer taking too long to load');
  });


  it('should display next page in pdf viewer', () => {
    page.getPdfViewer().click();

    const nextPage = page.getNextPageButton();
    nextPage.click();

    const pageNumber = page.getPageNumberInput();

    expect(pageNumber.getAttribute('value')).toEqual('2');

    nextPage.click();
    expect(pageNumber.getAttribute('value')).toEqual('3');
  });

  it('should display previous page in pdf viewer', () => {
    const previousPage = page.getPreviousPageButton();
    previousPage.click();

    const pageNumber = page.getPageNumberInput();

    expect(pageNumber.getAttribute('value')).toEqual('2');

    previousPage.click();
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
