import { VerseNumber, VerseNumberBuilder } from '@lib/models/verse'

describe('VerseNumber', () => {
  describe('constructor', () => {
    it('should throw an error if sections is empty', () => {
      expect(() => new VerseNumber([])).toThrowError('sections must contain at least one section')
    })

    it('should throw an error if sections contains empty sections', () => {
      expect(() => new VerseNumber(['1', '', '3'])).toThrowError('sections must not contain empty sections')
    })

    it('should create a new instance of VerseNumber class', () => {
      expect(new VerseNumber(['1'])).toBeInstanceOf(VerseNumber)
    })

    it('should set the sections property', () => {
      expect(new VerseNumber(['1']).sections).toEqual(['1'])
    })
  })

  describe('.toString()', () => {
    it('should return the verse number as a string', () => {
      expect(new VerseNumber(['1', '2']).toString()).toEqual('1.2')
    })

    it('should return the verse number as a string', () => {
      expect(new VerseNumber(['1', '2']).toString()).toEqual('1.2')
    })

    it('should separate numbers and text parts', () => {
      expect(new VerseNumber(['SB', '1', '2']).toString()).toEqual('SB 1.2')
    })

    it('should separate numbers and text parts even if there are multiple text parts', () => {
      expect(new VerseNumber(['CC', 'Adi', '1', '2']).toString()).toEqual('CC Adi 1.2')
    })
  })

  describe('.equals()', () => {
    it('should return true if sections are equal', () => {
      const vn1 = new VerseNumber(['1', '2'])
      const vn2 = new VerseNumber(['1', '2'])
      expect(vn1.equals(vn2)).toBe(true)
      expect(vn2.equals(vn1)).toBe(true)
    })

    it('should return false if sections are not equal', () => {
      const vn1 = new VerseNumber(['1', '2'])
      const vn2 = new VerseNumber(['1', '3'])
      expect(vn1.equals(vn2)).toBe(false)
      expect(vn2.equals(vn1)).toBe(false)
    })

    it('should return false if length of sections are not equal', () => {
      const vn1 = new VerseNumber(['1', '2'])
      const vn2 = new VerseNumber(['1', '2', 'e', 'z'])
      expect(vn1.equals(vn2)).toBe(false)
      expect(vn2.equals(vn1)).toBe(false)
    })
  })
})


describe('VerseNumberBuilder', () => {
  it('should return failure if sections are not set', () => {
    const result = new VerseNumberBuilder().build()
    expect(result.isFailure).toBe(true)
  })
})