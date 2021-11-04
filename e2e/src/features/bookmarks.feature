@MediaViewer @Bookmarks @crossbrowser
Feature: Bookmarks Features Create,Delete and Update

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "MEDIA VIEWER DEMO"
    And I expect no existing bookmarks present

  @ci
  Scenario: Delete a bookmark
    When I highlight text to be bookmarked on the PDF document
    Then I capture the text highlight popup
    And  I am able to add a bookmark and verify it has been created 1 bookmark
    And I expect bookmark to be added to the existing list
    And I am able to delete a bookmark and verify it has been deleted

  @ci
  Scenario: Update a bookmark
    When I highlight text to be bookmarked on the PDF document
    Then I capture the text highlight popup
    And  I am able to add a bookmark and verify it has been created 1 bookmark
    And I expect bookmark to be added to the existing list
    And I am able to update a bookmark with text 'bookmark_update' and verify it has been updated

  @ci
  Scenario: Add a bookmark to a highlighted phrase on the PDF
    When I highlight text to be bookmarked on the PDF document
    Then I capture the text highlight popup
    And  I am able to add a bookmark and verify it has been created 1 bookmark
    And I expect bookmark to be added to the existing list

