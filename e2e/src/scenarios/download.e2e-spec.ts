import { AppPage } from '../app.po';

describe('download', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });


  it('should download the pdf', () => {
    const file = 'e2e/src/downloads/example.pdf';

    page.getPdfViewer().click();

    const downloadPage = page.getDownloadButton();
    downloadPage.click()
      .then(() => page.wait(3000))
      .then(() => {
        expect(page.hasFileDownloaded(file)).toEqual(true);
      });
  });

  it('should download the image', () => {
    const file = 'e2e/src/downloads/undefined.jpeg';

    page.getImageViewer().click();

    const downloadPage = page.getDownloadButton();
    downloadPage.click()
      .then(() => page.wait(3000))
      .then(() => {
        expect(page.hasFileDownloaded(file)).toEqual(true);
      });
  });

  it('should download the unsupported file', () => {
    const file = 'e2e/src/downloads/unsupported.txt';

    page.getUnsupportedViewer().click();

    const downloadPage = page.getDownloadButton();
    downloadPage.click()
      .then(() => page.wait(3000))
      .then(() => {
        expect(page.hasFileDownloaded(file)).toEqual(true);
      });
  });
});
