import { Application } from '@lib/app/Application'
import { ReviewCardReviewed } from '@lib/commands'
import { ReviewGrade } from '@lib/models'
import { ReviewCard, ReviewCardType } from '@lib/models/cards'
import { VerseId } from '@lib/models/verse'
import { createApplication } from '@tests/env'


describe('ReviewCardReviewed', () => {

  /* -------------------------------------------------------------------------- */
  /*                                   Context                                  */
  /* -------------------------------------------------------------------------- */

  let context: Application
  let reviewCard: ReviewCard
  let now: Date

  beforeEach(async () => {
    now = new Date()
    context = createApplication()
    reviewCard = new ReviewCard(
      new VerseId(),
      ReviewCardType.NumberToText,
      new Date(now), new Date(now)
    )
    await context.reviewDeck.addCard(reviewCard)
  })


  /* -------------------------------------------------------------------------- */
  /*                                   execute                                  */
  /* -------------------------------------------------------------------------- */

  describe('.execute', () => {
    it('changes stats of a card', async () => {
      const command = new ReviewCardReviewed(reviewCard, ReviewGrade.Good)
      const result = await command.execute(context)

      expect(result.isSuccess).toBe(true)
      expect(reviewCard.interval).not.toEqual(0)
      expect(reviewCard.dueTo.getTime()).toBeGreaterThan(now.getTime())
    })
  })


  /* -------------------------------------------------------------------------- */
  /*                                    revert                                  */
  /* -------------------------------------------------------------------------- */

  describe('.revert', () => {
    it('restores status of a card', async () => {
      const command = new ReviewCardReviewed(reviewCard, ReviewGrade.Good)
      await command.execute(context)
      await command.revert(context)

      expect(reviewCard.interval).toEqual(0)
      expect(reviewCard.interval).toEqual(0)
      expect(reviewCard.dueTo.getTime()).toEqual(now.getTime())
    })
  })
})