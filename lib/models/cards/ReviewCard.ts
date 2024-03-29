import { Scheduler } from '@lib/app/Scheduler'
import { TimeMachine } from '@lib/app'
import { ReviewGrade, VerseId } from '@lib/models'
import { Card, CardId } from './Card'
import * as getUuidByString from 'uuid-by-string'


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
  private _interval = 0
  private _ease = 250
  private _lapses = 0
  private _difficultyChangedAt: Date

  /**
   * Initialize a new instance of ReviewCard class with the given parameters.
   * @param id Identity of the card
   * @param verseId Verse identity
   * @param type Type of the card
   * @param addedAt Added at
   * @param dueTo Due to date
   */
  constructor(
    verseId: VerseId,
    public readonly type: ReviewCardType,
    public readonly addedAt: Date,
    dueTo: Date,
  ) {
    // Generate ID based on its data, to make ID the same
    // in different devices
    super(new CardId(getUuidByString(verseId.value + type)), verseId)
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

  get difficultyChangedAt(): Date {
    return this._difficultyChangedAt
  }

  setStats(
    dueTo: Date,
    interval: number,
    ease: number,
    lapses: number,
    difficultyChangedAt: Date
  ) {
    this._dueTo = dueTo
    this._interval = interval
    this._ease = ease
    this._lapses = lapses
    this._difficultyChangedAt = difficultyChangedAt
  }

  review(grade: ReviewGrade, timeMachine: TimeMachine) {
    // Decrease card difficulty
    const isCardDifficultyChangedToday = (
      this._difficultyChangedAt?.getTime() === timeMachine.today.getTime()
    )
    if (grade === ReviewGrade.Forgot && !isCardDifficultyChangedToday) {
      this._lapses += 1
      this._ease = Math.max(this._ease - 20, 130)
      this._difficultyChangedAt = timeMachine.today
    }

    // Calculate new interval
    this._interval = new Scheduler().getNewInterval(
      this._interval, this._ease / 100, grade
    )

    // Set new date
    this._dueTo = new Date(
      timeMachine.add(
        timeMachine.today, this._interval, 'm'
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
      this._verseId as VerseId,
      this._cardType as ReviewCardType,
      this._addedAt as Date || new Date(),
      this._dueTo as Date || new Date()
    )
  }
}