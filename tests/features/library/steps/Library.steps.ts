import { Text, Translation, VerseBuilder, VerseId, VerseNumber } from '@lib/models'
import { StepDefinitions } from 'jest-cucumber'
import { contexts } from '@tests/features/context'
import * as getUuid from 'uuid-by-string'


export const librarySteps: StepDefinitions = ({ given }) => {

  /* -------------------------------------------------------------------------- */
  /*                                   Given                                    */
  /* -------------------------------------------------------------------------- */

  given(/^Verse library contains the following verses(?: on "?(all devices|\w+)"?)?:$/, async (device: string, versesList) => {
    const devicesToAdd: Set<string> = new Set(['default'])
    if (device === 'all devices') {
      contexts.allContextNames.forEach(x => devicesToAdd.add(x))
    } else {
      devicesToAdd.add(device)
    }

    for (const verseListLine of versesList) {
      const verse = new VerseBuilder()
        .withId(new VerseId(getUuid(verseListLine['Verse Number'])))
        .withNumber(new VerseNumber(verseListLine['Verse Number']))
        .withText(new Text([verseListLine['Text']]))
        .withTranslation(new Translation(verseListLine['Translation']))
        .ofLanguage(contexts.$.settings.language)
        .build()

      for (const device of devicesToAdd) {
        await contexts.getContext(device).library.addVerse(verse.value)
        // await contexts.$.library.addVerse(verse.value)
      }
    }
  })

}
