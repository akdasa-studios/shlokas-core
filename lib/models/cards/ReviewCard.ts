import { VerseId, ReviewGrade } from '@lib/models'
import { Card, CardId } from './Card'


export enum ReviewCardType {
  NumberToTranslation = 'NumberToTranslation',
  NumberToText = 'NumberToText',
  TranslationToNumber = 'TranslationToNumber',
  TextToNumber = 'TextToNumber',
  TextToTranslation = 'TextToTranslation',
  TranslationToText = 'TranslationToText'
}

/**
 * An review card.
 */
export class ReviewCard extends Card {
  private _dueTo: Date

  /**
   * Initialize a new instance of ReviewCard class with the given parameters.
   * @param id Identity of the card
   * @param verseId Verse identity
   * @param type Type of the card
   * @param addedAt Added at
   * @param dueTo Due to date
   */
  constructor(
    id: CardId,
    verseId: VerseId,
    public readonly type: ReviewCardType,
    public readonly addedAt: Date,
    dueTo: Date,
  ) {
    super(id, verseId)
    this._dueTo = new Date(dueTo)
  }

  public get dueTo(): Date {
    return this._dueTo
  }

  review(grade: ReviewGrade) {
    const daysToAdd = {
      [ReviewGrade.Forgot]: 0,
      [ReviewGrade.Hard]: 1,
      [ReviewGrade.Good]: 2,
      [ReviewGrade.Easy]: 3,
    }
    this._dueTo.setDate(this.dueTo.getDate() + daysToAdd[grade])
  }
}

/**
 * A builder for the inbox card.
 */
export class ReviewCardBuilder {
  private _id?: CardId
  private _verseId?: VerseId
  private _cardType?: ReviewCardType
  private _addedAt?: Date
  private _dueTo?: Date

  /**
   * (required) Sets verse id from which the card is created.
   * @param verseId Verse id
   */
  ofVerse(verseId: VerseId): ReviewCardBuilder {
    this._verseId = verseId
    return this
  }

  /**
   * (required) Sets the type of the card.
   * @param type Type of the card
   */
  ofType(reviewCardType: ReviewCardType): ReviewCardBuilder {
    this._cardType = reviewCardType
    return this
  }

  /**
   * (optional) Sets the date when the card is added to the inbox. Current date is used if not set.
   * @param addedAt Date when the card is added to the inbox
   */
  addedAt(addedAt: Date): ReviewCardBuilder {
    this._addedAt = addedAt
    return this
  }

  /**
   * (optional) Sets the date when the card is added to the inbox. Current date is used if not set.
   * @param addedAt Date when the card is added to the inbox
   */
  dueTo(dueTo: Date): ReviewCardBuilder {
    this._dueTo = dueTo
    return this
  }

  /**
   * Creates a new instance of InboxCard class with the given parameters.
   * @returns A new instance of InboxCard class.
   */
  build(): ReviewCard {
    return new ReviewCard(
      this._id || new CardId(),
      this._verseId as VerseId,
      this._cardType as ReviewCardType,
      this._addedAt as Date || new Date(),
      this._dueTo as Date || new Date()
    )
  }
}