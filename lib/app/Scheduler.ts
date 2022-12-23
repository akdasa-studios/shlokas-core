import { ReviewGrade } from '@lib/models'

export class Scheduler {
  private readonly _newCardIntervals = {
    [ReviewGrade.Forgot]: 0,
    [ReviewGrade.Hard]: 0,
    [ReviewGrade.Good]: 1440,
    [ReviewGrade.Easy]: 1440 * 2,
  }
  private readonly _intervalMultipliers = {
    [ReviewGrade.Forgot]: 0,
    [ReviewGrade.Hard]: .7,
    [ReviewGrade.Good]: 1,
    [ReviewGrade.Easy]: 1.3,
  }

  getNewInterval(
    currentInterval: number,
    currentEase: number,
    grade: ReviewGrade) : number
  {
    return Math.ceil(currentInterval === 0 /* new or forgotten card */
      ? this._newCardIntervals[grade]
      : currentInterval * this._intervalMultipliers[grade] * currentEase)
  }
}