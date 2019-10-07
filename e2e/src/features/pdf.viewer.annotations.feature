@MediaViewer @Annotations
Feature: PDF Viewer Annotations

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "Media Viewer Demo"
    When I click Annotate button
    Then I expect Annotate button must be enabled

  @EM-1711 @PDF_Text_Highlight @ci
  Scenario: Add a comment to PDF Text highlight
    When I highlight text on a PDF document
    Then I expect text highlight popup should appear


  @EM-1717 @PDF_Add_Annotation @CreateAnnotation
  Scenario: Highlight text and add comment
    When I highlight text on a PDF document
    Then I should be able to add comment for the highlight
#    Then The context toolbar should disappear

  @EM-1961 @PDF_Delete_Annotation
  Scenario: Delete Textual comment
    Given The PDF has atleast one comment
    When I select a textual comment and delete
    Then The comment should be deleted

  @EM-1718 @Comment_update
  Scenario: Update a PDF text Comment
    When I highlight text on a PDF document
    Then I should be able to add comment for the highlight
    When I update the existing comment
    Then I verify the amended text has been saved

  @EM-1991 @PDF_Non_Textual_Add_Comment @ci
  Scenario: Add Non Textual Highlight and add comment in pdf viewer
    When I highlight a portion of pdf in a Draw mode
    Then I should be able to add comment for the highlight
#    Then The context toolbar should disappear


  @EM-1992 @PDF_Non_Textual_Delete_Comment
  Scenario: Delete Non Textual comment
    Given The PDF has atleast one non-textual comment
    When I select a non-textual comment and delete
    Then The comment should be deleted

  @EM-1814 @Comments_Ellipsis_Test
  Scenario: Comments Ellipsis Test
    Given The PDF has atleast one long comment
    When I click outside of the comment box
    Then I expect comment should display in ellipsis format

  @EM-2018 @PDF_Non_Textual
  Scenario: Add multiple non-textual comments on PDF page
    When I create multiple non-textual comments on a PDF document
    Then I should be able to see all comments in the comments pane
