import { TimeMachine } from '@lib/app/TimeMachine'
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

  then(/^Lapses count is equal to (\d+)$/, (lapses: string) => {
    expect(card.lapses).toEqual(parseInt(lapses))
  })

  then('Card stats are the following:', (stats) => {
    for (const stat of stats) {
      const value = stat['Value']

      switch (stat['Name']) {
      case 'Lapses': expect(card.lapses).toEqual(parseInt(value)); break
      case 'Ease': expect(card.ease).toEqual(parseFloat(value)); break
      case 'Interval': expect(card.interval).toEqual(parseInt(value)); break
      case 'Due To':
        expect(card.dueTo).toEqual(new Date(
          new Date(stat['Value']).setHours(0,0,0,0)
        ))
        break
      }
    }
  })

  then('My review table is as follows:', (table) => {
    for (const row of table) {
      TimeMachine.set(new Date(row['Date']))

      card.review(ReviewGrade[row['Grade'] as string])
      expect(card.lapses).toEqual(parseInt(row['Lapses']))
      expect(card.ease).toEqual(parseInt(row['Ease']))
      expect(card.interval).toEqual(parseInt(row['Interval']))
      expect(card.dueTo).toEqual(new Date(
        new Date(row['Due To']).setHours(0,0,0,0)
      ))
    }
  })
}
