import { RotatePage } from "../pages/rotate.po";

describe("rotate", () => {
  let page: RotatePage;

  beforeEach(async () => {
    page = new RotatePage();
    await page.preparePage();
  });


  it("should display rotated pdf", async () => {
    await page.selectPdfViewer();
    await page.showToolbarButtons();
    await page.waitForPdfToLoad();

    await page.captureCurrentOrientation();
    await page.rotateClockwise();

    await page.checkPdfIsRotated();

    await page.captureCurrentOrientation();
    await page.rotateCounterClockwise();

    await page.checkPdfIsRotated();
  });

  it("should display rotated image", async () => {
    await page.selectImageViewer();
    await page.showToolbarButtons();

    await page.rotateClockwise();
    await page.checkImageIsRotatedBy("90");

    await page.rotateCounterClockwise();
    await page.checkImageIsRotatedBy("0");
  });
});
