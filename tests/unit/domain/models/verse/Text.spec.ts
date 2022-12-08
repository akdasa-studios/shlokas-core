import { Text } from '@lib/models/verse'

describe('Text', () => {
  describe('constructor', () => {
    it('should throw an error if lines is empty', () => {
      expect(() => new Text([])).toThrowError('lines must contain at least one line')
    })

    it('should throw an error if lines contains empty lines', () => {
      expect(() => new Text(['', 'line2'])).toThrowError('lines must not contain empty values')
    })

    it('should create a new instance of Text class', () => {
      expect(new Text(['line1'])).toBeInstanceOf(Text)
    })

    it('should set the lines property', () => {
      expect(new Text(['line1']).lines).toEqual(['line1'])
    })
  })
})