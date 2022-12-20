import { ReviewCardBuilder, ReviewCardType, ReviewDeck, VerseId } from '@lib/models'


describe('ReviewDeck', () => {

  let deck: ReviewDeck
  const b = (
    new ReviewCardBuilder()
      .ofVerse(new VerseId())
      .ofType(ReviewCardType.NumberToText)
  )

  beforeEach(() => {
    deck = new ReviewDeck([])
  })

  /* -------------------------------------------------------------------------- */
  /*                                    cards                                   */
  /* -------------------------------------------------------------------------- */

  describe('.cards', () => {
    it('sorts cards by addedAt', () => {
      const card1 = b.addedAt(new Date(2020, 1, 1)).build()
      const card2 = b.addedAt(new Date(2020, 1, 1, 1, 1, 2)).build()
      const card3 = b.addedAt(new Date(2020, 1, 1, 1, 1, 3)).build()
      const card4 = b.addedAt(new Date(2020, 1, 2)).build()
      const card5 = b.addedAt(new Date(2020, 1, 3)).build()
      const deck = new ReviewDeck([card3, card5, card4, card2, card1])
      expect(deck.cards).toEqual([card1, card2, card3, card4, card5])
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                   isEmpty                                  */
  /* -------------------------------------------------------------------------- */

  describe('.isEmpty', () => {
    it('returns true if the deck is empty', () => {
      expect(deck.isEmpty).toBe(true)
    })

    it('returns false if the deck is not empty', () => {
      const card1 = b.addedAt(new Date(2020, 1, 1)).build()
      const deck = new ReviewDeck([card1])
      expect(deck.isEmpty).toBe(false)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                   addCard                                  */
  /* -------------------------------------------------------------------------- */

  describe('.addCard', () => {
    it('adds cards to the deck', () => {
      const card1 = b.addedAt(new Date(2020, 1, 1)).build()
      deck.addCard(card1)
      expect(deck.cards).toEqual([card1])
    })
  })


  /* -------------------------------------------------------------------------- */
  /*                                  removeCard                                */
  /* -------------------------------------------------------------------------- */

  describe('.removeCard', () => {
    it('removes cards from the deck', () => {
      const card1 = b.addedAt(new Date(2020, 1, 1)).build()
      const card2 = b.addedAt(new Date(2020, 1, 2)).build()
      const deck = new ReviewDeck([card1, card2])
      deck.removeCard(card1)
      expect(deck.cards).toEqual([card2])
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                getVerseCards                               */
  /* -------------------------------------------------------------------------- */

  describe('.getVerseCards', () => {
    it('returns all cards for a verse', () => {
      const verse1Id = new VerseId()
      const verse2Id = new VerseId()
      const card1 = b.dueTo(new Date(2020, 1, 1)).ofVerse(verse1Id).build()
      const card2 = b.dueTo(new Date(2020, 1, 2)).ofVerse(verse1Id).build()
      const card3 = b.dueTo(new Date(2020, 1, 3)).ofVerse(verse2Id).build()
      deck.addCard(card1)
      deck.addCard(card2)
      deck.addCard(card3)
      const verseCards = deck.getVerseCards(verse1Id, undefined, new Date(2020, 1, 1))
      expect(verseCards).toEqual([card1])
    })
  })


  /* -------------------------------------------------------------------------- */
  /*                                  dueToCards                                */
  /* -------------------------------------------------------------------------- */

  describe('.dueToCards', () => {
    it('returns cards due to the given date', () => {
      const card1 = b.dueTo(new Date(2020, 1, 1)).build()
      const card2 = b.dueTo(new Date(2020, 1, 2)).build()
      const card3 = b.dueTo(new Date(2020, 1, 3)).build()
      const deck = new ReviewDeck([card1, card2, card3])
      const dueToCards = deck.dueToCards(new Date(2020, 1, 2))
      expect(dueToCards).toEqual([card1, card2])
    })

    it('does not return cards if there is no due to cards', () => {
      const card1 = b.dueTo(new Date(2020, 1, 1)).build()
      const card2 = b.dueTo(new Date(2020, 1, 2)).build()
      const card3 = b.dueTo(new Date(2020, 1, 3)).build()
      const deck = new ReviewDeck([card1, card2, card3])
      const dueToCards = deck.dueToCards(new Date(2019, 1, 2))
      expect(dueToCards).toEqual([])
    })

  })
})