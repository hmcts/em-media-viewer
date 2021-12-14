@MediaViewer
Feature: Comments Panel E2E

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "MEDIA VIEWER DEMO"

  @CommentsTab @crossbrowser
  Scenario: Check whether the comments panel is disappearing or not?
    When The user clicks on the show comments panel
    Then I expect to see comments panel should appear
    When I click the close button
    Then I expect comments panel should disappear

  @AddComment
  Scenario: Add comment
    When I click Annotate button
    Then I expect Annotate button must be enabled
    When I highlight text on a PDF document
    Then I should be able to add comment for the highlight

  @CommentsPanelSearch
  Scenario: Show And Hide the Comments Panel
    When The user clicks on the show comments panel
    And  I expect to be able to click on the Filter Search And Comments Tab
    When I Search for Comments
    Then No matching results have been found

  @CommentsPanelCollateComments @CommentsTab @ci
  Scenario: Collate Comments Overlay Panel
    When The user clicks on the show comments panel toggle icon
    And The user clicks on Collate Comments
    Then The comment summary is displayed


