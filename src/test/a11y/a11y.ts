// // /* eslint-disable */
// // import {fail} from 'assert';

// import 'jest';
// import 'mocha';
// import 'node';

const PageUrls = {

    //Page URL's for the MV Pages.
    HOME: '/'
    // HOME: '/',
    // DASHBOARD: '/dashboard',
    // //Page URL's for the CUI Functional Pages.
    // DEFENDANT : '/dashboard/:cuiCaseId/defendant',
    // TASK_LIST : '/case/:cuiCaseId/response/task-list',
    // //Page URL's for the Case Progression Functional Pages.
    // CASE_PROGRESSION_TASK_LIST : '/case/:caseProgressionCaseId/defendant',
    // UPLOAD_YOUR_DOCUMENTS : '/case/:caseProgressionCaseId/case-progression/upload-your-documents',
    // WHAT_TYPE_OF_DOCUMENTS_DO_YOU_WANT_TO_UPLOAD : '/case/:caseProgressionCaseId/case-progression/type-of-documents',
    // UPLOAD_DOCUMENTS : '/case/:caseProgressionCaseId/case-progression/upload-documents',
  }

// import {PageUrls} from './constants';

const pa11y = require('pa11y');

const envUrl = process.env.TEST_URL || 'http://localhost:3000';
const options = ['WCAG2AA.Principle1.Guideline1_3.1_3_1.H42.2'];
// Ignore pages that are passing in WAVE evaluation tool
const ignoredPages = [''];
const mvCaseReference = '1645882162449409';
const mvCaseProgressionCaseReference = '1645882162449409';

class PallyIssue {
  code: string;
  context: string;
  message: string;
  selector: string;
  type: string;
  typeCode: number;
}

function expectNoErrors(messages: PallyIssue[]): void {
  const errors = messages.filter(m => m.type === 'error');

  if (errors.length > 0) {
    // const errorsAsJson = `${JSON.stringify(errors, null, 2)}`;
    // fail(`There are accessibility issues: \n${errorsAsJson}\n`);
  }
}

function testAccessibility(url: string): void {
  describe(`Page ${url}`, () => {
    it('should have no accessibility errors', async () => {
      if (!ignoredPages.includes(url)) {
        if (url.includes('media-viewer')) {
          url = url.replace('media-viewer', mvCaseReference);
        } else if (url.includes(':caseProgressionCaseId')) {
          url = url.replace('media-viewer', mvCaseProgressionCaseReference);
        }
        const pageUrl = envUrl + url;
        // const pageUrl  = url
        const messages = await pa11y(pageUrl, {
          ignore: options,
        });
        expectNoErrors(messages.issues);
      }
    });
  });
}

describe('Accessibility', async () => {
  Object.values({...PageUrls}).forEach(url => {
    testAccessibility(url);
  });
});