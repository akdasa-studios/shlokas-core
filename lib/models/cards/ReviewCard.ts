import { TimeMachine } from '@lib/app/TimeMachine'
import { VerseId, ReviewGrade } from '@lib/models'
import { Card, CardId } from './Card'
import * as dayjs from 'dayjs'

const FORGOT_CARDS_DECRESE_EASE_FACTOR = 0.2
const HOURS_24 = 86400000

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
  private _interval = 0 /* 24 hours * 60 minutes */
  private _ease = 250
  private _lapses = 0
  private _lastDifficultyDecreasedAt: Date

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

  public get lapses(): number {
    return this._lapses
  }

  public get ease(): number {
    return this._ease
  }

  get interval(): number {
    return this._interval
  }

  review(grade: ReviewGrade) {
    // Lap cout should be only increased by one per day
    const isCardDifficultyDecreasedToday = (
      this._lastDifficultyDecreasedAt?.getTime() === TimeMachine.today.getTime()
    )
    if (grade === ReviewGrade.Forgot && !isCardDifficultyDecreasedToday) {
      this._lapses += 1
      this._lastDifficultyDecreasedAt = TimeMachine.today
      this._ease = Math.max(this._ease - 20, 130)
    }

    if (this._interval !== 0) {
      const intervalMultipliers = {
        [ReviewGrade.Forgot]: 0,
        [ReviewGrade.Hard]: .7,
        [ReviewGrade.Good]: 1,
        [ReviewGrade.Easy]: 1.3,
      }

      this._interval = Math.max(
        grade !== ReviewGrade.Forgot ? 1440 : 0, /* 24 * 60 */
        this._interval * (this._ease / 100) * intervalMultipliers[grade]
      )
    } else {
      this._interval = {
        [ReviewGrade.Forgot]: 0,
        [ReviewGrade.Hard]: 0,
        [ReviewGrade.Good]: 1440,
        [ReviewGrade.Easy]: 1440 * 2,
      }[grade]
    }

    this._dueTo = new Date(
      TimeMachine.add(
        TimeMachine.today, this._interval, 'm'
      ).setHours(0,0,0,0)
    )
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