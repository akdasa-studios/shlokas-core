import { AddVerseToInboxDeck, RemoveVerseFromInboxDeck, UpdateVerseStatus } from '@lib/commands'
import { InboxCardBuilder, InboxCardType, Text, Translation, VerseBuilder, VerseNumber } from '@lib/models'
import { StepDefinitions } from 'jest-cucumber'

import { context } from '@tests/features/context'
import { Transaction } from '@akdasa-studios/framework'


export const inboxDeckSteps: StepDefinitions = ({ given, when, then }) => {

  function getVerse(verseNumberStr: string) {
    const verse = context.app.library.getByNumber(verseNumberStr)
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
      const verse = new VerseBuilder()
        .withNumber(new VerseNumber(verseListLine['Verse Number']))
        .withText(new Text([verseListLine['Text']]))
        .withTranslation(new Translation(verseListLine['Translation']))
        .ofLanguage(context.app.settings.language)
        .build()
      context.app.library.addVerse(verse.value)
    }
  })

  /* -------------------------------------------------------------------------- */
  /*                                    When                                    */
  /* -------------------------------------------------------------------------- */

  when(/^I add a verse "(.*)" to the Inbox deck$/, (verseNumberString: string) => {
    const verse = getVerse(verseNumberString)
    const transaction = new Transaction('id')
    context.app.processor.execute(new AddVerseToInboxDeck(verse.id), transaction)
    context.app.processor.execute(new UpdateVerseStatus(verse.id), transaction)
  })

  when('I revert the last action', () => {
    context.app.processor.revert()
  })

  when(/^I remove verse "(.*)" from the Inbox deck$/, (verseNumberString: string) => {
    const verse = getVerse(verseNumberString)
    const transaction = new Transaction('id')
    context.app.processor.execute(new RemoveVerseFromInboxDeck(verse.id), transaction)
    context.app.processor.execute(new UpdateVerseStatus(verse.id), transaction)
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
