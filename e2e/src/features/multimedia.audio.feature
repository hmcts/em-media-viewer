@MediaViewer
Feature: Multimedia Audio E2E

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "MEDIA VIEWER DEMO"
    When I select the multimedia option

  @EM-4018 @play @ci
  Scenario: Check whether the audio player is working or not?
    And I click "play" option
    Then I should see "audio" in play mode

  @EM-4018 @pause @ci
  Scenario: Pause Video
    And I click "pause" option
    Then I should see "audio" in "pause" mode

  @rewind @ci
  Scenario: Rewind Audio
    And I click "rewind" option
    Then I should see "audio" in "rewind" mode
