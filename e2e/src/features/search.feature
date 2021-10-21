@MediaViewer @Search @crossbrowser
Feature: Search

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "MEDIA VIEWER DEMO"

  @EM-1246 @MultipleWords_Search @ci @crossbrowser
  Scenario Outline: Enable Search within a document
    When the user populate the content search field with a '<keyword_search>'
    Then clicks on search button
    Then the "<search_results_count>" are displayed and highlighted to the user
    And the section of the document is viewable to the user

    Examples:
      | keyword_search | search_results_count |
      | family court    | Found 1 of 5      |

  @EM-1246 @SingleWord_Search @crossbrowser
  Scenario Outline: Enable Search within a document
    When the user populate the content search field with a '<search_word>'
    Then clicks on search button
    Then the "<search_results_count>" are displayed and highlighted to the user
    And the section of the document is viewable to the user

    Examples:
      | search_word  | search_results_count |
      | children | Found 1 of 88       |

  @EM-1246 @No_Search_Results @crossbrowser
  Scenario Outline: Enable Search within a document
    When the user populate the content search field with a '<search_word>'
    Then clicks on search button
    Then the "<search_results_count>" are displayed and highlighted to the user

    Examples:
      | search_word | search_results_count |
      | Phani Perla | No results found     |
