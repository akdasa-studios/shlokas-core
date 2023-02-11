import { AddVerseToInboxDeck, InboxCardMemorized, RemoveVerseFromInboxDeck, UpdateVerseStatus } from '@lib/commands'
import { InboxCardBuilder, InboxCardQueries, InboxCardType } from '@lib/models'
import { StepDefinitions } from 'jest-cucumber'
import { Transaction } from '@akdasa-studios/framework'
import { contexts } from '@tests/features/context'


export const inboxDeckSteps: StepDefinitions = ({ given, when, then }) => {
  const { ofVerse, ofType } = InboxCardQueries
  async function findVerse(verseNumber: string) {
    const verse = await contexts.$.library.getByNumber(
      contexts.$.settings.language, verseNumber
    )
    if (verse.isFailure) { throw new Error(verse.error) }
    return verse.value
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Given                                    */
  /* -------------------------------------------------------------------------- */

  given(/^Inbox deck has the following cards(?: on "(.*)")?:$/, async (device, cardsList) => {
    const ctx = contexts.getContext(device || 'default')
    for (const line of cardsList) {
      const verse = await ctx.findVerse(line['Verse Number'])
      const card = new InboxCardBuilder()
        .ofType(InboxCardType[line['Card Type']])
        .ofVerse(verse.id)
        .build()
      await ctx.inboxDeck.addCard(card)
    }
  })

  /* -------------------------------------------------------------------------- */
  /*                                    When                                    */
  /* -------------------------------------------------------------------------- */

  when(/^I add a verse "(.*)" to the Inbox deck(?: on "(.*)")?$/, async (verseNumber: string, device: string) => {
    const ctx   = contexts.getContext(device || 'default')
    const verse = await ctx.findVerse(verseNumber)
    const transaction = new Transaction()
    await ctx.processor.execute(new AddVerseToInboxDeck(verse.id), transaction)
    await ctx.processor.execute(new UpdateVerseStatus(verse.id), transaction)
  })

  when(/^I remove verse "(.*)" from the Inbox deck$/, async (verseNumber: string) => {
    const verse = await findVerse(verseNumber)
    const transaction = new Transaction()
    await contexts.$.processor.execute(new RemoveVerseFromInboxDeck(verse.id), transaction)
    await contexts.$.processor.execute(new UpdateVerseStatus(verse.id), transaction)
  })

  when(/^I mark the "(.*)" card of the "(.*)" type as memorized$/, async (verseNumber: string, cardType: string) => {
    const verse = await findVerse(verseNumber)
    const cards = await contexts.$.inboxDeck.findCards(ofVerse(verse.id), ofType(InboxCardType[cardType]))

    const transaction = new Transaction()
    await contexts.$.processor.execute(new InboxCardMemorized(cards[0]), transaction)
    await contexts.$.processor.execute(new UpdateVerseStatus(cards[0].verseId), transaction)
  })


  /* -------------------------------------------------------------------------- */
  /*                                    Then                                    */
  /* -------------------------------------------------------------------------- */

  then(/^Inbox deck contains the following cards(?: on "(.*)")?:$/, async (device, cards) => {
    const ctx = contexts.getContext(device || 'default')
    const deckCards = await ctx.inboxDeck.cards()
    expect(deckCards.length).toEqual(cards.length)

    for (const card of cards) {
      const verse = await ctx.findVerse(card['Verse Number'])
      const f = await ctx.inboxDeck.findCards(
        ofVerse(verse.id), ofType(InboxCardType[card['Card Type']])
      )
      expect(f).toHaveLength(1)
    }
  })

  then(/^Inbox deck contains no cards(?: on "(.*)")?$/, async (device) => {
    const ctx = contexts.getContext(device || 'default')
    expect(await ctx.inboxDeck.isEmpty()).toBeTruthy()
  })
}
