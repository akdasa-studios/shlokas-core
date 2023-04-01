import { Application } from '@lib/app/Application'
import { AddVerseToInboxDeck } from '@lib/commands/inbox'
import { InboxCardType } from '@lib/models/cards'
import { VerseId } from '@lib/models/verse'
import { createApplication } from '@tests/env'


describe('AddVerseToInbox', () => {

  /* -------------------------------------------------------------------------- */
  /*                                   Context                                  */
  /* -------------------------------------------------------------------------- */

  let app: Application
  let verseId: VerseId

  beforeEach(() => {
    app = createApplication()
    verseId = new VerseId()
  })


  /* -------------------------------------------------------------------------- */
  /*                                   execute                                  */
  /* -------------------------------------------------------------------------- */

  describe('.execute', () => {
    it('adds translation and text cards to the inbox deck', async () => {
      const command = new AddVerseToInboxDeck(verseId)
      const result = await app.execute(command)

      expect(result.commandResult.isSuccess).toBe(true)
      expect(result.commandResult.value).toHaveLength(2)
      expect(result.commandResult.value.map(x => x.type)).toEqual([
        InboxCardType.Translation,
        InboxCardType.Text
      ])
      expect(await app.inboxDeck.cards()).toHaveLength(2)
    })
  })


  /* -------------------------------------------------------------------------- */
  /*                                    revert                                  */
  /* -------------------------------------------------------------------------- */

  describe('.revert', () => {
    it('removes added cards', async () => {
      const command1 = new AddVerseToInboxDeck(new VerseId())
      const command2 = new AddVerseToInboxDeck(new VerseId())

      const result1 = await app.execute(command1)
      const result2 = await app.execute(command2)

      await app.revert()

      expect(await app.inboxDeck.cards()).toHaveLength(2)
      expect(await app.inboxDeck.cards()).toEqual(result1.value)
      expect(await app.inboxDeck.cards()).not.toContain(result2.value)
    })
  })
})