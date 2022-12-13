import { InMemoryRepository, Repository } from '@akdasa-studios/framework'
import { Library } from '@lib/app/Library'
import { Verse, VerseBuilder, VerseId, VerseNumber, VerseQueries } from '@lib/models'

describe('Library', () => {
  let versesRepository: Repository<Verse>
  let library: Library

  function getVerseNumber(verseNumberStr: string): VerseNumber {
    return new VerseNumber(verseNumberStr)
  }

  function getVerse(verseNumberStr: string): Verse {
    const verseNumber = getVerseNumber(verseNumberStr)
    return new VerseBuilder().withNumber(verseNumber).build().value
  }

  beforeEach(() => {
    versesRepository = new InMemoryRepository<Verse>()
    library = new Library(versesRepository)
  })

  /* -------------------------------------------------------------------------- */
  /*                                  addVerse                                  */
  /* -------------------------------------------------------------------------- */

  describe('addVerse', () => {
    it('should add a verse to the library', () => {
      const verseNumber = getVerseNumber('BG 1.1')
      const verse = getVerse('BG 1.1')
      const result = library.addVerse(verse)
      expect(result.isSuccess).toBeTruthy()
      expect(library.getByNumber(verseNumber).isSuccess).toBeTruthy()
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                  getByNumber                               */
  /* -------------------------------------------------------------------------- */

  describe('getByNumber', () => {
    it('should return a failure if the verse is not found', () => {
      const verseNumber = getVerseNumber('BG 1.1')
      const result = library.getByNumber(verseNumber)
      expect(result.isFailure).toBeTruthy()
      expect(result.error).toBe('Verse not found: ' + verseNumber.value)
    })

    it('should return a success if the verse is found', () => {
      library.addVerse(getVerse('BG 1.1'))
      library.addVerse(getVerse('BG 2.13'))
      library.addVerse(getVerse('BG 2.20'))

      const result = library.getByNumber('BG 2.13')
      expect(result.isSuccess).toBeTruthy()
      expect(result.value.number.value).toBe('BG 2.13')
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                    getById                                 */
  /* -------------------------------------------------------------------------- */

  describe('getById', () => {
    it('should return the verse if it is found', () => {
      const verse = getVerse('BG 1.1')
      library.addVerse(verse)

      const result = library.getById(verse.id)
      expect(result.isSuccess).toBeTruthy()
      expect(result.value.id).toBe(verse.id)
    })

    it('should return error if the verse is not found', () => {
      const notFoundId = new VerseId()
      library.addVerse(getVerse('BG 1.1'))

      const result = library.getById(notFoundId)
      expect(result.isSuccess).toBeFalsy()
      expect(result.error).toBe('Verse not found: ' + notFoundId.value)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                    find                                    */
  /* -------------------------------------------------------------------------- */

  describe('.find', () => {
    // it('should return all verses if no query is provided', () => {
    //   library.addVerse(getVerse('BG 1.1'))
    //   library.addVerse(getVerse('BG 2.13'))
    //   library.addVerse(getVerse('BG 2.20'))

    //   const result = library.find()
    //   expect(result.length).toBe(3)
    // })

    it('should return verses that match the query', () => {
      library.addVerse(getVerse('BG 1.1'))
      library.addVerse(getVerse('BG 2.13'))
      library.addVerse(getVerse('BG 2.20'))

      const result = library.find(VerseQueries.byNumber('BG 2.13'))
      expect(result.length).toBe(1)
      expect(result[0].number.value).toBe('BG 2.13')
    })
  })
})