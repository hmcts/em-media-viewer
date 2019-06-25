@MediaViewer
Feature: Media Viewer Toolbar Scenarios
  As a user
  I want to navigate to media viewer application
  So that I can enable the toolbar toggle buttons

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "Media Viewer Demo"

  Scenario: Enable Toolbar Toggle buttons
    And I enable toggle buttons
    Then I expect toolbar icons should appear









