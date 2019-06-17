import { CommentPage } from '../pages/comment.po';
import { browser } from 'protractor';


describe('comment', () => {
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

  it('should re-open the modal', async () => {
    await page.preparePage();
    await page.selectPdfViewer();
    await page.openModal();
    browser.sleep(10000);
    const isModalOpen = await page.modalIsOpen();
    expect(isModalOpen).toBeTruthy();
    // TODO This doesn't close the modal very well
    await page.clickOutsideModal();
    console.log('I should have clicked outside the modal now');
    browser.sleep(10000);
    // TODO This doesn't measure if the modal is open or not
    const andNowIsModalOpen = await page.modalIsOpen();
    expect(andNowIsModalOpen).toBeFalsy();
  });

  // Once stub is set up, write the following tests
  // Comment text appears (use page.getModalText() method)
  // Comment text is in correct order
  // Comments are clickable - should jump to correct place
});
