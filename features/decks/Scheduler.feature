Feature: Decks / Scheduler

  Background:
    Given Now is "2020-01-01"

  Rule: New cards

    I, as a user, want the grades of the card to affect the time of the
    following review. If I forget a card, the app should start it over.

    Scenario Outline: New card added in the Review deck

      And The new card was added to the Review deck
      When I review it with garde "<Grade>"
      Then Card stats are the following:
        | Name     | Value      |
        | Due To   | <Due To>   |
        | Interval | <Interval> |

      Examples:
        | Grade  | Due To     | Interval |
        | Forgot | 2020-01-01 | 0        |
        | Hard   | 2020-01-01 | 0        |
        | Good   | 2020-01-02 | 1440     |
        | Easy   | 2020-01-03 | 2880     |


  Rule: Second review uses ease to calculate next review date

    Scenario Outline: Review card for the second time

      Given Now is "2020-01-01"
      And The new card was added to the Review deck
      When I review it with garde "<Grade 1>"
      And Now is "2020-01-02"
      When I review it with garde "<Grade 2>"
      Then Card stats are the following:
        | Name     | Value      |
        | Due To   | <Due To>   |
        | Interval | <Interval> |

      Examples:
        | Grade 1 | Grade 2 | Due To     | Interval |
        | Good    | Forgot  | 2020-01-02 | 0        |
        | Good    | Hard    | 2020-01-03 | 2520     |
        | Good    | Good    | 2020-01-04 | 3600     |
        | Good    | Easy    | 2020-01-05 | 4680     |


  Rule: "Again" garde decreases card difficulty

    Scenario: "Again" grade decreases card difficulty

      Given The new card was added to the Review deck
      When I review it with garde "Forgot"
      Then Card stats are the following:
        | Name   | Value      |
        | Lapses | 1          |
        | Ease   | 230        |
        | Due To | 2020-01-01 |


    Scenario: "Again" grade decreases card difficulty only once a day

      Given The new card was added to the Review deck
      When I review it with garde "Forgot"
      Then Card stats are the following:
        | Name   | Value      |
        | Lapses | 1          |
        | Ease   | 230        |
        | Due To | 2020-01-01 |
      When I review it with garde "Forgot"
      Then Card stats are the following:
        | Name   | Value      |
        | Lapses | 1          |
        | Ease   | 230        |
        | Due To | 2020-01-01 |


    Scenario: "Again" grade decreases card difficulty on the other day

      Given The new card was added to the Review deck
      When I review it with garde "Forgot"
      Then Card stats are the following:
        | Name   | Value      |
        | Lapses | 1          |
        | Ease   | 230        |
        | Due To | 2020-01-01 |
      When Now is "2020-01-02"
      When I review it with garde "Forgot"
      Then Card stats are the following:
        | Name   | Value      |
        | Lapses | 2          |
        | Ease   | 210        |
        | Due To | 2020-01-02 |


    Scenario: The minimum ease is 130

      Ease can't be less than 100 because, in this case, it will decrease the
      interval even for "good" or "easy" grades.

      Given The new card was added to the Review deck
      Then My review table is as follows:
        | Date       | Grade  | Lapses | Ease | Due To     |
        | 2020-01-01 | Forgot | 1      | 230  | 2020-01-01 |
        | 2020-01-02 | Forgot | 2      | 210  | 2020-01-02 |
        | 2020-01-03 | Forgot | 3      | 190  | 2020-01-03 |
        | 2020-01-04 | Forgot | 4      | 170  | 2020-01-04 |
        | 2020-01-05 | Forgot | 5      | 150  | 2020-01-05 |
        | 2020-01-06 | Forgot | 6      | 130  | 2020-01-06 |
        | 2020-01-07 | Forgot | 7      | 130  | 2020-01-07 |
        | 2020-01-08 | Forgot | 8      | 130  | 2020-01-08 |
