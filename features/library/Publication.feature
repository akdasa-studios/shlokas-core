Feature: Library / Publishing

  I, as an administrator, want to be able to add verses that might be
  unavailable in the library for users for some time until I publish them. I
  might need time to work on a verse, and I don't want users to see it until I
  finish my work.

  Background: Library with unpublished verse
    Given Verse library contains the following verses:
      | Verse Number | Text                      | Published At |
      | BG 1.1       | dharma-ksetre kuru-ksetre |              |
      | BG 1.2       | drstva tu pandavanikam    | 2023-01-01   |


  Rule: User can't find verses if they are not published

    Scenario: User searches for a verse by its text

      I, as a user, can't see unpublished verses in the library. I can only see
      the published ones.

      When I search for verse in the library by "BG"
      Then I should see the following verses in the library:
        | Verse Number | Text                   | Published At |
        | BG 1.2       | drstva tu pandavanikam | 2023-01-01   |


    Scenario: Administrator publishes a verse

      When I publish verse "BG 1.1"
      When I search for verse in the library by "BG"
      Then I should see the following verses in the library:
        | Verse Number | Text                      | Published At |
        | BG 1.1       | dharma-ksetre kuru-ksetre | 2023-01-01   |
        | BG 1.2       | drstva tu pandavanikam    | 2023-01-01   |

    Scenario: Administrator unpublishes a verse

      When I publish verse "BG 1.1"
      When I unpublish verse "BG 1.1"
      When I search for verse in the library by "BG"
      Then I should see the following verses in the library:
        | Verse Number | Text                   | Published At |
        | BG 1.2       | drstva tu pandavanikam | 2023-01-01   |
