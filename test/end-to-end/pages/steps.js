'use strict';

const requireDirectory = require('require-directory');
const annotateFromSearch = require('./annotationsAndComments/annotateFromSearch');
const openHighlightToolbar = require('./annotationsAndComments/openHighlightToolbar');
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
    openBookmarksPanel: steps.bookMarks.openBookmarksPanel,
    updateBookMarks: steps.bookMarks.updateBookMark,
    addNamedBookmark: steps.bookMarks.addNamedBookmark,
    sortBookmarks: steps.bookMarks.sortBookmarks,
    addEmptyBookmarks: steps.bookMarks.addAnEmptyBookMarks,
    customOrderBookmarks: steps.bookMarks.customOrderBookmarks,
    reorderBookmarks: steps.bookMarks.reorderBookmarks,
    bookmarkBoxBlank: steps.bookMarks.bookmarkBoxBlank,
    add30Bookmarks: steps.bookMarks.add30Bookmarks,
    mvAudioScenario: steps.multiMedia.multiMediaAudio,
    highlightPdfText: steps.annotationsAndComments.highlightPdfText,
    addCommentAndRotate: steps.annotationsAndComments.addCommentAndRotate,
    addComments: steps.annotationsAndComments.addComments,
    updateComment: steps.annotationsAndComments.updateComment,
    deleteComments: steps.annotationsAndComments.deleteComments,
    deleteAllExistingTextHighlights: steps.annotationsAndComments.deleteAllExistingTextHighlights,
    deleteAllExistingComments: steps.annotationsAndComments.deleteAllExistingComments,
    clickCommentsPanel: steps.annotationsAndComments.clickCommentsPanel,
    collateComments: steps.annotationsAndComments.collateComments,
    collateCommentsNotBlank: steps.annotationsAndComments.collateCommentsNotBlank,
    commentsSearch: steps.annotationsAndComments.commentsSearch,
    addMultipleComments: steps.annotationsAndComments.addMultipleComments,
    clickRedactMenu: steps.redact.clickRedactMenu,
    redactTextUsingDrawBox: steps.redact.redactTextUsingDrawBox,
    clearAllRedactions: steps.redact.clearAllRedactions,
    redactionsPreview: steps.redact.redactionsPreview,
    verifyWhetherTheRedactionAreVisibleOrNot: steps.redact.verifyWhetherTheRedactionAreVisibleOrNot,
    redactText: steps.redact.redactText,
    markContentForRedaction: steps.redact.markContentForRedaction,
    redactFirstPage: steps.redact.redactFirstPage,
    redactMultiplePages: steps.redact.redactMultiplePages,
    redactContentUsingRedactText: steps.redact.redactContentUsingRedactText,
    navigateIndexBundleDocument: steps.indexAndOutline.navigateIndexBundleDocument,
    navigateIndexNestedDocument: steps.indexAndOutline.navigateIndexNestedDocument,
    CreateRedactionsUsingDrawboxAndRedactText: steps.redact.CreateRedactionsUsingDrawboxAndRedactText,
    redactTextAndThenRemoveRedaction: steps.redact.redactTextAndThenRemoveRedaction,
    previewAllRedactions: steps.redact.previewAllRedactions,
    saveAllRedactions: steps.redact.saveAllRedactions,
    highlightOnImage: steps.annotationsAndComments.highlightOnImage,
    nonTextualHighlightAndComment: steps.annotationsAndComments.nonTextualHighlightAndComment,
    updateNonTextualComments: steps.annotationsAndComments.updateNonTextualComments,
    deleteAllExistingNonTextualHighlights: steps.annotationsAndComments.deleteAllExistingNonTextualHighlights,
    redactSearchAndRedactAll: steps.redact.redactSearchAndRedactAll,
    clickSearchFrom: steps.redact.clickSearchFrom,
    redactFillSearchInput: steps.redact.redactFillSearchInput,
    clickRedactSearchButton: steps.redact.clickRedactSearchButton,
    clickRedactAllButton: steps.redact.clickRedactAllButton,
    openImage: steps.imageViewer.openImage,
    openHighlightToolbar: steps.annotationsAndComments.openHighlightToolbar,
    annotateFromSearch: steps.annotationsAndComments.annotateFromSearch,
    loadDocumentAndCheckSuccessLoad: steps.indexAndOutline.loadDocumentAndCheckSuccessLoad,
  });
};
