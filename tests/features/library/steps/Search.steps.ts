import { StepDefinitions } from 'jest-cucumber'

import { context } from '@tests/features/context'
import { Verse } from '@lib/models'


export const librarySearchSteps: StepDefinitions = ({ when, then }) => {

  let lastSearch: readonly Verse[] = []

  /* -------------------------------------------------------------------------- */
  /*                                    When                                    */
  /* -------------------------------------------------------------------------- */

  when(/^I search for verse in the library by "(.*)"$/, (queryString: string) => {
    lastSearch = context.app.versesLibrary.finqByString(queryString)
  })

  /* -------------------------------------------------------------------------- */
  /*                                    Then                                    */
  /* -------------------------------------------------------------------------- */

  then('I should see the following verses in the library:', (versesTable) => {
    for (const verseLine of versesTable) {
      const verseAppearedInSearch = lastSearch.filter(
        (verse: Verse) => verse.number.value === verseLine['Verse Number']
      ).length === 1
      expect(verseAppearedInSearch).toBe(true)
    }
  })
}
