import { SearchPage } from "../pages/search.po";

describe("search", () => {
  let page: SearchPage;

  beforeEach(async () => {
    page = new SearchPage();
    await page.preparePage();
  });

  afterAll(async () => {
    await page.toggleSearchBar();
  });

  it("should search the pdf for selected word", async () => {
    await page.selectPdfViewer();
    await page.showToolbarButtons();
    await page.toggleSearchBar();

    await page.searchFor("Based");
    let selectedSearchText = await page.selectedSearchText();
    expect(selectedSearchText).toEqual("based");

    await page.goToNextResult();
    let searchResultsCount = await page.searchResultsCounter();
    let selectedResult = await page.selectedSearchResult();
    const secondSearchResult = await page.secondSearchResult();
    expect(searchResultsCount).toContain("2 of");
    expect(selectedResult).toEqual(secondSearchResult);


    await page.goToPreviousResult();
    searchResultsCount = await page.searchResultsCounter();
    selectedResult = await page.selectedSearchResult();
    const firstSearchResult = await page.firstSearchResult();
    expect(searchResultsCount).toContain("1 of");
    expect(selectedResult).toEqual(firstSearchResult);

    await page.selectMatchCase();
    selectedSearchText = await page.selectedSearchText();
    expect(selectedSearchText).toEqual("Based");
  });
});
