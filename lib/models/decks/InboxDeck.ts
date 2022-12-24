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
  get cards(): readonly InboxCard[] {
    return this._cards.all().slice().sort((x, y) => x.addedAt.getTime() - y.addedAt.getTime())
  }

  /**
   * Returns true if the deck is empty, otherwise false.
   * @returns True if the deck is empty, otherwise false
   */
  get isEmpty(): boolean {
    return this._cards.all().length === 0
  }

  /* -------------------------------------------------------------------------- */
  /*                                    Cards                                   */
  /* -------------------------------------------------------------------------- */

  /**
   * Adds the given card to the deck.
   * @param card Card to add to the deck
   */
  addCard(card: InboxCard) {
    this._cards.save(card)
  }

  /**
   * Removes the given card from the deck.
   * @param card Card to remove from the deck
   */
  removeCard(card: InboxCard) {
    this._cards.delete(card.id)
  }

  /**
   * Marks card as memorized.
   * @param card Card to mark as memorized
   */
  cardMemorized(card: InboxCard) {
    this.removeCard(card)
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Verses                                   */
  /* -------------------------------------------------------------------------- */

  /**
   * Creates two cards for the given verse and adds them to the deck.
   * @param verseId Verse ID to add to the deck
   * @returns Created cards
   */
  addVerse(verseId: VerseId) : readonly InboxCard[] {
    const b = new InboxCardBuilder()
      .ofVerse(verseId)
      .addedAt(new Date())

    // create two cards for the verse
    const card1 = b.ofType(InboxCardType.Translation).build()
    const card2 = b.ofType(InboxCardType.Text).build()
    this.addCard(card1)
    this.addCard(card2)
    return [card1, card2]
  }

  /**
   * Removes all cards for the given verse from the deck.
   * @param verseId Verse ID to remove from the deck
   * @returns Removed cards
   */
  removeVerse(verseId: VerseId) : readonly InboxCard[] {
    const removedCards = this.getVerseCards(verseId)
    for(const card of removedCards) {
      this.removeCard(card)
    }
    return removedCards
  }

  /**
   * Returns all cards for the given verse.
   * @param verseId Verse to get cards for
   * @param cardType Card type to filter by
   * @returns List of cards for the given verse
   */
  getVerseCards(
    verseId: VerseId,
    cardType?: InboxCardType,
  ) : readonly InboxCard[] {
    return this._cards.all().filter(x => x.verseId.equals(verseId) && (cardType ? x.type === cardType : true))
  }
}