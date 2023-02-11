import { contexts } from '@tests/features/context'
import { StepDefinitions } from 'jest-cucumber'


export const libraryStatusSteps: StepDefinitions = ({ when }) => {

  /* -------------------------------------------------------------------------- */
  /*                                    Then                                    */
  /* -------------------------------------------------------------------------- */

  when(/^Status of the verse "(.*)" is "(.*)"$/, async (verseNumber: string, status: string) => {
    const verse = await contexts.$.library.getByNumber(contexts.$.settings.language, verseNumber)
    const verseStatus = await contexts.$.library.getStatus(verse.value.id)
    expect(verseStatus.inDeck).toEqual(status)
  })

}
