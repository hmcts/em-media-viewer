import { AppPage } from '../app.po';
import { browser, protractor } from 'protractor';

describe('print', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });


  it('should print the pdf', () => {
    page.getPdfViewer().click();

    const printPage = page.getPrintButton();
    printPage.click();

    // clean up by moving to app.po
    browser.getAllWindowHandles().then(function(handles) {
      expect(handles.length).toEqual(2);
      browser.switchTo().window(handles[1]);
      expect(page.getPrintDialog).toBeTruthy();
      page.wait(1000);
      browser.close();
      browser.switchTo().window(handles[0]);
    });
  });

  it('should print the image', () => {
    page.getImageViewer().click();

    const printPage = page.getPrintButton();
    printPage.click();

    browser.getAllWindowHandles().then(function(handles) {
      expect(handles.length).toEqual(2);
      browser.switchTo().window(handles[1]);
      expect(page.getPrintDialog).toBeTruthy();
      page.wait(1000);
      browser.close();
      browser.switchTo().window(handles[0]);
    });
  });
});
