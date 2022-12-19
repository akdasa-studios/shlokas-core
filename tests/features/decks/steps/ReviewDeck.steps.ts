import { ReviewCardType } from '@lib/models'
import { StepDefinitions } from 'jest-cucumber'

import { context } from '@tests/features/context'


export const reviewDeckSteps: StepDefinitions = ({ then }) => {

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
    }
  })

  then('Review deck contains no cards', () => {
    expect(context.app.reviewDeck.isEmpty).toBeTruthy()
  })
}
