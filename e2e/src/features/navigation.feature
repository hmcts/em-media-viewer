@MediaViewer @Navigation @crossbrowser
Feature: Navigation

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "MEDIA VIEWER DEMO"

  @Toggle_Buttons
  Scenario: Enable Toolbar Toggle buttons
    When I enable toggle buttons
    Then I expect toolbar buttons should be enabled

  @PDF_Page_Navigation @ci
  Scenario Outline: PDF Viewer Page Navigation
    When I click next button on the pdf
    Then I should see next page number should be '<page_number>'

    When I click previous button on the pdf
    Then I expect the page navigation should take me to the expected "<page_number2>"
#    Then I should see previous page number should be '<page_number2>'

    Examples:
      | page_number | page_number2 |
      | 2           | 1            |

  @EM-1245
  Scenario Outline: Enable page navigation within a file
    When I enter valid page number in page navigation text box:"<page_number>"
    Then I expect the page navigation should take me to the expected "<page_number>"

    Examples:
      | page_number |
      | 7           |
