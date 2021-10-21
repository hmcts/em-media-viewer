@MediaViewer @PDF_Image_Rotation @crossbrowser
Feature: PDF & Image Rotation

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "MEDIA VIEWER DEMO"

  @PDF_Rotation @EM-960 @flaky
  Scenario Outline: PDF Rotation
    When I use the "<PDF_Or_Image>" viewer rotate feature
    Then I must rotate the "<PDF/Image>" document

    Examples:
      | PDF/Image | PDF_Or_Image |
      | pdf       | pdf          |

  @Image_Rotation @Test @EM-960
  Scenario Outline: Image Rotation
    When I use the "<PDF_Or_Image>" viewer rotate feature
    Then I must rotate the "<PDF/Image>" document

    Examples:
      | PDF/Image | PDF_Or_Image |
      | image     | image        |

  @EM-1703 @PDFTextHighlight_Rotate
  Scenario: PDF Text Highlighting - Rotate Support
    Given the PDF viewer has atleast one highlight
    When I rotate PDF doc the pdf text highlights should be rotate
    Then I should expect pdf text highlights are inline with rotation
