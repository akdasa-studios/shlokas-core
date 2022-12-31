import { Repository } from '@akdasa-studios/framework'
import { ReviewCard, ReviewCardQueries } from '@lib/models'
import { Deck } from './Deck'


/**
 * Inbox deck.
 */
export class ReviewDeck extends Deck<ReviewCard> {
  /**
   * Initializes a new instance of InboxDeck class.
   * @param cards Initial cards
   */
  constructor(
    cards: Repository<ReviewCard>,
  ) {
    super(cards)
  }

  /**
   * Returns the cards in the deck in the order they were added.
   */
  async cards(): Promise<readonly ReviewCard[]> {
    const cards = (await this._cards.all()).value
    return cards.slice().sort((x, y) => x.addedAt.getTime() - y.addedAt.getTime())
  }

  async dueToCards(date: Date): Promise<readonly ReviewCard[]> {
    const { dueTo } = ReviewCardQueries
    return (await this.findCards(dueTo(date)))
  }
}