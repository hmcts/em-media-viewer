@MediaViewer @crossbrowser
Feature: Multimedia Video E2E

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "MEDIA VIEWER DEMO"
    When I select the multimedia option

  @EM-4000 @play
  Scenario: Check whether the video player is working or not?
    And I click play option
    Then I should see video in play mode

  @EM-4000 @pause
  Scenario: Pause Video
    And I click pause option
    Then I should see video in pause mode
