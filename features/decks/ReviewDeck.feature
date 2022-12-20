Feature: Decks / Review Deck

  Background: Verse library

    Given Verse library contains the following verses:
      | Verse Number | Text                      | Translation              |
      | BG 1.1       | dharma-ksetre kuru-ksetre | O Sanjaya, after my sons |
      | BG 1.2       | drstva tu pandavanikam    | King, after looking ...  |
      | BG 1.3       | pasyaitam pandu-putranam  | O my teacher, behold ... |
    And Now is "2022-01-01"



  Rule: The review deck only shows the cards that need to be reviewed.

    I, as a User, want to see only cards that need to be reviewed today in the
    review deck. I don't want to see cards due to review tomorrow or in the next
    few days. This will decrease the number of cards I need to review and make
    the review process more efficient. I also don't want to see cards that have
    already been reviewed today.

    Background: Two cards in the Review deck

      Given Review deck has the following cards:
        | Verse  | Type           | Due To     |
        | BG 1.1 | Number -> Text | 2022-01-02 |
        | BG 1.2 | Number -> Text | 2022-01-03 |


    Scenario: The review deck shows now cards if there are no due cards
      Then I see no cards for review on "2022-01-01"


    Scenario: The review deck only shows cards that need to be reviewed today
      As a user, I only see cards in the review deck that need to be reviewed
      today.

      Then I see the following cards for review on "2022-01-02":
        | Verse  | Type           |
        | BG 1.1 | Number -> Text |


    Scenario: The review deck shows cards that have not been reviewed before
      I, as a user, see in the review deck only those cards that need to be
      reviewed today and those cards that have not been reviewed before

      Then I see the following cards for review on "2022-01-03":
        | Verse  | Type           |
        | BG 1.1 | Number -> Text |
        | BG 1.2 | Number -> Text |



  Rule: User can mark cards as reviewd in thr Review deck
    I, as a user, want to view my cards in the review deck. I want to rate a
    card according to how easy or difficult it was for me to remember it. If I
    remembered the card easily, it will be shown later. If I marked a card as
    heavy, it will be shown earlier.

    Background:

      Given Review deck has the following cards:
        | Verse  | Type           | Due To     |
        | BG 1.1 | Number -> Text | 2022-01-02 |
        | BG 1.2 | Number -> Text | 2022-01-02 |
        | BG 1.3 | Number -> Text | 2022-01-03 |


    Scenario: User marks card as reviewd in the Review deck
      I, as a user, mark a card as reviewed, and it is removed from the Review
      deck.

      When I review card "BG 1.1" "Number -> Text" with mark "Easy"
      Then I see the following cards for review on "2022-01-02":
        | Verse  | Type           |
        | BG 1.2 | Number -> Text |
      And I see the following cards for review on "2022-01-03":
        | Verse  | Type           |
        | BG 1.1 | Number -> Text |
        | BG 1.2 | Number -> Text |
        | BG 1.3 | Number -> Text |
