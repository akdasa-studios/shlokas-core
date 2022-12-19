import { ReviewCard, ReviewCardType, VerseId } from '@lib/models'


/**
 * Inbox deck.
 */
export class ReviewDeck {
  private _cards: ReviewCard[]

  /**
   * Initializes a new instance of InboxDeck class.
   * @param cards Initial cards
   */
  constructor(
    cards: ReviewCard[] = [],
  ) {
    this._cards = cards
  }

  /**
   * Returns the cards in the deck in the order they were added.
   */
  get cards(): readonly ReviewCard[] {
    return this._cards.sort((x, y) => x.addedAt.getTime() - y.addedAt.getTime())
  }

  /**
   * Returns true if the deck is empty, otherwise false.
   * @returns True if the deck is empty, otherwise false
   */
  get isEmpty(): boolean {
    return this._cards.length === 0
  }

  /* -------------------------------------------------------------------------- */
  /*                                    Cards                                   */
  /* -------------------------------------------------------------------------- */

  /**
   * Adds the given card to the deck.
   * @param card Card to add to the deck
   */
  addCard(card: ReviewCard) {
    this._cards.push(card)
  }

  /**
   * Removes the given card from the deck.
   * @param card Card to remove from the deck
   */
  removeCard(card: ReviewCard) {
    this._cards = this._cards.filter(x => x.id !== card.id)
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Verses                                   */
  /* -------------------------------------------------------------------------- */

  /**
   * Returns all cards for the given verse.
   * @param verseId Verse to get cards for
   * @param cardType Card type to filter by
   * @returns List of cards for the given verse
   */
  getVerseCards(
    verseId: VerseId,
    cardType?: ReviewCardType,
  ) : readonly ReviewCard[] {
    return this._cards.filter(x => x.verseId.equals(verseId) && (cardType ? x.type === cardType : true))
  }
}