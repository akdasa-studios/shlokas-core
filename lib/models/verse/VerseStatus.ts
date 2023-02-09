import { Aggregate, UuidIdentity } from '@akdasa-studios/framework'
import { VerseId } from './Verse'


/**
 * Verse Status Identity
 */
export class VerseStatusId extends UuidIdentity<'VerseStatusId'> {
}

export enum Decks {
  None = 'None',
  Inbox = 'Inbox',
  Review = 'Review'
}

/**
 * Verse status
 */
export class VerseStatus extends Aggregate<VerseStatusId> {
  private readonly _verseId: VerseId
  private _deck: Decks = Decks.None

  constructor(
    verseId: VerseId,
    deck: Decks = Decks.None
  ) {
    super(new VerseStatusId(verseId.value))
    this._verseId = verseId
    this._deck = deck
  }

  equals(other: VerseStatus): boolean {
    return this.verseId.equals(other.verseId) && this.inDeck == other.inDeck
  }


  get verseId() : VerseId {
    return this._verseId
  }

  get inDeck() : Decks {
    return this._deck
  }

  movedToDeck(deck: Decks) {
    this._deck = deck
  }
}

export const NoStatus = new VerseStatus(
  new VerseId('00000000-0000-0000-0000-000000000000'),
  Decks.None
)