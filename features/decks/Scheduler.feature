Feature: Decks / Scheduler

  Rule: New cards
    I, as a user, want the grades of the card to affect the time of the
    following review. If I forget a card, the app should start it over.

    Scenario Outline: New card added in the Review deck

      Given Now is "2020-01-01"
      And The new card was added to the Review deck
      When I review it with garde "<Grade>"
      Then Card due date is "<Due To>"

      Examples:
        | Grade  | Due To     |
        | Forgot | 2020-01-01 |
        | Hard   | 2020-01-01 |
        | Good   | 2020-01-02 |
        | Easy   | 2020-01-03 |

  Rule: Second review

    Scenario Outline: Review card for the second time

      Given Now is "2020-01-01"
      And The new card was added to the Review deck
      When I review it with garde "<Grade 1>"
      And Now is "2020-01-02"
      When I review it with garde "<Grade 2>"
      Then Card due date is "<Due To>"

      Examples:
        | Grade 1 | Grade 2 | Due To     |
        | Good    | Forgot  | 2020-01-02 |
        | Good    | Hard    | 2020-01-03 |
        | Good    | Good    | 2020-01-04 |
        | Good    | Easy    | 2020-01-05 |