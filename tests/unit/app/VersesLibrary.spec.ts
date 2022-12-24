import { InMemoryRepository, Repository } from '@akdasa-studios/framework'
import { Library } from '@lib/app/Library'
import { Decks, Verse, VerseBuilder, VerseId, VerseNumber, VerseQueries, VerseStatus, VerseStatusId, Language } from '@lib/models'

describe('Library', () => {
  const english = new Language('en', 'EN')
  const serbian = new Language('rs', 'RS')
  let versesRepository: Repository<Verse>
  let verseStatusesRepository: Repository<VerseStatus>
  let library: Library

  function getVerseNumber(verseNumberStr: string): VerseNumber {
    return new VerseNumber(verseNumberStr)
  }

  function getVerse(verseNumberStr: string): Verse {
    const verseNumber = getVerseNumber(verseNumberStr)
    return new VerseBuilder().ofLanguage(english).withNumber(verseNumber).build().value
  }

  beforeEach(() => {
    versesRepository = new InMemoryRepository<Verse>()
    verseStatusesRepository = new InMemoryRepository<VerseStatus>()
    library = new Library(versesRepository, verseStatusesRepository)
  })

  /* -------------------------------------------------------------------------- */
  /*                                     all                                    */
  /* -------------------------------------------------------------------------- */

  describe('all', () => {
    it('returns empty array if library is empty', () => {
      expect(library.all(english)).toHaveLength(0)
    })

    it('returns all the verses of the specific language', () => {
      library.addVerse(getVerse('BG 1.1'))
      expect(library.all(english)).toHaveLength(1)
      expect(library.all(english)[0].number.toString()).toEqual('BG 1.1')
      expect(library.all(serbian)).toHaveLength(0)
    })
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
      expect(library.getByNumber(english, verseNumber).isSuccess).toBeTruthy()
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                  getByNumber                               */
  /* -------------------------------------------------------------------------- */

  describe('getByNumber', () => {
    it('should return a failure if the verse is not found', () => {
      const verseNumber = getVerseNumber('BG 1.1')
      const result = library.getByNumber(english, verseNumber)
      expect(result.isFailure).toBeTruthy()
      expect(result.error).toBe('Verse not found: ' + verseNumber.value)
    })

    it('should return a success if the verse is found', () => {
      library.addVerse(getVerse('BG 1.1'))
      library.addVerse(getVerse('BG 2.13'))
      library.addVerse(getVerse('BG 2.20'))

      const result = library.getByNumber(english, 'BG 2.13')
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
      expect(result.error).toBe(`Entity '${notFoundId.value}' not found`)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                    find                                    */
  /* -------------------------------------------------------------------------- */

  describe('.find', () => {
    it('should return verses that match the query', () => {
      library.addVerse(getVerse('BG 1.1'))
      library.addVerse(getVerse('BG 2.13'))
      library.addVerse(getVerse('BG 2.20'))

      const result = library.find(VerseQueries.number('BG 2.13'))
      expect(result.length).toBe(1)
      expect(result[0].number.value).toBe('BG 2.13')
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                    getStatus                              */
  /* -------------------------------------------------------------------------- */

  describe('getStatus', () => {
    it('should return the status of the verse', () => {
      const verse = library.addVerse(getVerse('BG 1.1')).value
      verseStatusesRepository.save(
        new VerseStatus(new VerseStatusId(), verse.id, Decks.None)
      )

      const result = library.getStatus(verse.id)
      expect(result.isSuccess).toBeTruthy()
      expect(result.value.verseId).toBe(verse.id)
    })

    it('should create a new status if it does not exist', () => {
      const verse = getVerse('BG 1.1')
      library.addVerse(verse)

      const result = library.getStatus(verse.id)
      expect(result.isSuccess).toBeTruthy()
      expect(result.value.verseId).toBe(verse.id)
      expect(result.value.inDeck).toEqual(Decks.None)
    })
  })
})