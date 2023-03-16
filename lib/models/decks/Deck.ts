import { Query, QueryBuilder, Repository } from '@akdasa-studios/framework'
import { Card } from '@lib/models'

export class Deck<TCardType extends Card> {
  protected _cards: Repository<TCardType>

  constructor(
    cards: Repository<TCardType>,
    private readonly activeCards: Query<TCardType>
  ) {
    this._cards = cards
  }

  async cardsCount(): Promise<number> {
    return (await this.findCards(this.activeCards)).length
  }

  /**
   * Returns true if the deck is empty, otherwise false.
   * @returns True if the deck is empty, otherwise false
   */
  async isEmpty(): Promise<boolean> {
    const items = await this.findCards(this.activeCards)
    return items.length === 0
  }

  /**
   * Adds the given card to the deck.
   * @param card Card to add to the deck
   */
  async addCard(card: TCardType) {
    await this._cards.save(card)
  }

  /**
   * Removes the given card from the deck.
   * @param card Card to remove from the deck
   */
  async removeCard(card: TCardType) {
    await this._cards.delete(card.id)
  }

  /**
   * Returns list of cards.
   * @param query Query. Uses the AND operator if multiple queries are passed.
   * @returns List of queries
   */
  async findCards(
    ...query: Query<TCardType>[]
  ): Promise<readonly TCardType[]> {
    const qb = new QueryBuilder<TCardType>()
    const result = await this._cards.find(qb.and(
      this.activeCards,
      ...query
    ))
    return result
  }
}