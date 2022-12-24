import { Application } from '@lib/app/Application'
import { InboxCardMemorized } from '@lib/commands/inbox'
import { InboxCard, ReviewCardType } from '@lib/models/cards'
import { VerseId } from '@lib/models/verse'
import { createApplication } from '../env'


describe('InboxCardMemorized', () => {

  /* -------------------------------------------------------------------------- */
  /*                                   Context                                  */
  /* -------------------------------------------------------------------------- */

  let context: Application
  let verse1Id: VerseId
  let verse1InboxCards: readonly InboxCard[]

  beforeEach(() => {
    context = createApplication()
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

    it('adds two cards to the review deck if only one card from inbox deck was memorized', () => {
      const command = new InboxCardMemorized(verse1InboxCards[0])
      const result = command.execute(context)

      expect(result.isSuccess).toBe(true)
      expect(context.reviewDeck.cards).toHaveLength(2)
      expect(context.reviewDeck.cards.map(c => c.type)).toEqual([
        ReviewCardType.NumberToTranslation,
        ReviewCardType.TranslationToNumber
      ])
    })

    it('adds six cards to the review deck if all cards from inbox deck were memorized', () => {
      const command1 = new InboxCardMemorized(verse1InboxCards[0])
      const command2 = new InboxCardMemorized(verse1InboxCards[0])
      command1.execute(context)
      command2.execute(context)
      expect(context.reviewDeck.cards).toHaveLength(6)
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