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

    it('should create a new instance of Language class', () => {
      expect(new Language('en', 'English')).toBeInstanceOf(Language)
    })

    it('should set the code property', () => {
      expect(new Language('en', 'English').code).toEqual('en')
    })

    it('should set the name property', () => {
      expect(new Language('en', 'English').name).toEqual('English')
    })

    it('should create a new instance of Language class with the given code and name', () => {
      const lang = new Language('en', 'English')
      expect(lang.code).toEqual('en')
      expect(lang.name).toEqual('English')
    })
  })
})
