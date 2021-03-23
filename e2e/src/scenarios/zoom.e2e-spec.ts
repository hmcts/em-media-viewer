import { ZoomPage } from "../pages/zoom.po";

describe("zoom", () => {
  let page: ZoomPage;

  beforeEach(async () => {
    page = new ZoomPage();
    await page.preparePage();
  });


  it("should display pdf zoomed in/out", async () => {
    await page.selectPdfViewer();
    await page.showToolbarButtons();

    await page.zoomIn();
    expect(await page.currentZoom()).toEqual("110%");


    await page.zoomOut();
    expect(await page.currentZoom()).toEqual("100%");


    await page.setZoomTo("25%");
    expect(await page.currentZoom()).toEqual("25%");


    await page.setZoomTo("500%");
    await page.zoomIn();
    expect(await page.currentZoom()).toEqual("500%");


    await page.setZoomTo("10%");
    await page.zoomOut();
    expect(await page.currentZoom()).toEqual("10%");
  });

  it("should display image zoomed in/out", async () => {
    await page.selectImageViewer();
    await page.showToolbarButtons();

    await page.zoomOut();
    expect(await page.currentZoom()).toEqual("90%");


    await page.zoomIn();
    expect(await page.currentZoom()).toEqual("100%");


    await page.setZoomTo("50%");
    expect(await page.currentZoom()).toEqual("50%");


    await page.setZoomTo("500%");
    await page.zoomIn();
    expect(await page.currentZoom()).toEqual("500%");


    await page.setZoomTo("10%");
    await page.zoomOut();
    expect(await page.currentZoom()).toEqual("10%");
  });
});
