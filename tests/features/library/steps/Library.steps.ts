import { Text, Translation, Verse, VerseId, VerseNumber } from '@lib/models'
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
      const verse = new Verse(
        new VerseId(getUuid(verseListLine['Verse Number'])),
        new VerseNumber(verseListLine['Verse Number']),
        verseListLine['Verse Number'],
        contexts.$.settings.language,
        new Text([verseListLine['Text']]),
        new Translation(verseListLine['Translation']),
        []
      )

      for (const device of devicesToAdd) {
        await contexts.getContext(device).library.addVerse(verse)
      }
    }
  })

}
