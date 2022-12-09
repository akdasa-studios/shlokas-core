import { AddVerseToInboxDeck, RemoveVerseFromInboxDeck } from '@lib/commands/inbox'
import { InboxCardBuilder, InboxCardType, VerseBuilder, VerseNumberBuilder } from '@lib/models'
import { StepDefinitions } from 'jest-cucumber'

import { context } from '@tests/features/context'


export const inboxDeckSteps: StepDefinitions = ({ given, when, then }) => {

  function getVerse(verseNumber: string) {
    const verse = context.app.versesLibrary.findVerseByNumber(verseNumber)
    if (verse.isFailure) { throw new Error(verse.error) }
    return verse.value
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Given                                    */
  /* -------------------------------------------------------------------------- */

  given('Inbox deck has the following cards:', (cardsList) => {
    for (const cardsListLine of cardsList) {
      const verse = getVerse(cardsListLine['Verse Number'])
      const card = new InboxCardBuilder()
        .ofType(InboxCardType[cardsListLine['Card Type']])
        .ofVerse(verse.id)
        .build()
      context.app.inboxDeck.addCard(card)
    }
  })

  given('Verse library contains the following verses:', (versesList) => {
    for (const verseListLine of versesList) {
      const verseNumber = new VerseNumberBuilder()
        .fromString(verseListLine['Verse Number'])
        .build()
      const verse = new VerseBuilder()
        .withNumber(verseNumber.value)
        .withText(verseListLine['Text'])
        .withTranslation(verseListLine['Translation'])
        .ofLanguage(context.app.settings.language)
        .build()
      context.app.versesLibrary.addVerse(verse.value)
    }
  })

  /* -------------------------------------------------------------------------- */
  /*                                    When                                    */
  /* -------------------------------------------------------------------------- */

  when(/^I add a verse "(.*)" to the Inbox deck$/, (verseNumberString: string) => {
    const verse = getVerse(verseNumberString)
    const command = new AddVerseToInboxDeck(verse.id)
    context.app.processor.execute(command)
  })

  when('I revert the last action', () => {
    context.app.processor.revert()
  })

  when(/^I remove verse "(.*)" from the Inbox deck$/, (verseNumberString: string) => {
    const verse = getVerse(verseNumberString)
    const command = new RemoveVerseFromInboxDeck(verse.id)
    context.app.processor.execute(command)
  })

  /* -------------------------------------------------------------------------- */
  /*                                    Then                                    */
  /* -------------------------------------------------------------------------- */

  then('Inbox deck contains the following cards:', (cards) => {
    for (const card of cards) {
      const verse = getVerse(card['Verse Number'])
      const f = context.app.inboxDeck.getVerseCards(
        verse.id, InboxCardType[card['Card Type']]
      )
      expect(f).toHaveLength(1)
    }
  })

  then('Inbox deck contains no cards', () => {
    expect(context.app.inboxDeck.isEmpty).toBeTruthy()
  })
}
