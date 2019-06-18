import { CommentPage } from '../pages/comment.po';

describe('comment', () => {
  let page: CommentPage;

  beforeAll(async () => {
    page = new CommentPage();
    await page.preparePage();
  });

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
});
