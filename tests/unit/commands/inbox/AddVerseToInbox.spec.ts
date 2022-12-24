import { Application } from '@lib/app/Application'
import { AddVerseToInboxDeck } from '@lib/commands/inbox'
import { InboxCardType } from '@lib/models/cards'
import { VerseId } from '@lib/models/verse'
import { createApplication } from '../env'


describe('AddVerseToInbox', () => {

  /* -------------------------------------------------------------------------- */
  /*                                   Context                                  */
  /* -------------------------------------------------------------------------- */

  let context: Application
  let verseId: VerseId

  beforeEach(() => {
    context = createApplication()
    verseId = new VerseId()
  })


  /* -------------------------------------------------------------------------- */
  /*                                   execute                                  */
  /* -------------------------------------------------------------------------- */

  describe('.execute', () => {
    it('adds translation and text cards to the inbox deck', () => {
      const command = new AddVerseToInboxDeck(verseId)
      const result = command.execute(context)

      expect(result.isSuccess).toBe(true)
      expect(result.value).toHaveLength(2)
      expect(result.value.map(x => x.type)).toEqual([
        InboxCardType.Translation,
        InboxCardType.Text
      ])
      expect(context.inboxDeck.cards).toHaveLength(2)
    })
  })


  /* -------------------------------------------------------------------------- */
  /*                                    revert                                  */
  /* -------------------------------------------------------------------------- */

  describe('.revert', () => {
    it('removes added cards', () => {
      const command1 = new AddVerseToInboxDeck(new VerseId())
      const command2 = new AddVerseToInboxDeck(new VerseId())

      const result1 = command1.execute(context)
      const result2 = command2.execute(context)

      command1.revert(context)

      expect(context.inboxDeck.cards).toHaveLength(2)
      expect(context.inboxDeck.cards).toEqual(result2.value)
      expect(context.inboxDeck.cards).not.toContain(result1.value)
    })
  })
})