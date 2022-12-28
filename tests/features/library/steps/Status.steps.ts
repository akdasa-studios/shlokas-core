import { StepDefinitions } from 'jest-cucumber'

import { context } from '@tests/features/context'


export const libraryStatusSteps: StepDefinitions = ({ when }) => {

  /* -------------------------------------------------------------------------- */
  /*                                    Then                                    */
  /* -------------------------------------------------------------------------- */

  when(/^Status of the verse "(.*)" is "(.*)"$/, async (verseNumber: string, status: string) => {
    const verse = await context.app.library.getByNumber(context.app.settings.language, verseNumber)
    const verseStatus = await context.app.library.getStatus(verse.value.id)
    expect(verseStatus.value.inDeck).toEqual(status)
  })

}
