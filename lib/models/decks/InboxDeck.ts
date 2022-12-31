import { Repository } from '@akdasa-studios/framework'
import { InboxCard, InboxCardBuilder, InboxCardType, VerseId } from '@lib/models'


/**
 * Inbox deck.
 */
export class InboxDeck {
  private _cards: Repository<InboxCard>

  /**
   * Initializes a new instance of InboxDeck class.
   * @param cards Initial cards
   */
  constructor(
    cards: Repository<InboxCard>,
  ) {
    this._cards = cards
  }

  /**
   * Returns the cards in the deck in the order they were added.
   */
  async cards(): Promise<readonly InboxCard[]> {
    const cards = (await this._cards.all()).value
    return cards.slice().sort((x, y) => x.addedAt.getTime() - y.addedAt.getTime())
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
  async addCard(card: InboxCard) {
    await this._cards.save(card)
  }

  /**
   * Removes the given card from the deck.
   * @param card Card to remove from the deck
   */
  async removeCard(card: InboxCard) {
    await this._cards.delete(card.id)
  }

  /**
   * Marks card as memorized.
   * @param card Card to mark as memorized
   */
  async cardMemorized(card: InboxCard) {
    await this.removeCard(card)
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Verses                                   */
  /* -------------------------------------------------------------------------- */

  /**
   * Creates two cards for the given verse and adds them to the deck.
   * @param verseId Verse ID to add to the deck
   * @returns Created cards
   */
  async addVerse(verseId: VerseId): Promise<readonly InboxCard[]> {
    const now = new Date().getTime()
    const builder = new InboxCardBuilder()
      .ofVerse(verseId)

    // create two cards for the verse
    const card1 = builder
      .ofType(InboxCardType.Translation)
      .addedAt(new Date(now))
      .build()
    const card2 = builder
      .ofType(InboxCardType.Text)
      .addedAt(new Date(now + 1)) // add extra time to keep sorting stable
      .build()

    await this.addCard(card1)
    await this.addCard(card2)
    return [card1, card2]
  }

  /**
   * Removes all cards for the given verse from the deck.
   * @param verseId Verse ID to remove from the deck
   * @returns Removed cards
   */
  async removeVerse(verseId: VerseId): Promise<readonly InboxCard[]> {
    const removedCards = await this.getVerseCards(verseId)
    for(const card of removedCards) {
      await this.removeCard(card)
    }
    return removedCards
  }

  /**
   * Returns all cards for the given verse.
   * @param verseId Verse to get cards for
   * @param cardType Card type to filter by
   * @returns List of cards for the given verse
   */
  async getVerseCards(
    verseId: VerseId,
    cardType?: InboxCardType,
  ): Promise<readonly InboxCard[]> {
    return (await this.cards())
      .filter(x => x.verseId.equals(verseId) && (cardType ? x.type === cardType : true))
  }
}