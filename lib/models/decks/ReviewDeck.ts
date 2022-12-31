import { Repository } from '@akdasa-studios/framework'
import { ReviewCard, ReviewCardType, VerseId } from '@lib/models'


/**
 * Inbox deck.
 */
export class ReviewDeck {
  private _cards: Repository<ReviewCard>

  /**
   * Initializes a new instance of InboxDeck class.
   * @param cards Initial cards
   */
  constructor(
    cards: Repository<ReviewCard>,
  ) {
    this._cards = cards
  }

  /**
   * Returns the cards in the deck in the order they were added.
   */
  async cards(): Promise<readonly ReviewCard[]> {
    const cards = (await this._cards.all()).value
    return cards.slice().sort((x, y) => x.addedAt.getTime() - y.addedAt.getTime())
  }

  async dueToCards(date: Date): Promise<readonly ReviewCard[]> {
    const cards = (await this._cards.all()).value
    return cards.filter(x => x.dueTo.getTime() <= date.getTime())
  }

  /**
   * Returns true if the deck is empty, otherwise false.
   * @returns True if the deck is empty, otherwise false
   */
  async isEmpty(): Promise<boolean> {
    // TODO: add count() request via repository
    return (await this.cards()).length === 0
  }

  /* -------------------------------------------------------------------------- */
  /*                                    Cards                                   */
  /* -------------------------------------------------------------------------- */

  /**
   * Adds the given card to the deck.
   * @param card Card to add to the deck
   */
  async addCard(card: ReviewCard) {
    await this._cards.save(card)
  }

  /**
   * Removes the given card from the deck.
   * @param card Card to remove from the deck
   */
  async removeCard(card: ReviewCard) {
    await this._cards.delete(card.id)
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
  async getVerseCards(
    verseId: VerseId,
    cardType?: ReviewCardType,
    date?: Date,
  ): Promise<readonly ReviewCard[]> {
    return (await this.cards()).filter(
      x => x.verseId.equals(verseId) &&
      (cardType ? x.type === cardType : true) &&
      (date ? x.dueTo.getTime() <= date.getTime() : true)
    )
  }
}