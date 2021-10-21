@Print_And_Download
Feature: Print And Download

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "MEDIA VIEWER DEMO"

  @EM-1247 @Print_Document @WIP @crossbrowser
  Scenario: Enable user to print file
    When the user selects the print option
    Then I expect the print dialog should appear and the file is queued for printing
