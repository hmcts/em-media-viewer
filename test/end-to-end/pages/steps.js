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
    executeContentSearchTest: steps.search.searchFeatureTests,
    searchResultsNavigationUsingPreviousAndNextLinksTest: steps.search.searchFeatureTests,
    navigateSearchResultsUsingEnterTest: steps.search.searchFeatureTests,
    pdfViewerZoomTest: steps.zoom.pdfViewerZoom
  });
};
