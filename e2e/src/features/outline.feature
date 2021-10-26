@MediaViewer @Outline
Feature: PDF Viewer outline and bookmark

  Background:
    Given I am on Media Viewer Page

  @EM-2090 @ci
  Scenario: Navigate through outline and bookmark
    When I open document outline sidebar
    Then I should be able to see bundle node and expand

  @EM-2090
  Scenario Outline: Navigate through outline and bookmark
    When I open document outline sidebar
    And I choose to navigate to "<link>"
    Then I expect the page navigation should take me to the expected "<page_number>"

    Examples:
      |link|page_number|
      |Bundle>A. Section A - Chronology>Prepared Discharge Final Order|4|
      |Bundle>E. Section D - Care Plans>Prepared Discharge Final Order|20|

  @ci
  Scenario: Navigate through show bookmarks
    When I clear existing bookmarks
    And add a new bookmark
    And I open document outline sidebar and click show bookmarks
    Then I expect 1 bookmark is present in bookmarks list
