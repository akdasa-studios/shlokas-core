import { Command, Result } from '@akdasa-studios/framework'
import { Context } from '@lib/app'
import { ReviewCard, ReviewGrade } from '@lib/models'


export class ReviewCardReviewed implements
  Command<Context, Result<void, string>>
{
  private _prevDueTo: Date
  private _prevInterval = 0
  private _prevEase = 250
  private _prevLapses = 0
  private _prevDifficultyChangedAt: Date

  constructor(
    public readonly reviewCard: ReviewCard,
    public readonly grade: ReviewGrade
  ) { }

  async execute(context: Context): Promise<Result<void, string>> {
    this._prevDueTo = this.reviewCard.dueTo
    this._prevInterval = this.reviewCard.interval
    this._prevEase = this.reviewCard.ease
    this._prevLapses = this.reviewCard.lapses
    this._prevDifficultyChangedAt = this.reviewCard.difficultyChangedAt

    this.reviewCard.review(this.grade, context.timeMachine)
    await context.repositories.reviewCards.save(this.reviewCard)
    return Result.ok()
  }

  async revert(context: Context): Promise<void> {
    this.reviewCard.setStats(
      this._prevDueTo,
      this._prevInterval,
      this._prevEase,
      this._prevLapses,
      this._prevDifficultyChangedAt
    )
    await context.repositories.reviewCards.save(this.reviewCard)
  }
}
