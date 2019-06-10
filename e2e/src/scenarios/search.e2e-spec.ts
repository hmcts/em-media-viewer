import { SearchPage } from '../pages/search.po';

describe('search', () => {
  let page: SearchPage;

  beforeEach(() => {
    page = new SearchPage();
  });

  afterAll(async () =>{
    page.toggleSearchBar();
  });


  it('should search the pdf for selected word', async () => {
    page.selectPdfViewer();
    page.toggleSearchBar();

    await page.searchFor('Based');
    expect(page.selectedSearchText()).toEqual('based');


    await page.goToNextResult();
    expect(page.searchResultsCounter()).toContain('2 of');
    expect(page.selectedSearchResult()).toEqual(page.secondSearchResult());


    await page.goToPreviousResult();
    expect(page.searchResultsCounter()).toContain('1 of');
    expect(page.selectedSearchResult()).toEqual(page.firstSearchResult());


    await page.selectMatchCase();
    expect(page.selectedSearchText()).toEqual('Based');
  });
});
