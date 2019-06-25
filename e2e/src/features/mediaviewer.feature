@MediaViewer
Feature: Media Viewer Toolbar Scenarios
  As a user
  I want to navigate to media viewer application
  So that I can enable the toolbar toggle buttons

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "Media Viewer Demo"

  @Toggle_Buttons
  Scenario: Enable Toolbar Toggle buttons
    And I enable toggle buttons
    Then I expect toolbar buttons should be enabled

  @PDFViewer_NextPage
  Scenario Outline: Navigate Next Page on PDF Document
    When I click next button on the pdf doc
    Then I should see page number should be '<page_number>'

    Examples:
      | page_number |
      | 2           |

  @PDFViewer_PreviousPage
  Scenario Outline: Navigate Previous Page PDF Document
    When I click previous button on the pdf doc
    Then I should see page number should be '<page_number>'

    Examples:
      | page_number |
      | 1           |





