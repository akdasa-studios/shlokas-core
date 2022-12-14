import { StepDefinitions } from 'jest-cucumber'

import { Verse } from '@lib/models'
import { context as $c } from '@tests/features/context'


export const librarySearchSteps: StepDefinitions = ({ when, then }) => {

  let lastSearch: readonly Verse[] = []

  /* -------------------------------------------------------------------------- */
  /*                                    When                                    */
  /* -------------------------------------------------------------------------- */

  when(/^I search for verse in the library by "(.*)"$/, async (queryString: string) => {
    lastSearch = await $c.library.findByContent($c.settings.language, queryString)
  })

  /* -------------------------------------------------------------------------- */
  /*                                    Then                                    */
  /* -------------------------------------------------------------------------- */

  then('I should see the following verses in the library:', (versesTable) => {
    expect(lastSearch.length).toBe(versesTable.length)

    for (const verseLine of versesTable) {
      const verseAppearedInSearch = lastSearch.filter(
        (verse: Verse) => verse.number.value === verseLine['Verse Number']
      ).length === 1
      expect(verseAppearedInSearch).toBe(true)
    }
  })
}
