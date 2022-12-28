import { Application } from '@lib/app/Application'
import { RemoveVerseFromInboxDeck } from '@lib/commands/inbox'
import { InboxCardType } from '@lib/models/cards'
import { VerseId } from '@lib/models/verse'
import { createApplication } from '../env'


describe('RemoveVerseFromInboxDeck', () => {

  /* -------------------------------------------------------------------------- */
  /*                                   Context                                  */
  /* -------------------------------------------------------------------------- */

  let context: Application
  let verse1Id: VerseId
  let verse2Id: VerseId

  beforeEach(async () => {
    context = createApplication()
    verse1Id = new VerseId()
    verse2Id = new VerseId()
    await context.inboxDeck.addVerse(verse1Id)
    await context.inboxDeck.addVerse(verse2Id)
  })


  /* -------------------------------------------------------------------------- */
  /*                                   execute                                  */
  /* -------------------------------------------------------------------------- */

  describe('.execute', () => {
    it('removes translation and text cards from the inbox deck', async () => {
      const command = new RemoveVerseFromInboxDeck(verse2Id)
      const result = await command.execute(context)

      expect(result.isSuccess).toBe(true)
      expect(result.value).toHaveLength(2)
      expect(result.value.map(x => x.type)).toEqual([
        InboxCardType.Translation,
        InboxCardType.Text
      ])

      const allCards = await context.inboxDeck.cards()
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
      await command.execute(context)
      await command.revert(context)

      expect(await context.inboxDeck.cards()).toHaveLength(4)
    })
  })
})