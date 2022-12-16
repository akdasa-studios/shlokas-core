import { InMemoryRepository } from '@akdasa-studios/framework'
import { Application, Repositories } from '@lib/app/Application'
import { RemoveVerseFromInboxDeck } from '@lib/commands/inbox'
import { InboxCardType } from '@lib/models/cards'
import { Verse, VerseId, VerseStatus } from '@lib/models/verse'


describe('RemoveVerseFromInboxDeck', () => {

  /* -------------------------------------------------------------------------- */
  /*                                   Context                                  */
  /* -------------------------------------------------------------------------- */

  let context: Application
  let verse1Id: VerseId
  let verse2Id: VerseId

  beforeEach(() => {
    context = new Application(new Repositories(
      new InMemoryRepository<Verse>(),
      new InMemoryRepository<VerseStatus>()
    ))
    verse1Id = new VerseId()
    verse2Id = new VerseId()
    context.inboxDeck.addVerse(verse1Id)
    context.inboxDeck.addVerse(verse2Id)
  })


  /* -------------------------------------------------------------------------- */
  /*                                   execute                                  */
  /* -------------------------------------------------------------------------- */

  describe('.execute', () => {
    it('removes translation and text cards from the inbox deck', () => {
      const command = new RemoveVerseFromInboxDeck(verse2Id)
      const result = command.execute(context)

      expect(result.isSuccess).toBe(true)
      expect(result.value).toHaveLength(2)
      expect(result.value.map(x => x.type)).toEqual([
        InboxCardType.Translation,
        InboxCardType.Text
      ])
      expect(context.inboxDeck.cards).toHaveLength(2)
      expect(context.inboxDeck.cards.map(x => x.verseId)).toEqual([
        verse1Id, verse1Id
      ])
    })
  })


  /* -------------------------------------------------------------------------- */
  /*                                    revert                                  */
  /* -------------------------------------------------------------------------- */

  describe('.revert', () => {
    it('removes added cards', () => {
      const command = new RemoveVerseFromInboxDeck(verse1Id)
      command.execute(context)
      command.revert(context)

      expect(context.inboxDeck.cards).toHaveLength(4)
    })
  })
})