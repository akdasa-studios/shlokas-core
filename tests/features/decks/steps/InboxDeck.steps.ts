import { AddVerseToInboxDeck, InboxCardMemorized, RemoveVerseFromInboxDeck, UpdateVerseStatus } from '@lib/commands'
import { InboxCardBuilder, InboxCardType } from '@lib/models'
import { StepDefinitions } from 'jest-cucumber'

import { Transaction } from '@akdasa-studios/framework'
import { context } from '@tests/features/context'


export const inboxDeckSteps: StepDefinitions = ({ given, when, then }) => {

  /* -------------------------------------------------------------------------- */
  /*                                   Given                                    */
  /* -------------------------------------------------------------------------- */

  given('Inbox deck has the following cards:', async (cardsList) => {
    for (const cardsListLine of cardsList) {
      const verse = await context.findVerse(cardsListLine['Verse Number'])
      const card = new InboxCardBuilder()
        .ofType(InboxCardType[cardsListLine['Card Type']])
        .ofVerse(verse.id)
        .build()
      await context.app.inboxDeck.addCard(card)
    }
  })

  /* -------------------------------------------------------------------------- */
  /*                                    When                                    */
  /* -------------------------------------------------------------------------- */

  when(/^I add a verse "(.*)" to the Inbox deck$/, async (verseNumber: string) => {
    const verse = await context.findVerse(verseNumber)
    const transaction = new Transaction()
    await context.app.processor.execute(new AddVerseToInboxDeck(verse.id), transaction)
    await context.app.processor.execute(new UpdateVerseStatus(verse.id), transaction)
  })

  when(/^I remove verse "(.*)" from the Inbox deck$/, async (verseNumber: string) => {
    const verse = await context.findVerse(verseNumber)
    const transaction = new Transaction()
    await context.app.processor.execute(new RemoveVerseFromInboxDeck(verse.id), transaction)
    await context.app.processor.execute(new UpdateVerseStatus(verse.id), transaction)
  })

  when(/^I mark the "(.*)" card of the "(.*)" type as memorized$/, async (verseNumber: string, cardType: string) => {
    const verse = await context.findVerse(verseNumber)
    const cards = await context.app.inboxDeck.getVerseCards(verse.id, InboxCardType[cardType])
    await context.app.processor.execute(new InboxCardMemorized(cards[0]))
  })


  /* -------------------------------------------------------------------------- */
  /*                                    Then                                    */
  /* -------------------------------------------------------------------------- */

  then('Inbox deck contains the following cards:', async (cards) => {
    expect((await context.app.inboxDeck.cards()).length).toEqual(cards.length)

    for (const card of cards) {
      const verse = await context.findVerse(card['Verse Number'])
      const f = await context.app.inboxDeck.getVerseCards(
        verse.id, InboxCardType[card['Card Type']]
      )
      expect(f).toHaveLength(1)
    }
  })

  then('Inbox deck contains no cards', async () => {
    expect(await context.app.inboxDeck.isEmpty()).toBeTruthy()
  })
}
