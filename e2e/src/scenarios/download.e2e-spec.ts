import { DownloadPage } from '../pages/download.po';

describe('Doownload Scenarios ', () => {
  let page: DownloadPage;

  beforeEach(() => {
    page = new DownloadPage();
  });


  it('should download the pdf', async () => {
    const file = 'e2e/src/downloads/example.pdf';

    page.selectPdfViewer();
    page.clickDownload();
    await page.waitForDownloadToComplete(file);

    expect(page.hasFileDownloaded(file)).toBe(true);
  });

  it('should download the image', async () => {
    const file = 'e2e/src/downloads/example.jpg';

    page.selectImageViewer();
    page.clickDownload();
    await page.waitForDownloadToComplete(file);

    expect(page.hasFileDownloaded(file)).toBe(true);
  });

  it('should download the unsupported file', async () => {
    const file = 'e2e/src/downloads/unsupported.txt';

    page.selectUnsupportedViewer();
    page.clickDownload();
    await page.waitForDownloadToComplete(file);

    expect(page.hasFileDownloaded(file)).toBe(true);
  });
});
