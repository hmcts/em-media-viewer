import { PrintDownloadPage } from '../pages/print-download.po';

describe('download', () => {
  let page: PrintDownloadPage;

  beforeEach(() => {
    page = new PrintDownloadPage();
  });


  it('should download the pdf', async () => {
    const file = 'e2e/src/downloads/example.pdf';

    page.selectPdfViewer();
    page.clickDownload();

    await expect(page.hasFileDownloaded(file)).toBe(true);
  });

  it('should download the image', async () => {
    const file = 'e2e/src/downloads/undefined.jpeg';

    page.selectImageViewer();
    page.clickDownload();

    await expect(page.hasFileDownloaded(file)).toBe(true);
  });

  it('should download the unsupported file', async () => {
    const file = 'e2e/src/downloads/unsupported.txt';

    page.selectUnsupportedViewer();
    page.clickDownload();

    await expect(page.hasFileDownloaded(file)).toEqual(true);
  });
});
