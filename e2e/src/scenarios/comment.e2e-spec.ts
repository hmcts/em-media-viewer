// import { browser } from 'protractor';
import { CommentPage } from '../pages/comment.po';
import { first, findIndex } from 'rxjs/operators';

describe('comment', () => {
  let page: CommentPage;

  beforeEach(async () => {
    page = new CommentPage();
    page.selectPdfViewer();
    await page.openComments();
    // TODO this should use annotation-set.json's fake data
  });

  it('should display comments modal', async () => {

    const modalElement = page.getModal();
    expect(modalElement).toBeDefined();

    const commentContainerElement = page.getCommentContainer();
    expect(commentContainerElement).toBeDefined();
    console.log('JJJ - about to try to get Text from comment-container element');
    // await console.log(commentContainerElement.innerText);
    // await expect(commentContainerElement.getText).toContain('Date');

    // // table headers
    // expect(commentsElement).toContain('Created');
    // expect(commentsElement).toContain('Last modified');
    // expect(commentsElement).toContain('Comment');

    // // comment data
    // expect(commentsElement).toContain('em-showcase testuser');
    // expect(commentsElement).toContain('This is a comment');
    // expect(commentsElement).toContain('28 May 2019');
  });

  it('should truncate long comments', async () => {
    const secondCommentElement = page.getSecondComment();
    await console.log(secondCommentElement.getText);
    // TODO test whether the CSS class is using :before or :after in MultiLineEllipsis CSS class
    // expect(secondCommentElement).to Use Css "Before" Setting In comments-summary.component.scss
  });

  it('should display comments in correct order', async () => {
    // TODO Find substrings and find out how to get text from element
    const indexOfSubstring1 = findIndex(commentsElement.getText(), 'This comment should be second last');
    const indexOfSubstring2 = findIndex(commentsElement.getText(), 'This comment should be last');
    expect(indexOfSubstring1).toBeLessThan(indexOfSubstring2);
  });

  it('should close modal on clicking close', async () => {
    let modalElement = page.getCommentContainer();
    let commentContainerElement = page.getCommentContainer();
    expect(modalElement).toBeDefined();
    expect(commentContainerElement).toBeDefined();

    page.closeModal();
    modalElement = page.getModal(); // Might have to catch errors here instead
    commentContainerElement = page.getCommentContainer();
    expect(modalElement).toBeUndefined();
    expect(commentContainerElement).toBeUndefined();
  });

  it('should close modal on clicking outside modal', async () => {
    let modalElement = page.getCommentContainer();
    let commentContainerElement = page.getCommentContainer();
    expect(modalElement).toBeDefined();
    expect(commentContainerElement).toBeDefined();

    page.clickOutsideModal();
    modalElement = page.getModal();
    commentContainerElement = page.getCommentContainer();
    expect(modalElement).toBeUndefined();
    expect(commentContainerElement).toBeUndefined();
  });

  it('should go to pdf commented location on click', async () => {
    page.clickLastComment();
    const modalElement = page.getModal();
    const commentContainerElement = page.getCommentContainer();
    expect(modalElement).toBeUndefined();
    expect(commentContainerElement).toBeUndefined();
    expect(page.number()).toEqual('2'); // As set in annotation-set.json
  });

});
