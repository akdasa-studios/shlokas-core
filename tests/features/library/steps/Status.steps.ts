import { StepDefinitions } from 'jest-cucumber'

import { context } from '@tests/features/context'


export const libraryStatusSteps: StepDefinitions = ({ when }) => {

  /* -------------------------------------------------------------------------- */
  /*                                    Then                                    */
  /* -------------------------------------------------------------------------- */

  when(/^Status of the verse "(.*)" is "(.*)"$/, (verseNumber: string, status: string) => {
    const verseStatus = context.app.library.getStatusByNumber(verseNumber)
    expect(verseStatus.value.inDeck).toEqual(status)
  })

}
