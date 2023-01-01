import { AddVerseToInboxDeck, InboxCardMemorized, RemoveVerseFromInboxDeck, UpdateVerseStatus } from '@lib/commands'
import { InboxCardBuilder, InboxCardQueries, InboxCardType } from '@lib/models'
import { StepDefinitions } from 'jest-cucumber'
import { Transaction } from '@akdasa-studios/framework'
import { context as $c } from '@tests/features/context'


export const inboxDeckSteps: StepDefinitions = ({ given, when, then }) => {
  const { ofVerse, ofType } = InboxCardQueries
  async function findVerse(verseNumber: string) {
    const verse = await $c.library.getByNumber(
      $c.settings.language, verseNumber
    )
    return verse.value
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Given                                    */
  /* -------------------------------------------------------------------------- */

  given('Inbox deck has the following cards:', async (cardsList) => {
    for (const line of cardsList) {
      const verse = await findVerse(line['Verse Number'])
      const card = new InboxCardBuilder()
        .ofType(InboxCardType[line['Card Type']])
        .ofVerse(verse.id)
        .build()
      await $c.inboxDeck.addCard(card)
    }
  })

  /* -------------------------------------------------------------------------- */
  /*                                    When                                    */
  /* -------------------------------------------------------------------------- */

  when(/^I add a verse "(.*)" to the Inbox deck$/, async (verseNumber: string) => {
    const verse = await findVerse(verseNumber)
    const transaction = new Transaction()
    await $c.processor.execute(new AddVerseToInboxDeck(verse.id), transaction)
    await $c.processor.execute(new UpdateVerseStatus(verse.id), transaction)
  })

  when(/^I remove verse "(.*)" from the Inbox deck$/, async (verseNumber: string) => {
    const verse = await findVerse(verseNumber)
    const transaction = new Transaction()
    await $c.processor.execute(new RemoveVerseFromInboxDeck(verse.id), transaction)
    await $c.processor.execute(new UpdateVerseStatus(verse.id), transaction)
  })

  when(/^I mark the "(.*)" card of the "(.*)" type as memorized$/, async (verseNumber: string, cardType: string) => {
    const verse = await findVerse(verseNumber)
    const cards = await $c.inboxDeck.findCards(ofVerse(verse.id), ofType(InboxCardType[cardType]))
    await $c.processor.execute(new InboxCardMemorized(cards[0]))
  })


  /* -------------------------------------------------------------------------- */
  /*                                    Then                                    */
  /* -------------------------------------------------------------------------- */

  then('Inbox deck contains the following cards:', async (cards) => {
    expect((await $c.inboxDeck.cards()).length).toEqual(cards.length)

    for (const card of cards) {
      const verse = await findVerse(card['Verse Number'])
      const f = await $c.inboxDeck.findCards(
        ofVerse(verse.id), ofType(InboxCardType[card['Card Type']])
      )
      expect(f).toHaveLength(1)
    }
  })

  then('Inbox deck contains no cards', async () => {
    expect(await $c.inboxDeck.isEmpty()).toBeTruthy()
  })
}
