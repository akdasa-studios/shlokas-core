import { Translation } from '@lib/models/verse'

describe('Translation', () => {
  describe('constructor', () => {
    it('should throw an error if text is empty', () => {
      expect(() => new Translation('')).toThrowError('text is required')
    })

    it('should throw an error if text contains only whitespaces', () => {
      expect(() => new Translation('    ')).toThrowError('text must not be empt')
    })

    it('should create a new instance of Translation class', () => {
      expect(new Translation('text')).toBeInstanceOf(Translation)
    })
  })
})