'use strict';

const requireDirectory = require('require-directory');
const steps = requireDirectory(module);

module.exports = () => {
  return actor({
    authenticateWithIdam: steps.idam.signIn,
    chooseNextStep: steps.nextStep.nextStep,
    uploadPdfDoc: steps.dmStore.uploadPdfDocument,
    uploadImage: steps.dmStore.uploadImageJpeg,
    uploadWordDoc: steps.dmStore.uploadWordDocument,
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
    highlightPdfText:steps.annotationsAndComments.highlightPdfText,
    addComments:steps.annotationsAndComments.addComments,
    deleteComments:steps.annotationsAndComments.deleteComments,
    deleteAllExistingTextHighlights:steps.annotationsAndComments.deleteAllExistingTextHighlights,
    deleteAllExistingComments:steps.annotationsAndComments.deleteAllExistingComments,
    clickCommentsPanel:steps.annotationsAndComments.clickCommentsPanel,
    collateComments:steps.annotationsAndComments.collateComments,
    commentsSearch:steps.annotationsAndComments.commentsSearch,
    addMultipleComments:steps.annotationsAndComments.addMultipleComments,
    clickRedactMenu:steps.redact.clickRedactMenu,
    redactTextUsingDrawBox:steps.redact.redactTextUsingDrawBox,
    clearAllRedactions:steps.redact.clearAllRedactions,
    redactionsPreview:steps.redact.redactionsPreview,
    verifyWhetherTheRedactionAreVisibleOrNot:steps.redact.verifyWhetherTheRedactionAreVisibleOrNot,
    redactText:steps.redact.redactText,
    markContentForRedaction:steps.redact.markContentForRedaction,
    redactContentUsingRedactText:steps.redact.redactContentUsingRedactText,
    navigateIndexBundleDocument:steps.indexAndOutline.navigateIndexBundleDocument,
    navigateIndexNestedDocument:steps.indexAndOutline.navigateIndexNestedDocument,
    CreateRedactionsUsingDrawboxAndRedactText:steps.redact.CreateRedactionsUsingDrawboxAndRedactText,
    redactTextAndThenRemoveRedaction:steps.redact.redactTextAndThenRemoveRedaction,
    previewAllRedactions:steps.redact.previewAllRedactions,
    saveAllRedactions:steps.redact.saveAllRedactions,
    navigateIndexBundleDocument:steps.indexAndOutline.navigateIndexBundleDocument

  });
};
