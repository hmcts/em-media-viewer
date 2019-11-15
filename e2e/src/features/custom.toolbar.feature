@Custom_Toolbar
Feature: Custom Toolbar Feature

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "Media Viewer Demo"
    When I enable custom toolbar
    Then I expect custom toolbar should be enabled

  @Custom_Toolbar_Step_Navigation @ci
  Scenario Outline: Navigate to the next page using custom toolbar
    When I click next button on the pdf
    Then I should see next page number should be '<page_number>'

    When I click previous button on the pdf
    Then I expect the page navigation should take me to the expected "<page_number2>"
#    Then I should see previous page number should be '<page_number2>'

    Examples:
      | page_number | page_number2 |
      | 2           | 1            |

  @Custom_Toolbar_Input_Navigation @ci
  Scenario Outline: Enable page navigation within a file
    When I enter valid page number in page navigation text box:"<page_number>"
    Then I expect the page navigation should take me to the expected "<page_number>"

    Examples:
      | page_number |
      | 7           |

  @Custom_Toolbar_Rotation @ci
  Scenario Outline: PDF Rotation
    When I use the viewer rotate feature
    Then I must rotate the "<PDF/Image>" document

    Examples:
      | PDF/Image | PDF_Or_Image |
      | pdf       | pdf          |

  @Custom_Toolbar_Rotation_Image
  Scenario Outline: Image Rotation
    When I use the "<PDF_Or_Image>" viewer rotate feature
    Then I must rotate the "<PDF/Image>" document

    Examples:
      | PDF/Image | PDF_Or_Image |
      | image     | image        |

  @Custom_Toolbar_Zoom @ci
  Scenario Outline: PDF Viewer Zoom In/Out
    When I use zoom feature for "<pdf_or_image>" viewer
    Then I must able to zoom by defined zoom_option:<zoom_option>, <pdf_or_image>

    Examples:
      | pdf_or_image | zoom_option |
      | pdf          | 150%        |
      | image        | 150%        |

  @Custom_Toolbar_MultipleWords_Search @ci
  Scenario Outline: Enable Search within a document
    When the user populate the content search field with a '<keyword_search>'
    Then the "<search_results_count>" are displayed and highlighted to the user
    And the section of the document is viewable to the user

    Examples:
      | keyword_search | search_results_count |
      | family court    | 1 of 5 matches      |

  @Custom_Toolbar_SingleWord_Search
  Scenario Outline: Enable Search within a document
    When the user populate the content search field with a '<search_word>'
    Then the "<search_results_count>" are displayed and highlighted to the user
    And the section of the document is viewable to the user

    Examples:
      | search_word  | search_results_count |
      | children | 1 of 88 matches       |

  @Custom_Toolbar_No_Search_Results
  Scenario Outline: Enable Search within a document
    When the user populate the content search field with a '<search_word>'
    Then the "<search_results_count>" are displayed and highlighted to the user

    Examples:
      | search_word | search_results_count |
      | Phani Perla | Phrase not found     |
