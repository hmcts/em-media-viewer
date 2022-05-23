@MediaViewer @Redaction
Feature: Redact PDF E2E Tests

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "MEDIA VIEWER DEMO"
    When I click on the Redact button
    And I clear all the redactions using the clear all button
    Then all the redactions should be cleared

  @EM-4020
  Scenario: Redacting text and then removing the redaction
    Given I click on redact text
    When I highlight text on a PDF document
    And I can ensure the area has been redacted
    Then I can remove the redaction
    And I can ensure the redaction has been removed

  @EM-4020
  Scenario: Drawing a box and then removing it
    Given I click on draw a box
    When I highlight a portion of pdf in a Draw mode
    And I can ensure the area has been redacted
    Then I can remove the redaction
    And I can ensure the redaction has been removed

  @EM-4020 @ci @crossbrowser
  Scenario: Testing the preview redactions button
    Given that I have created both a text and box redaction
    When I preview the document with the redactions
    Then I ensure the preview is correct
    And I switch back from the preview view

  @EM-3946 @wip
  Scenario: Testing the save document with redactions button
    Given that I have change the document to a dm-store document
    And that I have created both a text and box redaction
    When I save the document with the redactions
#    Then the document should be saved

  @EM-4020 @ci @crossbrowser
  Scenario: Testing the clear all redactions button
    Given that I have created both a text and box redaction
    When I clear all the redactions using the clear all button
    Then all the redactions should be cleared
