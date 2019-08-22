@MediaViewer @Annotations
Feature:  Media Viewer Annotations

  Background:
    Given I am on Media Viewer Page

  @EM-1991 @PDF_Non_Textual_Add_Comment
  Scenario: Add Non Textual Highlight and add comment in pdf viewer
    When I highlight a portion of pdf in a Draw mode
    Then I should be able to add comment for the highlight
#    Then The context toolbar should disappear
