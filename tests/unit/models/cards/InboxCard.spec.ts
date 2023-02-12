import { InboxCard, InboxCardType } from '@lib/models'
import { createVerse } from '@tests/env'

describe('InboxCard', () => {

  let inboxCard: InboxCard

  beforeEach(() => {
    inboxCard = new InboxCard(
      createVerse('BG 1.1').id,
      InboxCardType.Text,
      new Date('2020-01-01')
    )
  })

  describe('.constructor()', () => {
    test('sets type', () => {
      expect(inboxCard.type).toBeDefined()
    })

    test('sets id', () => {
      expect(inboxCard.id).toBeDefined()
    })

    test('sets id based on verseId and type', () => {
      const verseId = createVerse('BG 1.1').id
      const card = new InboxCard(
        verseId, InboxCardType.Text, new Date('2020-01-01')
      )
      const card2 = new InboxCard(
        verseId, InboxCardType.Text, new Date('2020-01-01')
      )
      expect(card.id).toEqual(card2.id)
    })
  })

  describe('.memorized()', () => {
    it('sets memorizedAt date', () => {
      inboxCard.memorized()
      expect(inboxCard.memorizedAt).toBeDefined()
      expect(inboxCard.isMemorized).toBeTruthy()
    })
  })


  describe('.forget()', () => {
    it('sets memorizedAt date', () => {
      inboxCard.memorized()
      inboxCard.forget()
      expect(inboxCard.memorizedAt).not.toBeDefined()
      expect(inboxCard.isMemorized).toBeFalsy()
    })
  })

  describe('.isMemorized', () => {
    it('returns true if memorizedAt is set', () => {
      inboxCard.memorized()
      expect(inboxCard.isMemorized).toBeTruthy()
    })

    it('returns false if memorizedAt is not set', () => {
      expect(inboxCard.isMemorized).toBeFalsy()
    })
  })

  describe('.memorizedAt', () => {
    it('returns memorizedAt date', () => {
      inboxCard.memorized()
      expect(inboxCard.memorizedAt).toBeDefined()
    })

    it('returns undefined if not memorized', () => {
      expect(inboxCard.memorizedAt).not.toBeDefined()
    })
  })

  describe('.addedAt', () => {
    it('returns addedAt date', () => {
      expect(inboxCard.addedAt).toBeDefined()
    })
  })

})