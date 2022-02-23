@MediaViewer
Feature: Multimedia Video E2E Scenarios

  As a user I want to see multi-media video functionality should work as expected

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "MEDIA VIEWER DEMO"
    When I select the multimedia option

  @EM-4000 @play @ci
  Scenario: Check whether the video player is working or not?
    And I click play option
    Then I should see video in play mode

  @EM-4000 @pause
  Scenario: Pause Video
    And I click "pause" option
    Then I should see video in "pause" mode


  @EM-4131 @forward @ci
  Scenario: Forward Video
    And I click "rewind" option
    Then I should see video in "rewind" mode
