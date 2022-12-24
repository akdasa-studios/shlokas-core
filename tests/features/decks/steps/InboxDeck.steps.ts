import { AddVerseToInboxDeck, InboxCardMemorized, RemoveVerseFromInboxDeck, UpdateVerseStatus } from '@lib/commands'
import { InboxCardBuilder, InboxCardType } from '@lib/models'
import { StepDefinitions } from 'jest-cucumber'

import { Transaction } from '@akdasa-studios/framework'
import { context } from '@tests/features/context'


export const inboxDeckSteps: StepDefinitions = ({ given, when, then }) => {

  /* -------------------------------------------------------------------------- */
  /*                                   Given                                    */
  /* -------------------------------------------------------------------------- */

  given('Inbox deck has the following cards:', (cardsList) => {
    for (const cardsListLine of cardsList) {
      const verse = context.findVerse(cardsListLine['Verse Number'])
      const card = new InboxCardBuilder()
        .ofType(InboxCardType[cardsListLine['Card Type']])
        .ofVerse(verse.id)
        .build()
      context.app.inboxDeck.addCard(card)
    }
  })

  /* -------------------------------------------------------------------------- */
  /*                                    When                                    */
  /* -------------------------------------------------------------------------- */

  when(/^I add a verse "(.*)" to the Inbox deck$/, (verseNumber: string) => {
    const verse = context.findVerse(verseNumber)
    const transaction = new Transaction('id')
    context.app.processor.execute(new AddVerseToInboxDeck(verse.id), transaction)
    context.app.processor.execute(new UpdateVerseStatus(verse.id), transaction)
  })

  when(/^I remove verse "(.*)" from the Inbox deck$/, (verseNumber: string) => {
    const verse = context.findVerse(verseNumber)
    const transaction = new Transaction('id')
    context.app.processor.execute(new RemoveVerseFromInboxDeck(verse.id), transaction)
    context.app.processor.execute(new UpdateVerseStatus(verse.id), transaction)
  })

  when(/^I mark the "(.*)" card of the "(.*)" type as memorized$/, (verseNumber: string, cardType: string) => {
    const verse = context.findVerse(verseNumber)
    const cards = context.app.inboxDeck.getVerseCards(verse.id, InboxCardType[cardType])
    context.app.processor.execute(new InboxCardMemorized(cards[0]))
  })


  /* -------------------------------------------------------------------------- */
  /*                                    Then                                    */
  /* -------------------------------------------------------------------------- */

  then('Inbox deck contains the following cards:', (cards) => {
    expect(context.app.inboxDeck.cards.length).toEqual(cards.length)

    for (const card of cards) {
      const verse = context.findVerse(card['Verse Number'])
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
