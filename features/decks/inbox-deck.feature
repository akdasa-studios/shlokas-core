Feature: Decks / Inbox decks

  Rule: User can add verses to the Inbox deck

    Scenario: User adds a verse to the Inbox deck
      I, as a user, want to memorize a new verse. I add the verse to the Inbox
      deck. Two new cards are created in the Inbox deck, which helps me
      memorize the verse's text and translation.

      Given Empty Inbox deck
      When I add a verse "BG 1.1" to the Inbox deck
      Then Inbox deck contains the following cards:
        | Verse Number | Card Type       |
        | BG 1.1       | Translation     |
        | BG 1.1       | Transliteration |

    Scenario: User removes accidentally added verse from the Inbox deck
      I, as a user, want to remove an accidentally added verse from the Inbox

      Given Empty Inbox deck
      When I add a verse "BG 1.1" to the Inbox deck
      And I revert the last action
      Then Inbox deck contains no cards

    Scenario: User removes previously added verse from the Inbox deck
      I, as a user, want to remove the previously added verse If found it
      hard and return back to it later

      Given Empty Inbox deck
      When I add a verse "BG 1.1" to the Inbox deck
      And I revert the last action
      Then Inbox deck contains no cards
