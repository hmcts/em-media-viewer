import { ZoomPage } from '../pages/zoom.po';

describe('zoom', () => {
  let page: ZoomPage;

  beforeEach(async () => {
    page = new ZoomPage();
    await page.preparePage();
  });


  it('should display pdf zoomed in/out', async () => {
    page.selectPdfViewer();

    page.zoomIn();
    expect(page.currentZoom()).toEqual('110%');


    page.zoomOut();
    expect(page.currentZoom()).toEqual('100%');


    await page.setZoomTo('25%');
    expect(page.currentZoom()).toEqual('25%');


    await page.setZoomTo('500%');
    page.zoomIn();
    expect(page.currentZoom()).toEqual('500%');


    await page.setZoomTo('10%');
    page.zoomOut();
    expect(page.currentZoom()).toEqual('10%');
  });

  it('should display image zoomed in/out', async () => {
    page.selectImageViewer();

    page.zoomOut();
    expect(page.currentZoom()).toEqual('90%');


    page.zoomIn();
    expect(page.currentZoom()).toEqual('100%');


    await page.setZoomTo('50%');
    expect(page.currentZoom()).toEqual('50%');


    await page.setZoomTo('500%');
    page.zoomIn();
    expect(page.currentZoom()).toEqual('500%');


    await page.setZoomTo('10%');
    page.zoomOut();
    expect(page.currentZoom()).toEqual('10%');
  });
});
