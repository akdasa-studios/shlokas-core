import { InMemoryRepository } from '@akdasa-studios/framework'
import { InboxCard, InboxCardBuilder, InboxCardQueries, InboxCardType, InboxDeck, VerseId } from '@lib/models'
import { ofType } from '@lib/models/cards/queries/InboxCard'


describe('InboxDeck', () => {

  let deck: InboxDeck
  const b = (
    new InboxCardBuilder()
      .ofType(InboxCardType.Text)
  )

  beforeEach(() => {
    deck = new InboxDeck(new InMemoryRepository<InboxCard>())
  })

  /* -------------------------------------------------------------------------- */
  /*                                    cards                                   */
  /* -------------------------------------------------------------------------- */

  describe('.cards', () => {
    it('sorts cards by addedAt', async () => {
      const card1 = b.ofVerse(new VerseId()).addedAt(new Date(2020, 1, 1)).build()
      const card2 = b.ofVerse(new VerseId()).addedAt(new Date(2020, 1, 1, 1, 1, 2)).build()
      const card3 = b.ofVerse(new VerseId()).addedAt(new Date(2020, 1, 1, 1, 1, 3)).build()
      const card4 = b.ofVerse(new VerseId()).addedAt(new Date(2020, 1, 2)).build()
      const card5 = b.ofVerse(new VerseId()).addedAt(new Date(2020, 1, 3)).build()
      await deck.addCard(card3)
      await deck.addCard(card5)
      await deck.addCard(card4)
      await deck.addCard(card2)
      await deck.addCard(card1)
      expect(await deck.cards()).toEqual([card1, card2, card3, card4, card5])
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                   isEmpty                                  */
  /* -------------------------------------------------------------------------- */

  describe('.isEmpty', () => {
    it('returns true if the deck is empty', async () => {
      expect(await deck.isEmpty()).toBe(true)
    })

    it('returns false if the deck is not empty', async () => {
      const card1 = b.addedAt(new Date(2020, 1, 1)).build()
      await deck.addCard(card1)
      expect(await deck.isEmpty()).toBe(false)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                   addCard                                  */
  /* -------------------------------------------------------------------------- */

  describe('.addCard', () => {
    it('adds cards to the deck', async () => {
      const card1 = b.addedAt(new Date(2020, 1, 1)).build()
      await deck.addCard(card1)
      expect(await deck.cards()).toEqual([card1])
    })
  })


  /* -------------------------------------------------------------------------- */
  /*                                  removeCard                                */
  /* -------------------------------------------------------------------------- */

  describe('.removeCard', () => {
    it('removes cards from the deck', async () => {
      const card1 = b.ofVerse(new VerseId()).addedAt(new Date(2020, 1, 1)).build()
      const card2 = b.ofVerse(new VerseId()).addedAt(new Date(2020, 1, 2)).build()
      await deck.addCard(card1),
      await deck.addCard(card2),
      await deck.removeCard(card1),
      expect(await deck.cards()).toEqual([card2])
    })
  })

  describe('.addVerse', () => {
    it('adds two cards', async () => {
      const verseId = new VerseId()
      const addedCards = await deck.addVerse(verseId)
      expect(addedCards).toHaveLength(2)

      expect(addedCards[0].verseId).toEqual(verseId)
      expect(addedCards[1].verseId).toEqual(verseId)

      expect(addedCards[0].type).toEqual(InboxCardType.Translation)
      expect(addedCards[1].type).toEqual(InboxCardType.Text)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                  removeVerse                               */
  /* -------------------------------------------------------------------------- */

  describe('.removeVerse', () => {
    it('removes all cards for a verse from the deck', async () => {
      const verse1Id = new VerseId()
      const verse2Id = new VerseId()
      const card1 = b.ofVerse(verse1Id).ofType(InboxCardType.Text).build()
      const card2 = b.ofVerse(verse1Id).ofType(InboxCardType.Translation).build()
      const card3 = b.ofVerse(verse2Id).build()
      await deck.addCard(card1)
      await deck.addCard(card2)
      await deck.addCard(card3)
      const removedCards = await deck.removeVerse(verse1Id)
      expect(removedCards).toEqual([card1, card2])
      expect(await deck.cards()).toEqual([card3])
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                               cardMemorized                                */
  /* -------------------------------------------------------------------------- */

  describe('.cardMemorized', () => {
    it('removes the card from the deck', async () => {
      const card1 = b.ofVerse(new VerseId()).build()
      const card2 = b.ofVerse(new VerseId()).build()
      await deck.addCard(card1)
      await deck.addCard(card2)
      await deck.cardMemorized(card1)
      expect(await deck.cards()).toEqual([card2])
    })
  })

  describe('.findCards', () => {
    it('returns all cards for a verse', async () => {
      const { ofVerse } = InboxCardQueries
      const verse1Id = new VerseId()
      const verse2Id = new VerseId()
      const card1 = b.ofVerse(verse1Id).ofType(InboxCardType.Text).build()
      const card2 = b.ofVerse(verse1Id).ofType(InboxCardType.Translation).build()
      const card3 = b.ofVerse(verse2Id).build()
      await deck.addCard(card1)
      await deck.addCard(card2)
      await deck.addCard(card3)

      const verseCards = await deck.findCards(ofVerse(verse1Id))
      expect(verseCards).toEqual([card1, card2])

      const verseCardsOfType = await deck.findCards(
        ofVerse(verse1Id), ofType(InboxCardType.Translation)
      )
      expect(verseCardsOfType).toEqual([card2])
    })
  })
})