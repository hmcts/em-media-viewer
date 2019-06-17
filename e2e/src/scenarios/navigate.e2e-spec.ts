import { NavigatePage } from '../pages/navigate.po';

describe('navigate', () => {
  let page: NavigatePage;

  beforeEach(async () => {
    page = new NavigatePage();
    await page.preparePage();
  });

  it('should display next page in pdf viewer', async () => {
    await page.selectPdfViewer();
    await page.showToolbarButtons(); // NEW
    await page.waitForPdfToLoad();

    await page.goToNextPage();

    expect(page.number()).toEqual('2');

    await page.goToPreviousPage();

    expect(page.number()).toEqual('1');
  });
});
