import { VerseId } from '@lib/models/verse'
import { Card, CardId } from './Card'
import * as getUuidByString from 'uuid-by-string'


export enum InboxCardType {
  Text = 'Text',
  Translation = 'Translation',
}

/**
 * An inbox card.
 */
export class InboxCard extends Card {
  /**
   * Initialize a new instance of InboxCard class with the given parameters.
   * @param id Identity of the card
   * @param verseId Verse identity
   * @param type Type of the card
   * @param addedAt Added at
   */
  constructor(
    verseId: VerseId,
    public readonly type: InboxCardType,
    public readonly addedAt: Date,
  ) {
    // Generate ID based on its data, to make ID the same
    // in different devices
    super(new CardId(getUuidByString(verseId.value + type)), verseId)
  }
}

/**
 * A builder for the inbox card.
 */
export class InboxCardBuilder {
  private _verseId?: VerseId
  private _inboxCardType?: InboxCardType
  private _addedAt?: Date

  /**
   * (required) Sets verse id from which the card is created.
   * @param verseId Verse id
   */
  ofVerse(verseId: VerseId): InboxCardBuilder {
    this._verseId = verseId
    return this
  }

  /**
   * (required) Sets the type of the card.
   * @param type Type of the card
   */
  ofType(inboxCardType: InboxCardType): InboxCardBuilder {
    this._inboxCardType = inboxCardType
    return this
  }

  /**
   * (optional) Sets the date when the card is added to the inbox. Current date is used if not set.
   * @param addedAt Date when the card is added to the inbox
   */
  addedAt(addedAt: Date): InboxCardBuilder {
    this._addedAt = addedAt
    return this
  }

  /**
   * Creates a new instance of InboxCard class with the given parameters.
   * @returns A new instance of InboxCard class.
   */
  build(): InboxCard {
    return new InboxCard(
      this._verseId as VerseId,
      this._inboxCardType as InboxCardType,
      this._addedAt as Date || new Date()
    )
  }
}