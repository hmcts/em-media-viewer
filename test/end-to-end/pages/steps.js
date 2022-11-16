'use strict';

const requireDirectory = require('require-directory');
const steps = requireDirectory(module);

module.exports = () => {
  return actor({
    authenticateWithIdam: steps.idam.signIn,
    chooseNextStep: steps.nextStep.nextStep,
    uploadPdfDoc: steps.uploadDocument.uploadPdfDocument,
    uploadImage: steps.uploadDocument.uploadImageJpeg,
    uploadWordDoc: steps.uploadDocument.uploadWordDocument,
    executeContentSearch: steps.search.contentSearch,
    searchResultsNavigationUsingPreviousAndNextLinks: steps.search.searchResultsNavigationUsingNextAndPrevious,
    enterShouldJumpViewerToNextSearchResult: steps.search.enterShouldJumpViewerToNextSearchResults,
    executePdfViewerZoom: steps.zoom.pdfViewerZoom,
    openCaseDocumentsInMV: steps.openCaseDocsInMv.openCaseDocsInMV,
    pdfViewerPageNavigation: steps.navigationMV.pdfViewerNavigation,
    downloadPdfDocument: steps.downloadAndPrint.mvDownload,
    mvPrintDocument: steps.downloadAndPrint.mvPrint,
    rotatePdfAndJpg: steps.pdfAndImageRotate.pdfAndImageRotation,
    createBookMark: steps.bookMarks.createBookmarks,
    mvDeleteBookmark: steps.bookMarks.deleteBookMark,
    clearBookMarks: steps.bookMarks.clearBookmarkss
  });
};
