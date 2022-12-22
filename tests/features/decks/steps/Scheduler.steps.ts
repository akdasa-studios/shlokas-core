import { ReviewCard, ReviewCardType, ReviewGrade } from '@lib/models'
import { getReviewCard, getVerse } from '@tests/unit/models/env'
import { StepDefinitions } from 'jest-cucumber'


export const schedulerSteps: StepDefinitions = ({ given, when, then }) => {

  let card: ReviewCard

  /* -------------------------------------------------------------------------- */
  /*                                   Given                                    */
  /* -------------------------------------------------------------------------- */

  given('The new card was added to the Review deck', () => {
    card = getReviewCard(
      getVerse('BG 1.1'),
      ReviewCardType.NumberToText,
      new Date('2020-01-01T00:00')
    )
  })

  /* -------------------------------------------------------------------------- */
  /*                                    When                                    */
  /* -------------------------------------------------------------------------- */

  when(/^I review it with garde "(.*)"$/, (grade: string) => {
    card.review(ReviewGrade[grade])
  })

  /* -------------------------------------------------------------------------- */
  /*                                    Then                                    */
  /* -------------------------------------------------------------------------- */

  then(/^Card due date is "(.*)"$/, (dueDate: string) => {
    expect(card.dueTo).toEqual(new Date(dueDate+'T00:00'))
  })

}
