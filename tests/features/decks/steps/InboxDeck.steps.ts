import { StepDefinitions } from 'jest-cucumber'
import { context } from '@tests/features/context'


export const inboxDeckSteps: StepDefinitions = ({ given, when, then }) => {

  /* -------------------------------------------------------------------------- */
  /*                                   Given                                    */
  /* -------------------------------------------------------------------------- */

  given('Inbox deck is empty', () => {
    console.log('11')
  })

  /* -------------------------------------------------------------------------- */
  /*                                    When                                    */
  /* -------------------------------------------------------------------------- */

  when(/^I add a verse "(.*)" to the Inbox deck$/, (verseNumber: string) => {
    console.log(verseNumber)
  })

  /* -------------------------------------------------------------------------- */
  /*                                    Then                                    */
  /* -------------------------------------------------------------------------- */

  then('The inbox deck contains the following cards:', (cards) => {
    for (const card of cards) {
      console.log(card)
    }
  })
}
