import { RotatePage } from '../pages/rotate.po';

describe('rotate', () => {
  let page: RotatePage;

  beforeEach(async () => {
    page = new RotatePage();
    await page.preparePage();
  });


  it('should display rotated pdf', async () => {
    await page.selectPdfViewer();
    await page.showToolbarButtons(); // NEW
    await page.waitForPdfToLoad();

    await page.captureCurrentOrientation();
    page.rotateClockwise();

    await page.checkPdfIsRotated();

    await page.captureCurrentOrientation();
    page.rotateCounterClockwise();

    page.checkPdfIsRotated();
  });

  it('should display rotated image', async () => {
    await page.selectImageViewer();
    await page.showToolbarButtons(); // NEW

    page.rotateClockwise();
    page.checkImageIsRotatedBy('90');

    page.rotateCounterClockwise();
    page.checkImageIsRotatedBy('0');
  });
});
