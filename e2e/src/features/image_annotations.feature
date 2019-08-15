@MediaViewer @Annotations
Feature:  Media Viewer Annotations

  Background:
    Given I am on Media Viewer Page
    And I change to Image Viewer tab

  @EM-1964 @Image_Add_Comment
  Scenario: Add Non Textual Highlight and add comment in image viewer
    When I highlight a portion of image
    Then I should be able to add comment for the highlight
    Then The context toolbar should disappear

  @EM-1348 @Image_Delete_Comment
  Scenario: Delete Non Textual comment in image viewer
    Given The image has atleast one non-textual comment
    When I select a non-textual comment and delete
    Then The comment should be deleted
