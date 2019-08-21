@MediaViewer
Feature: Media Viewer Test Suite
  As a user
  I want to navigate to media viewer application
  So that I can perform media viewer workflow's

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "Media Viewer Demo"

  @Toggle_Buttons
  Scenario: Enable Toolbar Toggle buttons
    When I enable toggle buttons
    Then I expect toolbar buttons should be enabled

  @PDF_Page_Navigation
  Scenario Outline: PDF Viewer Page Navigation
    When I click next button on the pdf
    Then I should see next page number should be '<page_number>'

    When I click previous button on the pdf
    Then I should see previous page number should be '<page_number2>'

    Examples:
      | page_number | page_number2 |
      | 2           | 1            |

  @EM-1247 @Print_Document @WIP
  Scenario: Enable user to print file
    When the user selects the print option
    Then I expect the print dialog should appear and the file is queued for printing

  @Search @EM-1246 @Search_with_MultipleWords
  Scenario Outline: Enable Search within a document
    When the user populate the content search field with a '<search_value>'
    Then the search results are displayed and highlighted to the user
    And the section of the document is viewable to the user

    Examples:
      | search_value |
      | Trace Trees  |


