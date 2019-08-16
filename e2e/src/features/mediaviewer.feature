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

#  @EM-1247 @Print_Document
#  Scenario: Enable user to print file
#    When the user selects the print option
#    And the user selects the printer
#    Then I expect the file is queued for printing
