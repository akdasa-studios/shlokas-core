import { Repository } from '@akdasa-studios/framework'
import { ReviewCard } from '@lib/models'
import { active, dueTo } from '@lib/models/cards/queries/ReviewCard'
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
    super(cards, active())
  }

  /**
   * Returns the cards in the deck in the order they were added.
   */
  async cards(): Promise<readonly ReviewCard[]> {
    const cards = (await this._cards.all()).entities
    return cards.slice().sort((x, y) => x.addedAt.getTime() - y.addedAt.getTime())
  }

  async dueToCards(date: Date): Promise<readonly ReviewCard[]> {
    const cards = await this.findCards(dueTo(date))
    return cards.slice().sort((x, y) => x.addedAt.getTime() - y.addedAt.getTime())
  }
}