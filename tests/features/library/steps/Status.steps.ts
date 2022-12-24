import { StepDefinitions } from 'jest-cucumber'

import { context } from '@tests/features/context'


export const libraryStatusSteps: StepDefinitions = ({ when }) => {

  /* -------------------------------------------------------------------------- */
  /*                                    Then                                    */
  /* -------------------------------------------------------------------------- */

  when(/^Status of the verse "(.*)" is "(.*)"$/, (verseNumber: string, status: string) => {
    const verse = context.app.library.getByNumber(context.app.settings.language, verseNumber)
    const verseStatus = context.app.library.getStatus(verse.value.id)
    expect(verseStatus.value.inDeck).toEqual(status)
  })

}
