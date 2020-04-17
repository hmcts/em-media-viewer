@MediaViewer @Annotations
Feature: Bookmarks Features Create , Delete and Rename

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "Media Viewer Demo"
#    When I click Annotate button
#    Then I expect Annotate button must be enabled

  @EM-2710 @Bookmarks
  Scenario: Add a comment to PDF Text highlight
#    When I load the document to do bookmarking on

    When I highlight text to be bookmarked on the PDF document
    Then I expect text highlight popup should appear
    And  I am able to add a bookmark
    Then I am able to verify listing of the bookmark



