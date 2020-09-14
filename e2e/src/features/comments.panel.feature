@MediaViewer @Search
Feature: CommentsPanelSearch

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "MEDIA VIEWER DEMO"

#  @CommentsPanelSearch @ci
#  Scenario: Show And Hide the Comments Panel
#    When The user clicks on the show comments panel toggle icon
#    And  I expect to be able to click on the Comments Tab
#    And  I expect to be able to click on the Comments Tab
#    And  I am able to click on the Collate Summary Button
#    Then The user closes the overlay panel

  @CommentsPanelSearch @ci
  Scenario: Add A Comment and Enable Filter and Search
    When I highlight a portion of pdf in a Draw mode


    # add a comment using box highlight
    # assert that Filter and Search Tabs are visible
    # click on Collate Summary and Close Popup
    # Assert that the





#  @CommentsPanelCollateComments @ci
#  Scenario: Collate Comments Overlay Panel
#    When  The user clicks on the show comments panel toggle icon
#    And   The user clicks on the Comments Tab
#    And   The user clicks on Collate Summary
#    Then  There are no comment rows present
#


#  New Scenarios
#  @CommentsPanelAddSearchFilterComments @ci
#  Scenario: Add Comment and Search Comment and then Filter Comment
#
#  @CommentsPanelAddTags @ci
#  Scenario: Add Comment + (Edit comment + Add Tag + Save Tag ) + ( Filter Tag + Search Tag )
#
