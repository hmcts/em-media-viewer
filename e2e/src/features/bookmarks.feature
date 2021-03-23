@MediaViewer @Bookmarks
Feature: Bookmarks Features Create , Delete and Rename

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "MEDIA VIEWER DEMO"

  @EM-2710 @Bookmarks @ci
  Scenario: Add a Bookmark to a highlighted phrase on the PDF
     When I highlight text to be bookmarked on the PDF document
     Then I capture the text highlight popup
     And  I am able to add a bookmark and verify it has been created
     Then I expect bookmark to be added to the existing list
