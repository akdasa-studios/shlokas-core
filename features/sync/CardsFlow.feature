Feature: Sync / Cards Flow

  I, as a user, want to be able to sync progress between devices, so that
  I can continue my learning on any device.

  Background: I have svereal devices
    Given I have the following devices:
      | Device Name |
      | iPhone      |
      | iPad        |
    Given Verse library contains the following verses on all devices:
      | Verse Number | Text                         | Translation              |
      | BG 1.1       | dharma-ksetre kuru-ksetre    | O Sanjaya, after my sons |
      | BG 1.2       | drstva tu pandavanikam       | King, after looking ...  |
      | SB 1.1.1     | om namo bhagavate vasudevaya | O my Lord, Sri Krisna .. |

  Scenario: Inbox is empty on another device until I sync
    I, as a user, want to be able to sync my inbox cards from one device to
    another. But the inbox stays empty until I sync.

    And Inbox deck has the following cards on "iPhone":
      | Verse Number | Card Type   |
      | BG 1.1       | Translation |
      | BG 1.1       | Text        |
    Then Inbox deck contains no cards on "iPad"


  Scenario: I sync inbox cards to another device
    After I sync, the inbox is populated with the cards I had on the other
    device. I can then review them on the new device.

    Given Inbox deck has the following cards on "iPhone":
      | Verse Number | Card Type   |
      | BG 1.1       | Translation |
      | BG 1.1       | Text        |
    When I sync data between "iPhone" and "iPad"
    Then Inbox deck contains the following cards on "iPad":
      | Verse Number | Card Type   |
      | BG 1.1       | Translation |
      | BG 1.1       | Text        |
    And Status of the verse "BG 1.1" is "Inbox" on "iPad"


  Scenario: I sync inbox cards from both devices
    If both devices have cards in the inbox, I want to be able to sync them.
    The inbox on both devices should be populated with the cards from the other
    device

    Given Inbox deck has the following cards on "iPhone":
      | Verse Number | Card Type   |
      | BG 1.1       | Translation |
    And Inbox deck has the following cards on "iPad":
      | Verse Number | Card Type |
      | BG 1.2       | Text      |
    When I sync data between "iPhone" and "iPad"
    Then Inbox deck contains the following cards on "iPhone":
      | Verse Number | Card Type   |
      | BG 1.1       | Translation |
      | BG 1.2       | Text        |
    And Inbox deck contains the following cards on "iPad":
      | Verse Number | Card Type   |
      | BG 1.1       | Translation |
      | BG 1.2       | Text        |
    And Status of the verse "BG 1.1" is "Inbox" on "iPad"
    And Status of the verse "BG 1.2" is "Inbox" on "iPhone"


  Scenario: I add new card to Inbox and sync

    Given Inbox deck has the following cards on "iPhone":
      | Verse Number | Card Type   |
      | BG 1.1       | Translation |
    And I sync data between "iPhone" and "iPad"
    And I add a verse "SB 1.1.1" to the Inbox deck on "iPhone"
    And I sync data between "iPhone" and "iPad"
    Then Inbox deck contains the following cards on "iPad":
      | Verse Number | Card Type   |
      | BG 1.1       | Translation |
      | SB 1.1.1     | Translation |
      | SB 1.1.1     | Text        |
    And Status of the verse "SB 1.1.1" is "Inbox" on "iPad"


  Scenario: I sync simillar cards
    If I have simillar cards on both devices, they should not be duplicated
    after syncing.

    Given Inbox deck has the following cards on "iPhone":
      | Verse Number | Card Type   |
      | BG 1.1       | Translation |
    And Inbox deck has the following cards on "iPad":
      | Verse Number | Card Type   |
      | BG 1.1       | Translation |
    And I sync data between "iPhone" and "iPad"
    Then Inbox deck contains the following cards on "iPad":
      | Verse Number | Card Type   |
      | BG 1.1       | Translation |
    And Inbox deck contains the following cards on "iPhone":
      | Verse Number | Card Type   |
      | BG 1.1       | Translation |
    And Status of the verse "BG 1.1" is "Inbox" on "iPad"
    And Status of the verse "BG 1.1" is "Inbox" on "iPhone"
