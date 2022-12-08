import { StepDefinitions } from 'jest-cucumber'
import { AddVerseToInboxDeck } from '@lib/commands/inbox'
import { InboxCardType, VerseBuilder, VerseNumberBuilder } from '@lib/models'

import { context } from '@tests/features/context'


export const inboxDeckSteps: StepDefinitions = ({ given, when, then }) => {

  /* -------------------------------------------------------------------------- */
  /*                                   Given                                    */
  /* -------------------------------------------------------------------------- */

  given('Verse library contains the following verses:', (versesList) => {
    for (const verseListLine of versesList) {
      const verseNumber = new VerseNumberBuilder()
        .fromString(verseListLine['Verse Number'])
        .build()
      const verse = new VerseBuilder()
        .withNumber(verseNumber.value)
        .withText(verseListLine['Text'])
        .withTranslation(verseListLine['Translation'])
        .ofLanguage(context.app.language)
        .build()
      context.app.versesLibrary.addVerse(verse.value)
    }
  })

  /* -------------------------------------------------------------------------- */
  /*                                    When                                    */
  /* -------------------------------------------------------------------------- */

  when(/^I add a verse "(.*)" to the Inbox deck$/, (verseNumberString: string) => {
    const verse = context.app.versesLibrary.findVerseByNumber(verseNumberString)
    if (verse.isFailure) { throw new Error(verse.error) }

    const command = new AddVerseToInboxDeck(verse.value.id)
    context.app.processor.execute(command)
  })

  when('I revert the last action', () => {
    context.app.processor.revert()
  })

  /* -------------------------------------------------------------------------- */
  /*                                    Then                                    */
  /* -------------------------------------------------------------------------- */

  then('Inbox deck contains the following cards:', (cards) => {
    for (const card of cards) {
      const verse = context.app.versesLibrary.findVerseByNumber(card['Verse Number'])
      if (verse.isFailure) { throw new Error(verse.error) }

      const f = context.app.inboxDeck.getCards(
        verse.value.id, InboxCardType[card['Card Type']]
      )

      expect(f).toHaveLength(1)
    }
  })

  then('Inbox deck contains no cards', () => {
    expect(context.app.inboxDeck.isEmpty).toBeTruthy()
  })
}
