import { InboxCardBuilder, InboxCardType, InboxDeck, VerseId } from '@lib/models'


describe('InboxDeck', () => {

  let deck: InboxDeck
  const b = (
    new InboxCardBuilder()
      .ofVerse(new VerseId())
      .ofType(InboxCardType.Text)
  )

  beforeEach(() => {
    deck = new InboxDeck([])
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
      const deck = new InboxDeck([card3, card5, card4, card2, card1])
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
      const deck = new InboxDeck([card1])
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
      const deck = new InboxDeck([card1, card2])
      deck.removeCard(card1)
      expect(deck.cards).toEqual([card2])
    })
  })

  describe('.addVerse', () => {
    it('adds two cards', () => {
      const verseId = new VerseId()
      const addedCards = deck.addVerse(verseId)
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
    it('removes all cards for a verse from the deck', () => {
      const verse1Id = new VerseId()
      const verse2Id = new VerseId()
      const card1 = b.ofVerse(verse1Id).build()
      const card2 = b.ofVerse(verse1Id).build()
      const card3 = b.ofVerse(verse2Id).build()
      deck.addCard(card1)
      deck.addCard(card2)
      deck.addCard(card3)
      const removedCards = deck.removeVerse(verse1Id)
      expect(removedCards).toEqual([card1, card2])
      expect(deck.cards).toEqual([card3])
    })
  })
})