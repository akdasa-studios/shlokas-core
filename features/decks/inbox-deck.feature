Feature: Decks / Inbox decks

  Rule: User can add verses to the Inbox deck

    Scenario: User adds a verse to the Inbox deck
      I, as a user, want to memorize a new verse. I add the verse to the Inbox
      deck. Two new cards are created in the Inbox deck, which helps me
      memorize the verse's text and translation.

      Given Inbox deck is empty
      When I add a verse "BG 1.1" to the Inbox deck
      Then The inbox deck contains the following cards:
        | Verse Number | Card Type       |
        | BG 1.1       | Translation     |
        | BG 1.1       | Transliteration |
