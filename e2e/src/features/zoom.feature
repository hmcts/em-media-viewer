@MediaViewer @Zoom_Feature
Feature: Zoom In/Out Feature

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "Media Viewer Demo"

  @Rotate
  Scenario: Media Viewer Zoom In/Out
    When I use the Media Viewer Rotate feature
    Then I rotate the PDF document
