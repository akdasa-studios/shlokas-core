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
      I, as a user, want to remove an accidentally added verse from the
      Inbox even though the Inbox deck already contains cards

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


  Rule: User can mark cards as memorized

    After a card is marked as memorized in the Inbox deck, new cards are created
    in the Review deck. The number and type of cards created depends on the type
    of memorized card and the presence of existing cards in the Review deck.

    Scenario: User marks a card as memorized
      I, as a user, want to mark a card as memorized and move it to
      the Review deck. Only two cards

      When I add a verse "BG 1.1" to the Inbox deck
      And I mark the "BG 1.1" card of the "Text" type as memorized
      And I mark the "BG 1.1" card of the "Translation" type as memorized
      Then Inbox deck contains no cards

    Scenario: Number and Text cards added to the Review deck
      As a user, I want to mark a card as memorized and move it to the review
      deck. Only two cards are created containing a number and text. Cards
      containing the translation are not created because I haven't
      memorized it yet.

      When I add a verse "BG 1.1" to the Inbox deck
      And I mark the "BG 1.1" card of the "Text" type as memorized
      Then Review deck contains the following cards:
        | Verse Number | Card Type      |
        | BG 1.1       | Number -> Text |
        | BG 1.1       | Text -> Number |

    Scenario: Number and Translation cards added to the Review deck
      When I add a verse "BG 1.1" to the Inbox deck
      And I mark the "BG 1.1" card of the "Translation" type as memorized
      Then Review deck contains the following cards:
        | Verse Number | Card Type             |
        | BG 1.1       | Number -> Translation |
        | BG 1.1       | Translation -> Number |

    Scenario: All card types added to the Review deck
      Once all cards are marked as memorized in the input deck, then all cards
      are created in the review deck.

      When I add a verse "BG 1.1" to the Inbox deck
      And I mark the "BG 1.1" card of the "Text" type as memorized
      And I mark the "BG 1.1" card of the "Translation" type as memorized
      Then Review deck contains the following cards:
        | Verse Number | Card Type             |
        | BG 1.1       | Number -> Text        |
        | BG 1.1       | Text -> Number        |
        | BG 1.1       | Number -> Translation |
        | BG 1.1       | Translation -> Number |
        | BG 1.1       | Text -> Translation   |
        | BG 1.1       | Translation -> Text   |


  Rule: User can revert marked card

    Scenario: Reverts last added card

      When I add a verse "BG 1.1" to the Inbox deck
      And I mark the "BG 1.1" card of the "Text" type as memorized
      Then I revert the last action
      And Review deck contains no cards
      And Inbox deck contains the following cards:
        | Verse Number | Card Type   |
        | BG 1.1       | Translation |
        | BG 1.1       | Text        |

    Scenario: Reverts last added cards

      When I add a verse "BG 1.1" to the Inbox deck
      And I mark the "BG 1.1" card of the "Text" type as memorized
      And I mark the "BG 1.1" card of the "Translation" type as memorized
      And I revert the last action
      Then Inbox deck contains the following cards:
        | Verse Number | Card Type   |
        | BG 1.1       | Translation |
      And Review deck contains the following cards:
        | Verse Number | Card Type      |
        | BG 1.1       | Number -> Text |
        | BG 1.1       | Text -> Number |


