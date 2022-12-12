import { InMemoryRepository } from '@akdasa-studios/framework'
import { Application } from '@lib/app/Application'
import { InboxCardMemorized } from '@lib/commands/inbox'
import { InboxCard } from '@lib/models/cards'
import { Verse, VerseId } from '@lib/models/verse'


describe('InboxCardMemorized', () => {

  /* -------------------------------------------------------------------------- */
  /*                                   Context                                  */
  /* -------------------------------------------------------------------------- */

  let context: Application
  let verse1Id: VerseId
  let verse1InboxCards: readonly InboxCard[]

  beforeEach(() => {
    context = new Application(new InMemoryRepository<Verse>())
    verse1Id = new VerseId()
    verse1InboxCards = context.inboxDeck.addVerse(verse1Id)
  })


  /* -------------------------------------------------------------------------- */
  /*                                   execute                                  */
  /* -------------------------------------------------------------------------- */

  describe('.execute', () => {
    it('removes memorized card from inbox deck', () => {
      const command = new InboxCardMemorized(verse1InboxCards[0])
      const result = command.execute(context)

      expect(result.isSuccess).toBe(true)
      expect(context.inboxDeck.cards).toEqual([
        verse1InboxCards[1]
      ])
    })
  })


  /* -------------------------------------------------------------------------- */
  /*                                    revert                                  */
  /* -------------------------------------------------------------------------- */

  describe('.revert', () => {
    it('adds removed card', () => {
      const command = new InboxCardMemorized(verse1InboxCards[0])
      command.execute(context)
      command.revert(context)

      expect(context.inboxDeck.cards).toEqual([
        verse1InboxCards[1], verse1InboxCards[0]
      ])
    })
  })
})