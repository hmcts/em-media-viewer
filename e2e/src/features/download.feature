@MediaViewer
Feature: Document Download

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "MEDIA VIEWER DEMO"

  @EM-3566 @Download @crossbrowser
  Scenario: Verify whether the user able to download the document or not?
    When the user selects the download option
    Then I expect to see the document should be downloaded
