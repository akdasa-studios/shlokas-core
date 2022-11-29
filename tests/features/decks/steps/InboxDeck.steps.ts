import { StepDefinitions } from 'jest-cucumber'
import { AddVerseToInboxDeck } from '@lib/commands/inbox'
import { VerseNumberBuilder } from '@lib/models'

import { context } from '@tests/features/context'


export const inboxDeckSteps: StepDefinitions = ({ given, when, then }) => {

  /* -------------------------------------------------------------------------- */
  /*                                   Given                                    */
  /* -------------------------------------------------------------------------- */

  given('Empty Inbox deck', () => {
    console.log('11')
  })

  /* -------------------------------------------------------------------------- */
  /*                                    When                                    */
  /* -------------------------------------------------------------------------- */

  when(/^I add a verse "(.*)" to the Inbox deck$/, (verseNumberString: string) => {


    const command = new AddVerseToInboxDeck(verseNumber.value)
  })

  when('I revert the last action', () => {
  })

  /* -------------------------------------------------------------------------- */
  /*                                    Then                                    */
  /* -------------------------------------------------------------------------- */

  then('Inbox deck contains the following cards:', (cards) => {
    for (const card of cards) {
      console.log(card)
    }
  })

  then('Inbox deck contains no cards', () => {
  })
}
