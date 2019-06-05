import { SearchPage } from '../pages/search.po';

describe('search', () => {
  let searchPage: SearchPage;

  beforeEach(() => {
    searchPage = new SearchPage();
  });

  afterAll(async () =>{
    searchPage.toggleSearchBar();
  });


  it('should search the pdf for selected word', async () => {
    searchPage.selectPdfViewer();

    searchPage.toggleSearchBar();
    searchPage.searchFor('Based');
    const numberOfSearchResults = await searchPage.numberOfSearchResults();

    expect(await searchPage.selectedSearchText()).toEqual('based');
    expect(numberOfSearchResults).toBeGreaterThan(1);

    searchPage.goToNextResult();

    expect(searchPage.searchResultsCounter()).toContain('2 of');
    expect(searchPage.selectedSearchResult()).toEqual(searchPage.secondSearchResult());

    searchPage.goToPreviousResult();

    expect(searchPage.searchResultsCounter()).toContain('1 of');
    expect(searchPage.selectedSearchResult()).toEqual(searchPage.firstSearchResult());

    searchPage.selectMatchCase();

    expect(searchPage.selectedSearchText()).toEqual('Based');

    searchPage.toggleHighlightAll();

    expect(searchPage.numberOfSearchResults()).toEqual(1);


    searchPage.selectWholeWords();
    const wholeWordSearchResults = await searchPage.numberOfSearchResults();

    expect(wholeWordSearchResults).toBeLessThan(numberOfSearchResults);

    searchPage.searchFor('asdasdada');

    expect(searchPage.searchResultsCounter()).toEqual('Phrase not found');
  });
});
