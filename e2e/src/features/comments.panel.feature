@MediaViewer @Search
Feature: CommentsPanelSearch

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "Media Viewer Demo"

  @CommentsPanelSearch @ci
  Scenario: Show And Hide the Comments Panel
    When The user clicks on the show comments panel toggle icon
    And  The user clicks to hide the toggle icon
    Then The user clicks on the show comments panel toggle icon
    Then I expect to be able to click on the Filter Search And Comments Tab
    And  I do a invalid search of the Comments Tab

  @CommentsPanelCollateComments @ci
  Scenario: Collate Comments Overlay Panel
    When The user clicks on the show comments panel toggle icon
    And  The user clicks on the Comments Tab And Then clicks on Collate Summary
    And  There are no comment rows present

