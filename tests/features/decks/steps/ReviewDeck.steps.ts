import { ReviewCardReviewed } from './../../../../lib/commands/review/ReviewCardReviewed'
import { ReviewCardBuilder, ReviewCardQueries, ReviewCardType, ReviewGrade } from '@lib/models'
import { StepDefinitions } from 'jest-cucumber'
import { context as $c } from '@tests/features/context'


export const reviewDeckSteps: StepDefinitions = ({ given, when, then }) => {
  const { ofVerse, ofType, dueTo, queryBuilder } = ReviewCardQueries
  async function findVerse(verseNumber: string) {
    const verse = await $c.library.getByNumber(
      $c.settings.language, verseNumber
    )
    return verse.value
  }
  function getReviewCardType(name: string): ReviewCardType {
    return ReviewCardType[name.replace(' -> ', 'To')]
  }
  function getMark(value: string) {
    switch (value) {
    case 'Forgot': return ReviewGrade.Forgot
    case 'Hard': return ReviewGrade.Hard
    case 'Good': return ReviewGrade.Good
    case 'Easy': return ReviewGrade.Easy
    default: throw new Error(`Unknown mark: ${value}`)
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                    Given                                   */
  /* -------------------------------------------------------------------------- */

  given('Review deck has the following cards:', async (cards) => {
    for (const cardLine of cards) {
      const verse = await findVerse(cardLine['Verse'])
      const card = new ReviewCardBuilder()
        .ofType(getReviewCardType(cardLine['Type']))
        .ofVerse(verse.id)
        .dueTo(new Date(cardLine['Due To']))
        .build()
      await $c.reviewDeck.addCard(card)
    }
  })

  /* -------------------------------------------------------------------------- */
  /*                                    When                                    */
  /* -------------------------------------------------------------------------- */

  when(/^I review card "(.*)" "(.*)" with mark "(.*)"$/, async (_verse: string, _type: string, _mark: string) => {
    const type =  getReviewCardType(_type)
    const verse = await findVerse(_verse)
    const card = (await $c.reviewDeck.findCards(ofVerse(verse.id), ofType(type)))[0]
    await $c.processor.execute(new ReviewCardReviewed(card, getMark(_mark)))
  })

  /* -------------------------------------------------------------------------- */
  /*                                    Then                                    */
  /* -------------------------------------------------------------------------- */

  then('Review deck contains the following cards:', async (cards) => {
    expect(await $c.reviewDeck.cardsCount()).toEqual(cards.length)

    for (const card of cards) {
      const verse = await findVerse(card['Verse Number'])
      const f = await $c.reviewDeck.findCards(
        ofVerse(verse.id),
        ofType(getReviewCardType(card['Card Type']))
      )
      expect(f).toHaveLength(1)
      expect(f[0].dueTo).toEqual(new Date(card['Due To']))
    }
  })

  then('Review deck contains no cards', () => {
    expect($c.reviewDeck.isEmpty).toBeTruthy()
  })

  then(/^I see no cards for review on "(.*)"$/, async (date: string) => {
    expect(
      (await $c.reviewDeck.dueToCards(new Date(date))).length
    ).toEqual(0)
  })

  then(/^I see the following cards for review on "(.*)":$/, async (date: string, cards) => {
    expect(
      (await $c.reviewDeck.dueToCards(new Date(date))).length
    ).toEqual(cards.length)

    for (const card of cards) {
      const verse = await findVerse(card['Verse'])
      const f = await $c.reviewDeck.findCards(queryBuilder.and(
        ofVerse(verse.id),
        ofType(getReviewCardType(card['Type'])),
        dueTo(new Date(date))
      ))
      expect(f).toHaveLength(1)
    }
  })

}
