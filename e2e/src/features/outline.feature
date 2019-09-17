@MediaViewer @Outline
Feature: PDF Viewer outline and bookmark

  Background:
    Given I am on Media Viewer Page

  @EM-2090
 Scenario: Navigate through outline and bookmark
    When I open document outline sidebar
    Then I should be able to see bundle node and expand

  @EM-2090
 Scenario Outline: Navigate through outline and bookmark
    When I open document outline sidebar
    When I choose to navigate to "<link>"
    Then I expect the page navigation should take me to the expected "<page_number>"

    Examples:
    |link|page_number|
    |Bundle>A. Section A - Chronology>Prepared Discharge Final Order|4|

