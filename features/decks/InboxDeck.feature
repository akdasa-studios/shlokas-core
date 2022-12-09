Feature: Decks / Inbox Deck

  Background: Verse library
    Given Verse library contains the following verses:
      | Verse Number | Text                      | Translation              |
      | BG 1.1       | dharma-ksetre kuru-ksetre | O Sanjaya, after my sons |
      | BG 1.2       | drstva tu pandavanikam    | King, after looking ...  |
      | BG 1.3       | pasyaitam pandu-putranam  | O my teacher, behold ... |

  Rule: User can add verses to the Inbox deck

    Scenario: User adds a verse to the Inbox deck
      I, as a user, want to memorize a new verse. I add the verse to the Inbox
      deck. Two new cards are created in the Inbox deck, which helps me
      memorize the verse's text and translation.

      When I add a verse "BG 1.1" to the Inbox deck
      Then Inbox deck contains the following cards:
        | Verse Number | Card Type   |
        | BG 1.1       | Translation |
        | BG 1.1       | Text        |


  Rule: User can revert accidentally added cards to the Inbox deck

    Scenario: User reverts accidentally added verse
      I, as a user, want to remove an accidentally added verse from the Inbox

      When I add a verse "BG 1.1" to the Inbox deck
      And I revert the last action
      Then Inbox deck contains no cards


    Scenario: User revert accedentally added verse from the Inbox deck
      I, as a user, want to remove an accidentally added verse from the Inbox even though the Inbox deck already contains cards

      Given Inbox deck has the following cards:
        | Verse Number | Card Type   |
        | BG 1.3       | Translation |
        | BG 1.3       | Text        |
      When I add a verse "BG 1.1" to the Inbox deck
      And I revert the last action
      Then Inbox deck contains the following cards:
        | Verse Number | Card Type   |
        | BG 1.3       | Translation |
        | BG 1.3       | Text        |


  Rule: User can remove verses from the Inbox deck

    Scenario: User removes previously added verse from the Inbox deck
      I, as a user, want to remove the previously added verse If I found it
      hard to memorize and return back to it later

      Given Inbox deck has the following cards:
        | Verse Number | Card Type   |
        | BG 1.1       | Translation |
        | BG 1.3       | Translation |
        | BG 1.3       | Text        |
      When I remove verse "BG 1.3" from the Inbox deck
      Then Inbox deck contains the following cards:
        | Verse Number | Card Type   |
        | BG 1.1       | Translation |
