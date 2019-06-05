import { RotatePage } from '../pages/rotate.po';

describe('rotate', () => {
  let page: RotatePage;

  beforeEach(() => {
    page = new RotatePage();
  });


  it('should display rotated pdf', async () => {
    page.selectPdfViewer();
    await page.waitForPdfToLoad();

    await page.captureCurrentOrientation();
    page.rotateClockwise();

    await page.checkPdfIsRotated();

    await page.captureCurrentOrientation();
    page.rotateCounterClockwise();

    await page.checkPdfIsRotated();
  });

  it('should display rotated image', () => {
    page.selectImageViewer();

    page.rotateClockwise();
    page.checkImageIsRotatedBy('90');

    page.rotateCounterClockwise();
    page.checkImageIsRotatedBy('0');
  });
});
