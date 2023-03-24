import { InMemoryRepository } from '@akdasa-studios/framework'
import { ReviewCard, ReviewCardBuilder, ReviewCardQueries, ReviewCardType, ReviewDeck, VerseId } from '@lib/models'


describe('ReviewDeck', () => {

  let deck: ReviewDeck
  const b = (
    new ReviewCardBuilder()
      .ofVerse(new VerseId())
      .ofType(ReviewCardType.NumberToText)
  )
  const { ofVerse, dueTo } = ReviewCardQueries

  beforeEach(() => {
    deck = new ReviewDeck(new InMemoryRepository<ReviewCard>())
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

  /* -------------------------------------------------------------------------- */
  /*                                getVerseCards                               */
  /* -------------------------------------------------------------------------- */

  describe('.findCards', () => {
    it('returns all cards for a verse', async () => {
      const verse1Id = new VerseId()
      const verse2Id = new VerseId()
      const card1 = b.dueTo(new Date(2020, 1, 1)).ofVerse(verse1Id).ofType(ReviewCardType.NumberToText).build()
      const card2 = b.dueTo(new Date(2020, 1, 2)).ofVerse(verse1Id).ofType(ReviewCardType.NumberToTranslation).build()
      const card3 = b.dueTo(new Date(2020, 1, 3)).ofVerse(verse2Id).build()
      await deck.addCard(card1)
      await deck.addCard(card2)
      await deck.addCard(card3)
      const verseCards = await deck.findCards(
        ofVerse(verse1Id),
        dueTo(new Date(2020, 1, 1))
      )

      expect(verseCards).toEqual([card1])
    })
  })


  /* -------------------------------------------------------------------------- */
  /*                                  dueToCards                                */
  /* -------------------------------------------------------------------------- */

  describe('.dueToCards', () => {
    it('returns cards due to the given date', async () => {
      const card1 = b.ofVerse(new VerseId()).dueTo(new Date(2020, 1, 1)).build()
      const card2 = b.ofVerse(new VerseId()).dueTo(new Date(2020, 1, 2)).build()
      const card3 = b.ofVerse(new VerseId()).dueTo(new Date(2020, 1, 3)).build()
      await deck.addCard(card1)
      await deck.addCard(card2)
      await deck.addCard(card3)
      const dueToCards = await deck.dueToCards(new Date(2020, 1, 2))
      expect(dueToCards).toEqual([card1, card2])
    })

    it('returns sorted by addedAt field', async () => {
      const card1 = b.ofVerse(new VerseId()).addedAt(new Date(2020, 1, 1, 1, 1, 1, 1)).dueTo(new Date(2020, 1, 2)).build()
      const card2 = b.ofVerse(new VerseId()).addedAt(new Date(2020, 1, 1, 2, 2, 2, 2)).dueTo(new Date(2020, 1, 2)).build()
      const card3 = b.ofVerse(new VerseId()).addedAt(new Date(2020, 1, 1, 3, 3, 3, 3)).dueTo(new Date(2020, 1, 2)).build()
      await deck.addCard(card3)
      await deck.addCard(card1)
      await deck.addCard(card2)
      const dueToCards = await deck.dueToCards(new Date(2020, 1, 2))
      expect(dueToCards).toEqual([card1, card2, card3])
    })

    it('does not return cards if there is no due to cards', async () => {
      const card1 = b.dueTo(new Date(2020, 1, 1)).build()
      const card2 = b.dueTo(new Date(2020, 1, 2)).build()
      const card3 = b.dueTo(new Date(2020, 1, 3)).build()
      await deck.addCard(card1)
      await deck.addCard(card2)
      await deck.addCard(card3)
      const dueToCards = await deck.dueToCards(new Date(2019, 1, 2))
      expect(dueToCards).toEqual([])
    })

  })
})