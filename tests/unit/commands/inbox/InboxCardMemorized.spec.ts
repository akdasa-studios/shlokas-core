import { Application } from '@lib/app/Application'
import { InboxCardMemorized } from '@lib/commands/inbox'
import { InboxCard, ReviewCardType } from '@lib/models/cards'
import { VerseId } from '@lib/models/verse'
import { createApplication } from '@tests/env'


describe('InboxCardMemorized', () => {

  /* -------------------------------------------------------------------------- */
  /*                                   Context                                  */
  /* -------------------------------------------------------------------------- */

  let app: Application
  let verse1Id: VerseId
  let verse1InboxCards: readonly InboxCard[]

  beforeEach(async () => {
    app = createApplication()
    verse1Id = new VerseId()
    verse1InboxCards = await app.inboxDeck.addVerse(verse1Id)
  })


  /* -------------------------------------------------------------------------- */
  /*                                   execute                                  */
  /* -------------------------------------------------------------------------- */

  describe('.execute', () => {
    it('removes memorized card from inbox deck', async () => {
      const command = new InboxCardMemorized(verse1InboxCards[0])
      const result = await app.execute(command)

      expect(result.isSuccess).toBe(true)
      expect(await app.inboxDeck.cards()).toEqual([
        verse1InboxCards[1]
      ])
    })

    it('adds two cards to the review deck if only one card from inbox deck was memorized', async () => {
      const command = new InboxCardMemorized(verse1InboxCards[0])
      const result = await app.execute(command)

      expect(result.isSuccess).toBe(true)
      expect(await app.reviewDeck.cards()).toHaveLength(2)
      expect((await app.reviewDeck.cards()).map(c => c.type)).toEqual([
        ReviewCardType.NumberToTranslation,
        ReviewCardType.TranslationToNumber
      ])
    })

    it('adds six cards to the review deck if all cards from inbox deck were memorized', async () => {
      const command1 = new InboxCardMemorized(verse1InboxCards[0])
      const command2 = new InboxCardMemorized(verse1InboxCards[1])
      await app.execute(command1)
      await app.execute(command2)
      expect(await app.reviewDeck.cards()).toHaveLength(6)
    })

  })


  /* -------------------------------------------------------------------------- */
  /*                                    revert                                  */
  /* -------------------------------------------------------------------------- */

  describe('.revert', () => {
    it('adds removed card', async () => {
      const command = new InboxCardMemorized(verse1InboxCards[0])
      await app.execute(command)
      await app.revert()

      expect(await app.inboxDeck.cards()).toEqual([
        verse1InboxCards[0],
        verse1InboxCards[1],
      ])
    })
  })
})