import { Application } from '@lib/app/Application'
import { UpdateVerseStatus } from '@lib/commands'
import { Decks, NoStatus, VerseId, VerseStatus, VerseStatusId } from '@lib/models'
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
    })

    it('updates status', async () => {
      const status = new VerseStatus(new VerseStatusId(), verse1Id, Decks.Inbox)
      await context.repositories.verseStatuses.save(status)

      const command = new UpdateVerseStatus(verse1Id)
      await command.execute(context)

      const newStatus = await context.library.getStatus(verse1Id)
      expect(newStatus.equals(NoStatus)).toBeFalsy()
      expect(newStatus.verseId.value).toEqual(verse1Id.value)
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