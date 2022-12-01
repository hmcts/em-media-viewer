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
    downloadPdfDocument: steps.printAndDownload.mvDownload,
    mvPrintDocument: steps.printAndDownload.mvPrint,
    rotatePdfAndJpg: steps.rotate.pdfAndImageRotation,
    createBookMark: steps.bookMarks.createBookmarks,
    mvDeleteBookmark: steps.bookMarks.deleteBookMark,
    clearBookMarks: steps.bookMarks.clearBookmarkss,
    updateBookMarks: steps.bookMarks.updateBookMark,
    addEmptyBookmarks: steps.bookMarks.addAnEmptyBookMarks,
    mvAudioScenario:steps.multiMediaAudioAndVideo.multiMediaAudio,
    annotationsHighlightText:steps.annotationsAndComments.highlightPdfText,
    createAnnotation:steps.annotationsAndComments.addComment,
    deleteAnnotation:steps.annotationsAndComments.deleteAnnotations,
    clearExistingHighLights:steps.annotationsAndComments.clearExistingTextHighlights,
    selectTextToHighlight:steps.highLightPdfText.highLighText,
    deleteAllComments:steps.annotationsAndComments.deleteExistingComments,

  });
};
