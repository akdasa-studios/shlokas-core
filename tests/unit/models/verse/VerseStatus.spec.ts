import { Decks, VerseId, VerseStatus } from '@lib/models/verse'

describe('VerseStatus', () => {
  describe('.equals()', () => {
    it('should return true if statuses are equal', () => {
      const verseId = new VerseId()
      const vs1 = new VerseStatus(verseId, Decks.Inbox)
      const vs2 = new VerseStatus(verseId, Decks.Inbox)
      expect(vs1.equals(vs2)).toBe(true)
    })

    it('should return false if decks are not equal', () => {
      const verseId = new VerseId()
      const vs1 = new VerseStatus(verseId, Decks.Inbox)
      const vs2 = new VerseStatus(verseId, Decks.Review)
      expect(vs1.equals(vs2)).toBe(false)
    })

    it('should return false if verses are not equal', () => {
      const verseId = new VerseId()
      const vs1 = new VerseStatus(verseId, Decks.Inbox)
      const vs2 = new VerseStatus(new VerseId(), Decks.Inbox)
      expect(vs1.equals(vs2)).toBe(false)
    })
  })
})
