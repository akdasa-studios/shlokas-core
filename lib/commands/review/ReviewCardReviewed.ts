import { Command, Result } from '@akdasa-studios/framework'
import { Application } from '@lib/app/Application'
import { ReviewCard, ReviewGrade } from '@lib/models'


export class ReviewCardReviewed implements
  Command<Application, Result<void, string>>
{
  private _reviewCard: ReviewCard
  private _grade: ReviewGrade

  private _prevDueTo: Date
  private _prevInterval = 0
  private _prevEase = 250
  private _prevLapses = 0
  private _prevDifficultyChangedAt: Date

  constructor(
    reviewCard: ReviewCard,
    grade: ReviewGrade
  ) {
    this._reviewCard = reviewCard
    this._grade = grade
  }

  async execute(context: Application): Promise<Result<void, string>> {
    this._prevDueTo = this._reviewCard.dueTo
    this._prevInterval = this._reviewCard.interval
    this._prevEase = this._reviewCard.ease
    this._prevLapses = this._reviewCard.lapses
    this._prevDifficultyChangedAt = this._reviewCard.difficultyChangedAt

    this._reviewCard.review(this._grade)
    await context.repositories.reviewCards.save(this._reviewCard)
    return Result.ok()
  }

  async revert(context: Application): Promise<void> {
    this._reviewCard.setStats(
      this._prevDueTo,
      this._prevInterval,
      this._prevEase,
      this._prevLapses,
      this._prevDifficultyChangedAt
    )
    await context.repositories.reviewCards.save(this._reviewCard)
  }
}
