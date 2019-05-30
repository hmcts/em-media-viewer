import { AppPage } from '../app.po';

describe('search', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  afterAll(() =>{
    page.clickSearch();
  });


  it('should search the pdf for selected word', () => {
    page.selectPdfViewer();

    page.clickSearch();
    const searchBar = page.getSearchInput();
    searchBar.sendKeys('based');

    page.wait(3000);

    expect(page.getCurrentSearchResult).toBeTruthy();
    expect(page.getCurrentSearchResult().getText()).toEqual('based');
  });

  it('should go to the next search value when next is clicked', () => {
    const currentResultsCount = page.getSearchResultsCount();
    const currentResultHighlight = page.getAllSearchHighlights().get(0);

    expect(page.getAllSearchHighlights().get(0).getAttribute('class')).toEqual('highlight selected');

    page.searchNext();

    expect(page.getSearchResultsCount).not.toEqual(currentResultsCount);
    expect(page.getAllSearchHighlights().get(0)).not.toEqual(currentResultHighlight);
    expect(page.getAllSearchHighlights().get(1).getAttribute('class')).toEqual('highlight selected');
  });

  it('should go to the previous search value when previous is clicked', () => {
    const currentResultsCount = page.getSearchResultsCount();
    const currentResultHighlight = page.getAllSearchHighlights().get(1);

    expect(page.getAllSearchHighlights().get(1).getAttribute('class')).toEqual('highlight selected');

    page.searchPrevious();

    expect(page.getSearchResultsCount).not.toEqual(currentResultsCount);
    expect(page.getAllSearchHighlights().get(1)).not.toEqual(currentResultHighlight);
    expect(page.getAllSearchHighlights().get(0).getAttribute('class')).toEqual('highlight selected');
  });

  it('should search the pdf for selected word with match case', () => {
    const searchBar = page.getSearchInput();
    searchBar.clear();
    searchBar.sendKeys('Based');

    expect(page.getCurrentSearchResult).toBeTruthy();
    expect(page.getCurrentSearchResult().getText()).toEqual('based');

    page.selectMatchCase();
    page.wait(1000);

    expect(page.getCurrentSearchResult().getText()).toEqual('Based');
  });

  it('should search the pdf for selected word with single highlight', () => {
    const allSearchHighlights = page.getAllSearchHighlights();

    page.selectHighlightAll();
    page.wait(1000);

    expect(page.getCurrentSearchResult).toBeTruthy();
    expect(page.getAllSearchHighlights.length).toEqual(0);
    expect(page.getAllSearchHighlights).not.toEqual(allSearchHighlights);
  });

  it('should search the pdf for selected word with single highlight', () => {
    const searchBar = page.getSearchInput();
    searchBar.clear();
    searchBar.sendKeys('a');
    const allSearchHighlights = page.getAllSearchHighlights();

    page.selectWholeWords();

    expect(page.getAllSearchHighlights).not.toEqual(allSearchHighlights);
  });

  it('should search the pdf for selected word and inform no match is found if it doesnt exist', () => {
    const searchBar = page.getSearchInput();
    searchBar.clear();
    searchBar.sendKeys('asdasdada');

    page.wait(1000);

    expect(page.getSearchResultsCount().getText()).toEqual('Phrase not found');
  });
});
