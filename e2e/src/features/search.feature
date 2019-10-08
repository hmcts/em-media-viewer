@MediaViewer @Search
Feature: Search

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "Media Viewer Demo"

  @EM-1246 @MultipleWords_Search @ci
  Scenario Outline: Enable Search within a document
    When the user populate the content search field with a '<keyword_search>'
    Then the "<search_results_count>" are displayed and highlighted to the user
    And the section of the document is viewable to the user

    Examples:
      | keyword_search | search_results_count |
      | family court    | 1 of 5 matches      |

  @EM-1246 @SingleWord_Search
  Scenario Outline: Enable Search within a document
    When the user populate the content search field with a '<search_word>'
    Then the "<search_results_count>" are displayed and highlighted to the user
    And the section of the document is viewable to the user

    Examples:
      | search_word  | search_results_count |
      | children | 1 of 88 matches       |

  @EM-1246 @No_Search_Results
  Scenario Outline: Enable Search within a document
    When the user populate the content search field with a '<search_word>'
    Then the "<search_results_count>" are displayed and highlighted to the user

    Examples:
      | search_word | search_results_count |
      | Phani Perla | Phrase not found     |
