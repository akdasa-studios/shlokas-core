import { ReviewCard, ReviewCardType, ReviewGrade } from '@lib/models'
import { getReviewCard, getVerse } from '../env'

describe('ReviewCard', () => {

  let reviewCard: ReviewCard

  beforeEach(() => {
    reviewCard = getReviewCard(
      getVerse('BG 1.1'),
      ReviewCardType.NumberToText,
      new Date('2020-01-01')
    )
  })

  describe('review', () => {
    it('should set dueTo to the same day if grade is Forgot', () => {
      reviewCard.review(ReviewGrade.Forgot)
      expect(reviewCard.dueTo).toEqual(new Date('2020-01-01'))
    })

    it('should set dueTo to the next day if grade is Hard', () => {
      reviewCard.review(ReviewGrade.Hard)
      expect(reviewCard.dueTo).toEqual(new Date('2020-01-02'))
    })

    it('should set dueTo to the day after tomorrow if grade is Good', () => {
      reviewCard.review(ReviewGrade.Good)
      expect(reviewCard.dueTo).toEqual(new Date('2020-01-03'))
    })

    it('should add 3 days to dueTo if grade is Easy', () => {
      reviewCard.review(ReviewGrade.Easy)
      expect(reviewCard.dueTo).toEqual(new Date('2020-01-04'))
    })
  })
})