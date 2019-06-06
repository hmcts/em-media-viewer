import { ZoomPage } from '../pages/zoom.po';

describe('zoom', () => {
  let page: ZoomPage;

  beforeEach(() => {
    page = new ZoomPage();
  });


  it('should display pdf zoomed in', async () => {
    page.selectPdfViewer();

    expect(page.currentZoom()).toEqual('100%');

    page.zoomIn();
    expect(page.currentZoom()).toEqual('120%');

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

  it('should display image zoomed in', async () => {
    page.selectImageViewer();

    expect(page.currentZoom()).toEqual('100%');

    page.zoomOut();
    expect(page.currentZoom()).toEqual('80%');

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
