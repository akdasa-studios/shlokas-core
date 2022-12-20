import { ReviewCardBuilder, ReviewCardType, ReviewGrade } from '@lib/models'
import { StepDefinitions } from 'jest-cucumber'

import { context } from '@tests/features/context'


export const reviewDeckSteps: StepDefinitions = ({ given, when, then }) => {

  function getVerse(verseNumberStr: string) {
    const verse = context.app.library.getByNumber(verseNumberStr)
    if (verse.isFailure) { throw new Error(verse.error) }
    return verse.value
  }

  function getReviewCardType(name: string): ReviewCardType {
    return ReviewCardType[
      name.replace(' -> ', 'To')
    ]
  }

  function getMark(value: string) {
    switch (value) {
    case 'Do Not Remember': return ReviewGrade.DontRemember
    case 'Very Hard': return ReviewGrade.VeryHard
    case 'Hard': return ReviewGrade.Hard
    case 'Good': return ReviewGrade.Good
    case 'Easy': return ReviewGrade.Easy
    case 'Perfect': return ReviewGrade.Perfect
    default: return 2
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                    Given                                   */
  /* -------------------------------------------------------------------------- */

  given('Review deck has the following cards:', (cards) => {
    for (const cardLine of cards) {
      const verse = getVerse(cardLine['Verse'])
      const card = new ReviewCardBuilder()
        .ofType(getReviewCardType(cardLine['Type']))
        .ofVerse(verse.id)
        .dueTo(new Date(cardLine['Due To']))
        .build()
      context.app.reviewDeck.addCard(card)
    }
  })

  /* -------------------------------------------------------------------------- */
  /*                                    When                                    */
  /* -------------------------------------------------------------------------- */

  when(/^I review card "(.*)" "(.*)" with mark "(.*)"$/, (_verse: string, _type: string, _mark: string) => {
    const verse = getVerse(_verse)
    const type = getReviewCardType(_type)
    const card = context.app.reviewDeck.getVerseCards(verse.id, type)[0]
    context.app.reviewDeck.reviewCard(card, getMark(_mark))
  })

  /* -------------------------------------------------------------------------- */
  /*                                    Then                                    */
  /* -------------------------------------------------------------------------- */

  then('Review deck contains the following cards:', (cards) => {
    expect(context.app.reviewDeck.cards.length).toEqual(cards.length)

    for (const card of cards) {
      const verse = getVerse(card['Verse Number'])
      const f = context.app.reviewDeck.getVerseCards(
        verse.id, getReviewCardType(card['Card Type'])
      )
      expect(f).toHaveLength(1)
      expect(f[0].dueTo.toLocaleDateString('en-ZA')).toEqual(card['Due To'])
    }
  })

  then('Review deck contains no cards', () => {
    expect(context.app.reviewDeck.isEmpty).toBeTruthy()
  })

  then(/^I see no cards for review on "(.*)"$/, (date: string) => {
    expect(
      context.app.reviewDeck.dueToCards(new Date(date)).length
    ).toEqual(0)
  })

  then(/^I see the following cards for review on "(.*)":$/, (date: string, cards) => {
    expect(
      context.app.reviewDeck.dueToCards(new Date(date)).length
    ).toEqual(cards.length)

    for (const card of cards) {
      const verse = getVerse(card['Verse'])
      const f = context.app.reviewDeck.getVerseCards(
        verse.id,
        getReviewCardType(card['Type']),
        new Date(date)
      )
      expect(f).toHaveLength(1)
    }
  })

}
