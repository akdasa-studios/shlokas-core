Feature: Library / Search

  I, as a user, want to find a verse to memorize it. I want yo be able to
  search it by text, translation or verse number or its part.

  Background: Library
    Given Verse library contains the following verses:
      | Verse Number | Text                         | Translation              |
      | BG 1.1       | dharma-ksetre kuru-ksetre    | O Sanjaya, after my sons |
      | BG 1.2       | drstva tu pandavanikam       | King, after looking ...  |
      | SB 1.1.1     | om namo bhagavate vasudevaya | O my Lord, Sri Krisna .. |

  Rule: User can find verses by its content

    Scenario: User searches for a verse by its text

      When I search for verse in the library by "drstva"
      Then I should see the following verses in the library:
        | Verse Number | Text                   | Translation             |
        | BG 1.2       | drstva tu pandavanikam | King, after looking ... |

    Scenario: User searches for a verse by its translation
      When I search for verse in the library by "King"
      Then I should see the following verses in the library:
        | Verse Number | Text                   | Translation             |
        | BG 1.2       | drstva tu pandavanikam | King, after looking ... |


  Rule: User can find verses by its verse number or its part

    Scenario: User searches for a verse by its verse number
      When I search for verse in the library by "BG 1."
      Then I should see the following verses in the library:
        | Verse Number | Text                      | Translation              |
        | BG 1.1       | dharma-ksetre kuru-ksetre | O Sanjaya, after my sons |
        | BG 1.2       | drstva tu pandavanikam    | King, after looking ...  |

    Scenario: User searches for a verse by part of a number
      When I search for verse in the library by "1.1"
      Then I should see the following verses in the library:
        | Verse Number | Text                         | Translation              |
        | BG 1.1       | dharma-ksetre kuru-ksetre    | O Sanjaya, after my sons |
        | SB 1.1.1     | om namo bhagavate vasudevaya | O my Lord, Sri Krisna .. |