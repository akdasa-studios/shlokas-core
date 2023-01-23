import { Application } from '@lib/app/Application'
import { UpdateVerseStatus } from '@lib/commands'
import { Decks, NoStatus, VerseId } from '@lib/models'
import { ReviewCardBuilder, ReviewCardType } from '@lib/models/cards/ReviewCard'
import { createApplication } from '@tests/env'


describe('UpdateVerseStatus', () => {

  /* -------------------------------------------------------------------------- */
  /*                                   Context                                  */
  /* -------------------------------------------------------------------------- */

  let context: Application
  let verse1Id: VerseId

  beforeEach(() => {
    context = createApplication()
    verse1Id = new VerseId()
  })


  /* -------------------------------------------------------------------------- */
  /*                                   execute                                  */
  /* -------------------------------------------------------------------------- */

  describe('.execute', () => {
    it('creates a new status if does not exist', async () => {
      const command = new UpdateVerseStatus(verse1Id)
      await command.execute(context)

      const newStatus = await context.library.getStatus(verse1Id)
      expect(newStatus.equals(NoStatus)).toBeFalsy()
      expect(newStatus.verseId.value).toEqual(verse1Id.value)
    })

    describe('updates inDeck', () => {
      it('updates status for inbox deck', async () => {
        await context.inboxDeck.addVerse(verse1Id)
        const command = new UpdateVerseStatus(verse1Id)
        await command.execute(context)

        const newStatus = await context.library.getStatus(verse1Id)
        expect(newStatus.inDeck).toEqual(Decks.Inbox)
      })

      it('updates status for review deck', async () => {
        console.log(ReviewCardBuilder)
        const reviewCard = (
          new ReviewCardBuilder()
            .ofVerse(verse1Id)
            .ofType(ReviewCardType.NumberToText)
            .build())
        await context.reviewDeck.addCard(reviewCard)
        const command = new UpdateVerseStatus(verse1Id)
        await command.execute(context)

        const newStatus = await context.library.getStatus(verse1Id)
        expect(newStatus.inDeck).toEqual(Decks.Review)
      })
    })
  })


  /* -------------------------------------------------------------------------- */
  /*                                    revert                                  */
  /* -------------------------------------------------------------------------- */

  describe('.revert', () => {
    // it('adds removed card', async () => {
    //   const command = new InboxCardMemorized(verse1InboxCards[0])
    //   await command.execute(context)
    //   await command.revert(context)

    //   expect(await context.inboxDeck.cards()).toEqual([
    //     verse1InboxCards[0],
    //     verse1InboxCards[1],
    //   ])
    // })
  })
})