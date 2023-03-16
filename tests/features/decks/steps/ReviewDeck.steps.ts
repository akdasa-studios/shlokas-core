import { ReviewCardReviewed } from './../../../../lib/commands/review/ReviewCardReviewed'
import { ReviewCardBuilder, ReviewCardQueries, ReviewCardType, ReviewGrade } from '@lib/models'
import { StepDefinitions } from 'jest-cucumber'
import { contexts, getContext } from '@tests/features/context'


export const reviewDeckSteps: StepDefinitions = ({ given, when, then }) => {
  const { ofVerse, ofType, dueTo, queryBuilder } = ReviewCardQueries
  async function findVerse(verseNumber: string) {
    const verse = await contexts.$.library.getByNumber(
      contexts.$.settings.language, verseNumber
    )
    return verse
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
      await contexts.$.reviewDeck.addCard(card)
    }
  })

  /* -------------------------------------------------------------------------- */
  /*                                    When                                    */
  /* -------------------------------------------------------------------------- */

  when(/^I review card "(.*)" "(.*)" with mark "(.*)"$/, async (_verse: string, _type: string, _mark: string) => {
    const type =  getReviewCardType(_type)
    const verse = await findVerse(_verse)
    const card = (await contexts.$.reviewDeck.findCards(ofVerse(verse.id), ofType(type)))[0]
    await contexts.$.processor.execute(new ReviewCardReviewed(card, getMark(_mark)))
  })

  /* -------------------------------------------------------------------------- */
  /*                                    Then                                    */
  /* -------------------------------------------------------------------------- */

  /**
   * Check that the review deck contains the expected cards
   * @param device Device name (optional)
   * @param cards List of cards
   * @example Review deck contains the following cards:
   *          | Verse Number | Card Type      | Due To     |
   *          | BG 1.1       | Number -> Text | 2020-01-01 |
   *          | BG 1.2       | Text -> Number | 2020-01-02 |
   */
  then(
    /^Review deck contains the following cards(?: on "(.*)")?:$/,
    async (device, cards) =>
    {
      const ctx = getContext(device)
      expect(await ctx.reviewDeck.cardsCount()).toEqual(cards.length)

      for (const card of cards) {
        const verse = await findVerse(card['Verse Number'])
        const f = await ctx.reviewDeck.findCards(
          ofVerse(verse.id),
          ofType(getReviewCardType(card['Card Type']))
        )
        expect(f).toHaveLength(1)

        if (card['Due To']) {
          expect(f[0].dueTo).toEqual(new Date(card['Due To']))
        }
      }
    })

  then('Review deck contains no cards', () => {
    expect(contexts.$.reviewDeck.isEmpty).toBeTruthy()
  })

  then(/^I see no cards for review on "(.*)"$/, async (date: string) => {
    expect(
      (await contexts.$.reviewDeck.dueToCards(new Date(date))).length
    ).toEqual(0)
  })

  then(/^I see the following cards for review on "(.*)":$/, async (date: string, cards) => {
    expect(
      (await contexts.$.reviewDeck.dueToCards(new Date(date))).length
    ).toEqual(cards.length)

    for (const card of cards) {
      const verse = await findVerse(card['Verse'])
      const f = await contexts.$.reviewDeck.findCards(queryBuilder.and(
        ofVerse(verse.id),
        ofType(getReviewCardType(card['Type'])),
        dueTo(new Date(date))
      ))
      expect(f).toHaveLength(1)
    }
  })

}
