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
    openMediaTypeInMediaViewer: steps.commonSteps.viewPdfDocInMediaViewer,
    pdfViewerPageNavigation: steps.navigationMV.pdfViewerNavigation,
    downloadPdfDocument: steps.downloadAndPrint.mvDownload,
    MvPrintDocument: steps.downloadAndPrint.mvPrint,
    rotatePdfAndJpg:steps.pdfAndImageRotate.pdfAndImageRotation
  });
};
