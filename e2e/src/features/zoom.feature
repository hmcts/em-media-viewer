@MediaViewer @Zoom_Feature
Feature: Zoom In/Out Feature

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "MEDIA VIEWER DEMO"

  @PDF_Zoom_IN_OUT @Image_Zoom_IN_OUT @EM-1720 @ci
  Scenario Outline: PDF Viewer Zoom In/Out
    When I use zoom feature for "<pdf_or_image>" viewer
    Then I must able to zoom by defined zoom_option:<zoom_option>, <pdf_or_image>

    Examples:
      | pdf_or_image | zoom_option |
      | pdf          | 150%        |
      | image        |90%        |
