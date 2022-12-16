Feature: Library / Status

  I, as a user, want to know the status of the verse. It will help me find verses I can learn next and skip verses I have already learned.

  Background: Library
    Given Verse library contains the following verses:
      | Verse Number | Text                         | Translation              |
      | BG 1.1       | dharma-ksetre kuru-ksetre    | O Sanjaya, after my sons |
      | BG 1.2       | drstva tu pandavanikam       | King, after looking ...  |
      | SB 1.1.1     | om namo bhagavate vasudevaya | O my Lord, Sri Krisna .. |

  Rule: Verse changes status to Inbox when added to Inbox deck

    Scenario: User adds verse to Inbox deck and it updates state

      When I add a verse "BG 1.1" to the Inbox deck
      Then Status of the verse "BG 1.1" is "Inbox"


    Scenario: User removes verse from Inbox deck and it updates

      When I add a verse "BG 1.1" to the Inbox deck
      And I remove verse "BG 1.1" from the Inbox deck
      Then Status of the verse "BG 1.1" is "None"


    Scenario: User reverses adding verse to Inbox deck and it

      When I add a verse "BG 1.1" to the Inbox deck
      And I revert the last action
      Then Status of the verse "BG 1.1" is "None"
