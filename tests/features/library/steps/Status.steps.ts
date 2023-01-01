import { StepDefinitions } from 'jest-cucumber'

import { context as $c } from '@tests/features/context'


export const libraryStatusSteps: StepDefinitions = ({ when }) => {

  /* -------------------------------------------------------------------------- */
  /*                                    Then                                    */
  /* -------------------------------------------------------------------------- */

  when(/^Status of the verse "(.*)" is "(.*)"$/, async (verseNumber: string, status: string) => {
    const verse = await $c.library.getByNumber($c.settings.language, verseNumber)
    const verseStatus = await $c.library.getStatus(verse.value.id)
    expect(verseStatus.value.inDeck).toEqual(status)
  })

}
