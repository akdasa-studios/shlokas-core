import { TimeMachine } from '@lib/app/TimeMachine'
import { ReviewCard, ReviewCardType, ReviewGrade } from '@lib/models'
import { createReviewCard, createVerse } from '@tests/env'

describe('ReviewCard', () => {

  let reviewCard: ReviewCard
  const today = new Date('2020-01-01T00:00')
  const tomorrow = new Date('2020-01-02T00:00')
  const in2days = new Date('2020-01-03T00:00')
  // const in2days = new Date('2020-01-02T00:00')

  beforeEach(() => {
    TimeMachine.set(today)
    reviewCard = createReviewCard(
      createVerse('BG 1.1'),
      ReviewCardType.NumberToText,
      new Date('2020-01-01')
    )
  })

  describe('review', () => {
    it('should set dueTo to the same day if grade is Forgot', () => {
      reviewCard.review(ReviewGrade.Forgot)
      expect(reviewCard.dueTo).toEqual(today)
    })

    it('should set dueTo to the next day if grade is Hard', () => {
      reviewCard.review(ReviewGrade.Hard)
      expect(reviewCard.dueTo).toEqual(today)
    })

    it('should set dueTo to the day after tomorrow if grade is Good', () => {
      reviewCard.review(ReviewGrade.Good)
      expect(reviewCard.dueTo).toEqual(tomorrow)
    })

    it('should add 2 days to dueTo if grade is Easy', () => {
      reviewCard.review(ReviewGrade.Easy)
      expect(reviewCard.dueTo).toEqual(in2days)
    })
  })
})