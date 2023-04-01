import { Application } from '@lib/app/Application'
import { RemoveVerseFromInboxDeck } from '@lib/commands/inbox'
import { InboxCardType } from '@lib/models/cards'
import { VerseId } from '@lib/models/verse'
import { createApplication } from '@tests/env'


describe('RemoveVerseFromInboxDeck', () => {

  /* -------------------------------------------------------------------------- */
  /*                                   Context                                  */
  /* -------------------------------------------------------------------------- */

  let app: Application
  let verse1Id: VerseId
  let verse2Id: VerseId

  beforeEach(async () => {
    app = createApplication()
    verse1Id = new VerseId()
    verse2Id = new VerseId()
    await app.inboxDeck.addVerse(verse1Id)
    await app.inboxDeck.addVerse(verse2Id)
  })


  /* -------------------------------------------------------------------------- */
  /*                                   execute                                  */
  /* -------------------------------------------------------------------------- */

  describe('.execute', () => {
    it('removes translation and text cards from the inbox deck', async () => {
      const command = new RemoveVerseFromInboxDeck(verse2Id)
      const result = await app.execute(command)

      expect(result.commandResult.isSuccess).toBe(true)
      expect(result.commandResult.value).toHaveLength(2)
      expect(result.commandResult.value.map(x => x.type)).toEqual([
        InboxCardType.Translation,
        InboxCardType.Text
      ])

      const allCards = await app.inboxDeck.cards()
      expect(allCards).toHaveLength(2)
      expect(allCards.map(x => x.verseId)).toEqual([
        verse1Id, verse1Id
      ])
    })
  })


  /* -------------------------------------------------------------------------- */
  /*                                    revert                                  */
  /* -------------------------------------------------------------------------- */

  describe('.revert', () => {
    it('removes added cards', async () => {
      const command = new RemoveVerseFromInboxDeck(verse1Id)
      await app.execute(command)
      await app.revert()

      expect(await app.inboxDeck.cards()).toHaveLength(4)
    })
  })
})