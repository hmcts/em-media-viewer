@MediaViewer @Annotations
Feature:  Media Viewer Annotations

  Background:
    Given I am on Media Viewer Page
    And I change to Image Viewer tab

  @EM-1964 @Image_Add_Annotation
  Scenario: Non Textual Highlight on image and add comment
    When I highlight a portion of image
    Then I should be able to add comment for the highlight
    Then The context toolbar should disappear
