import { Text, Translation, VerseBuilder, VerseNumber } from '@lib/models'
import { StepDefinitions } from 'jest-cucumber'

import { context as $c } from '@tests/features/context'


export const librarySteps: StepDefinitions = ({ given }) => {

  /* -------------------------------------------------------------------------- */
  /*                                   Given                                    */
  /* -------------------------------------------------------------------------- */

  given('Verse library contains the following verses:', async (versesList) => {
    for (const verseListLine of versesList) {
      const verse = new VerseBuilder()
        .withNumber(new VerseNumber(verseListLine['Verse Number']))
        .withText(new Text([verseListLine['Text']]))
        .withTranslation(new Translation(verseListLine['Translation']))
        .ofLanguage($c.settings.language)
        .build()
      await $c.library.addVerse(verse.value)
    }
  })

}
