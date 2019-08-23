@MediaViewer @Annotations
Feature: PDF Viewer Annotations

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "Media Viewer Demo"
    When I click Annotate button
    Then I expect Annotate button must be enabled

  @EM-1711 @PDF_Text_Highlight
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
  Scenario Outline: Update a PDF text Comment
    When I highlight text on a PDF document
    Then I should be able to add comment for the highlight
    Then I update the existing comment with '<my_text>'
    Then I verify the amended text has been saved

    Examples:
      | my_text          |
      | comment number 2 |

  @EM-1991 @PDF_Non_Textual_Add_Comment
  Scenario: Add Non Textual Highlight and add comment in pdf viewer
    When I highlight a portion of pdf in a Draw mode
    Then I should be able to add comment for the highlight
#    Then The context toolbar should disappear
