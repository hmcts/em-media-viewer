// import { CommentPage } from '../pages/comment.po';
// import { first, findIndex } from 'rxjs/operators';
// import { browser } from 'protractor';

// describe('comment', () => {
//   let page: CommentPage;

//   beforeEach(async () => {
//     page = new CommentPage();
//     page.selectPdfViewer();
//     // TODO this should use annotation-set.json's fake data
//   });

//   afterEach(async () => {
//     page.closeModal();
//   });

//   it('should display comments modal', async () => {
//     page.openModal();

//     const modalElement = await page.getModal();
//     // expect(modalElement).toBeDefined();

//     const commentContainerElement = await page.getCommentContainer();
//     // expect(commentContainerElement).toBeDefined();

//     const commentContainerText = await commentContainerElement.getText();
//     console.log('JJJ - commentContainerText is ', commentContainerText);
//     expect(commentContainerText).toContain('Date');
//   //   expect(commentContainerText).toContain('User');
//   //   expect(commentContainerText).toContain('Comment');
//   //   // expect(commentContainerText).toContain('Last modified');

//   //   expect(commentContainerText).toContain('em-showcase testuser');
//   //   expect(commentContainerText).toContain('This is a comment');
//   //   expect(commentContainerText).toContain('28 May 2019');
//   });

//   // it('should truncate long comments', async () => {
//   //   const secondCommentElement = page.getSecondComment();
//   //   await console.log(secondCommentElement.innerText);
//   //   // TODO test whether the CSS class is using :before or :after in MultiLineEllipsis CSS class
//   //   // expect(secondCommentElement).to Use Css "Before" Setting In comments-summary.component.scss
//   // });

//   // it('should display comments in correct order', async () => {
//   //   // TODO Find substrings and find out how to get text from element
//   //   const commentsElement = page.getCommentContainer();
//   //   const indexOfSubstring1 = commentsElement.indexOf('This comment should be second last');
//   //   const indexOfSubstring2 = commentsElement.indexOf('This comment should be last');
//   //   expect(indexOfSubstring1).toBeLessThan(indexOfSubstring2);
//   // });

//   // it('should close modal on clicking close', async () => {
//   //   let modalElement = page.getCommentContainer();
//   //   let commentContainerElement = page.getCommentContainer();
//   //   expect(modalElement).toBeDefined();
//   //   expect(commentContainerElement).toBeDefined();

//   //   page.closeModal();
//   //   modalElement = page.getModal(); // Might have to catch errors here instead
//   //   commentContainerElement = page.getCommentContainer();
//   //   expect(modalElement).toBeUndefined();
//   //   expect(commentContainerElement).toBeUndefined();
//   // });

//   // it('should close modal on clicking outside modal', async () => {
//   //   let modalElement = page.getCommentContainer();
//   //   let commentContainerElement = page.getCommentContainer();
//   //   expect(modalElement).toBeDefined();
//   //   expect(commentContainerElement).toBeDefined();

//   //   page.clickOutsideModal();
//   //   modalElement = page.getModal();
//   //   commentContainerElement = page.getCommentContainer();
//   //   expect(modalElement).toBeUndefined();
//   //   expect(commentContainerElement).toBeUndefined();
//   // });

//   // it('should go to pdf commented location on click', async () => {
//   //   page.clickLastComment();
//   //   const modalElement = page.getModal();
//   //   const commentContainerElement = page.getCommentContainer();
//   //   expect(modalElement).toBeUndefined();
//   //   expect(commentContainerElement).toBeUndefined();
//   //   expect(page.number()).toEqual('2'); // As set in annotation-set.json
//   // });

// });
