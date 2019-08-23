@MediaViewer @PDF_Image_Rotation
Feature: PDF & Image Rotate

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "Media Viewer Demo"

  @PDF_Rotation @EM-960
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
