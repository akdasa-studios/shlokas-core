import { Language } from '@lib/models'

describe('Language', () => {
  describe('constructor', () => {
    it('should throw an error if code is not provided', () => {
      expect(() => new Language('', 'English')).toThrowError('code is required')
    })

    it('should throw an error if name is not provided', () => {
      expect(() => new Language('en', '')).toThrowError('name is required')
    })

    it('should throw an error if code is less than 2 characters long', () => {
      expect(() => new Language('e', 'English')).toThrowError('code must be at least 2 characters long')
    })

    it('should throw an error if code is more than 5 characters long', () => {
      expect(() => new Language('too_loong', 'English')).toThrowError('code must be at most 5 characters long')
    })

    it('should create a new instance of Language class with the given code and name', () => {
      const lang = new Language('en_EN', 'English')
      expect(lang).toBeInstanceOf(Language)
      expect(lang.code).toEqual('en_EN')
      expect(lang.name).toEqual('English')
    })
  })
})
