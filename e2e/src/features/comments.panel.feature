@MediaViewer @Search
Feature: CommentsPanelSearch

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "MEDIA VIEWER DEMO"

  @CommentsPanelSearch
  Scenario: Show And Hide the Comments Panel
    When The user clicks on the show comments panel toggle icon
    And  I expect to be able to click on the Filter Search And Comments Tab
    When I Search for Comments
    Then No matching results have been found


  @CommentsPanelCollateComments @ci
  Scenario: Collate Comments Overlay Panel
    When  The user clicks on the show comments panel toggle icon
    And   The user clicks on Collate Comments
    Then  The comment summary is displayed

