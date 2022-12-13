import { VerseNumber } from '@lib/models/verse'

describe('VerseNumber', () => {
  describe('constructor', () => {
    it('should throw an error if sections is empty', () => {
      expect(() => new VerseNumber('')).toThrowError('Verse number cannot be empty')
    })

    it('should create a new instance of VerseNumber class', () => {
      expect(new VerseNumber('BG 1.1')).toBeInstanceOf(VerseNumber)
    })

    it('should set the sections property', () => {
      expect(new VerseNumber('1').value).toEqual('1')
    })
  })

  describe('.equals()', () => {
    it('should return true if sections are equal', () => {
      const vn1 = new VerseNumber('BG 1.1')
      const vn2 = new VerseNumber('BG 1.1')
      expect(vn1.equals(vn2)).toBe(true)
      expect(vn2.equals(vn1)).toBe(true)
    })

    it('should return false if sections are not equal', () => {
      const vn1 = new VerseNumber('BG 1.1')
      const vn2 = new VerseNumber('BG 1.2')
      expect(vn1.equals(vn2)).toBe(false)
      expect(vn2.equals(vn1)).toBe(false)
    })

    it('should return false if length of sections are not equal', () => {
      const vn1 = new VerseNumber('SB 1.1')
      const vn2 = new VerseNumber('SB 1.1.1')
      expect(vn1.equals(vn2)).toBe(false)
      expect(vn2.equals(vn1)).toBe(false)
    })
  })
})
