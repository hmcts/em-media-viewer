import { CommentPage } from '../pages/comment.po';
import { browser, by, element } from 'protractor';


describe('search', () => {
  let page: CommentPage;

  beforeAll(async () => {
    page = new CommentPage();
    await page.preparePage();
  });

  // TODO make all the tests that dont depend on the test data. 
  // Make jira ticket for setting up pact mock, and for adding f tests mock is done.

  it('should display comments modal', async () => {
    await page.selectPdfViewer();
    await page.openModal();

    const modalElement = await page.getModal();
    expect(modalElement).toBeDefined();
  });

  it('should have correct table headers', async () => {
    const modalText = await page.getModalText();
    expect(modalText).toContain('Date');
    expect(modalText).toContain('User');
    expect(modalText).toContain('Comment');
  });

  it('should close modal on close button', async () => {
    expect(await page.modalIsOpen()).toBeTruthy();
    await page.clickCloseButton();
    expect(await page.modalIsOpen()).toBeFalsy();
  });

  // it('should re-open the modal', async () => {
  //   await page.preparePage();
  //   await page.selectPdfViewer();
  //   await page.openModal();
  //   browser.sleep(5000);
  // });

  // it('should close modal on clicking on background', async () => {
  //   await page.preparePage();
  //   console.log('1');
  //   browser.sleep(10000);
  //   await page.selectPdfViewer();
  //   console.log('2');

  //   // TODO - This opens a modal right at the end of the sleep, and then says
  //   // WebDriverError: Element <a id="pdf" class="govuk-tabs__tab govuk-tabs__tab--selected" href="#pdf"> is not clickable at point (97,158) because another element <th> obscures it
  //   console.log('3');
  //   await page.openModal();
  //   console.log('4');
    
    // expect(await page.modalIsOpen()).toBeTruthy();
    // console.log('5');
    // browser.sleep(10000);
    // // await page.clickOutsideModal();
    // expect(await page.modalIsOpen()).toBeFalsy();

  // });


  // Once stub is set up, write the following tests
  // Comment text appears (use page.getModalText() method)
  // Comment text is in correct order
  // Comments are clickable - should jump to correct place
});
