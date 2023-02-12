import { Transaction } from '@akdasa-studios/framework'
import { AddVerseToInboxDeck, InboxCardMemorized, RemoveVerseFromInboxDeck, UpdateVerseStatus } from '@lib/commands'
import { InboxCardBuilder, InboxCardQueries, InboxCardType } from '@lib/models'
import { getContext } from '@tests/features/context'
import { StepDefinitions } from 'jest-cucumber'


export const inboxDeckSteps: StepDefinitions = ({ given, when, then }) => {
  const { ofVerse, ofType } = InboxCardQueries

  /**
   * Add a card to the Inbox deck
   * @param device Device name (optional)
   * @param cards List of cards to add
   * @example Inbox deck has the following cards:
   *           | Verse Number | Card Type |
   *           | BG 1.1       | Review    |
   *           | BG 1.2       | Review    |
   * @example Inbox deck has the following cards on "device1":
   *           | Verse Number | Card Type |
   *           | BG 1.1       | Review    |
   *           | BG 1.2       | Review    |
   */
  given(
    /^Inbox deck has the following cards(?: on "(.*)")?:$/,
    async (device, cards) =>
    {
      const ctx = getContext(device)

      for (const line of cards) {
        const verse = await ctx.findVerse(line['Verse Number'])
        const card  = new InboxCardBuilder()
          .ofType(InboxCardType[line['Card Type']])
          .ofVerse(verse.id)
          .build()
        await ctx.inboxDeck.addCard(card)
        await ctx.app.processor.execute(new UpdateVerseStatus(verse.id))
      }
    })


  /**
   * Add a verse to the Inbox deck
   * @param verseNumber Verse number
   * @param device Device name (optional)
   * @exmaple I add a verse "BG 1.1" to the Inbox deck
   * @exmaple I add a verse "BG 1.1" to the Inbox deck on "device1"
   */
  when(
    /^I add a verse "(.*)" to the Inbox deck(?: on "(.*)")?$/,
    async (verseNumber: string, device: string) =>
    {
      const ctx         = getContext(device)
      const verse       = await ctx.findVerse(verseNumber)
      const transaction = new Transaction()
      await ctx.processor.execute(new AddVerseToInboxDeck(verse.id), transaction)
      await ctx.processor.execute(new UpdateVerseStatus(verse.id), transaction)
    })


  /**
   * Remove a verse from the Inbox deck
   * @param verseNumber Verse number
   * @example I remove verse "BG 1.1" from the Inbox deck
   */
  when(
    /^I remove verse "(.*)" from the Inbox deck$/,
    async (verseNumber: string) =>
    {
      const ctx         = getContext()
      const verse       = await ctx.findVerse(verseNumber)

      const transaction = new Transaction()
      await ctx.processor.execute(new RemoveVerseFromInboxDeck(verse.id), transaction)
      await ctx.processor.execute(new UpdateVerseStatus(verse.id), transaction)
    })


  /**
   * Mark a card as memorized
   * @param verseNumber Verse number
   * @param cardType Card type
   * @example I mark the "BG 1.1" card of the "Review" type as memorized
   */
  when(
    /^I mark the "(.*)" card of the "(.*)" type as memorized$/,
    async (verseNumber: string, cardType: string) => {
      const ctx   = getContext()
      const verse = await ctx.findVerse(verseNumber)
      const cards = await ctx.inboxDeck.findCards(ofVerse(verse.id), ofType(InboxCardType[cardType]))

      const transaction = new Transaction()
      await ctx.processor.execute(new InboxCardMemorized(cards[0]), transaction)
      await ctx.processor.execute(new UpdateVerseStatus(cards[0].verseId), transaction)
    })


  /**
   * Check if the Inbox deck contains given cards
   * @param device Device name (optional)
   * @param cards List of cards to check
   * @example Inbox deck contains the following cards:
   *          | Verse Number | Card Type |
   *          | BG 1.1       | Review    |
   *          | BG 1.2       | Review    |
   * @example Inbox deck contains the following cards on "device1":
   *          | Verse Number | Card Type |
   *          | BG 1.1       | Review    |
   */
  then(
    /^Inbox deck contains the following cards(?: on "(.*)")?:$/,
    async (device, cards) =>
    {
      const ctx       = getContext(device)
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


  /**
   * Check if the Inbox deck is empty
   * @param device Device name (optional)
   * @example Inbox deck contains no cards
   * @example Inbox deck contains no cards on "device1"
   */
  then(
    /^Inbox deck contains no cards(?: on "(.*)")?$/,
    async (device) =>
    {
      const ctx = getContext(device)
      expect(await ctx.inboxDeck.isEmpty()).toBeTruthy()
    })
}
