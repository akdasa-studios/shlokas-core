import { Repository } from '@akdasa-studios/framework'
import { InboxCard, InboxCardBuilder, InboxCardType, VerseId } from '@lib/models'
import { InboxCardQueries } from '../cards/queries'
import { Deck } from './Deck'


/**
 * Inbox deck.
 */
export class InboxDeck extends Deck<InboxCard> {
  /**
   * Initializes a new instance of InboxDeck class.
   * @param cards Initial cards
   */
  constructor(
    cards: Repository<InboxCard>,
  ) {
    super(cards)
  }

  /**
   * Returns the cards in the deck in the order they were added.
   */
  async cards(): Promise<readonly InboxCard[]> {
    const cards = (await this._cards.all()).value
    return cards.slice().sort((x, y) => x.addedAt.getTime() - y.addedAt.getTime())
  }

  /* -------------------------------------------------------------------------- */
  /*                                    Cards                                   */
  /* -------------------------------------------------------------------------- */

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
    const { ofVerse } = InboxCardQueries
    const removedCards = await this.findCards(ofVerse(verseId))
    for(const card of removedCards) {
      await this.removeCard(card)
    }
    return removedCards
  }
}