import { DownloadPage } from "../pages/download.po";

describe("download", () => {
  let page: DownloadPage;

  beforeEach(async () => {
    page = new DownloadPage();
    await page.preparePage();
  });


  it("should download the pdf", async () => {
    const file = "e2e/src/downloads/example.pdf";

    await page.selectPdfViewer();
    await page.showToolbarButtons();
    await page.clickDownload();
    await page.waitForDownloadToComplete(file);

    expect(page.hasFileDownloaded(file)).toBe(true);
  });

  it("should download the image", async () => {
    const file = "e2e/src/downloads/example.jpg";

    await page.selectImageViewer();
    await page.showToolbarButtons();
    await page.clickDownload();
    await page.waitForDownloadToComplete(file);

    expect(page.hasFileDownloaded(file)).toBe(true);
  });

  it("should download the unsupported file", async () => {
    const file = "e2e/src/downloads/unsupported.txt";

    await page.selectUnsupportedViewer();
    await page.showToolbarButtons();
    await page.clickDownload();
    await page.waitForDownloadToComplete(file);

    expect(page.hasFileDownloaded(file)).toBe(true);
  });
});
