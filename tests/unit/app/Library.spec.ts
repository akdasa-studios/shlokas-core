import { InMemoryRepository, Repository } from '@akdasa-studios/framework'
import { Library } from '@lib/app/Library'
import {
  Decks, Language, Verse, VerseId, VerseQueries,
  VerseStatus, VerseStatusId
} from '@lib/models'
import { createVerse, createVerseNumber } from '@tests/env'


describe('Library', () => {
  const english = new Language('en', 'EN')
  const serbian = new Language('rs', 'RS')
  let versesRepository: Repository<Verse>
  let verseStatusesRepository: Repository<VerseStatus>
  let library: Library

  beforeEach(() => {
    versesRepository = new InMemoryRepository<Verse>()
    verseStatusesRepository = new InMemoryRepository<VerseStatus>()
    library = new Library(versesRepository, verseStatusesRepository)
  })

  /* -------------------------------------------------------------------------- */
  /*                                     all                                    */
  /* -------------------------------------------------------------------------- */

  describe('all', () => {
    it('returns empty array if library is empty', async () => {
      expect(await library.all(english)).toHaveLength(0)
    })

    it('returns all the verses of the specific language', async () => {
      await library.addVerse(createVerse('BG 1.1', english.code))

      const englishVerses = await library.all(english)
      const serbianVerses = await library.all(serbian)

      expect(englishVerses).toHaveLength(1)
      expect(serbianVerses).toHaveLength(0)
      expect(englishVerses[0].number.toString()).toEqual('BG 1.1')
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                  addVerse                                  */
  /* -------------------------------------------------------------------------- */

  describe('addVerse', () => {
    it('should add a verse to the library', async () => {
      const verse = createVerse('BG 1.1')
      const verseNumber = createVerseNumber('BG 1.1')

      const addVerse = await library.addVerse(verse)
      const getVerse = await library.getByNumber(english, verseNumber)

      expect(addVerse.isSuccess).toBeTruthy()
      expect(getVerse.isSuccess).toBeTruthy()
      expect(getVerse.value.number.toString()).toEqual('BG 1.1')
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                  getByNumber                               */
  /* -------------------------------------------------------------------------- */

  describe('getByNumber', () => {
    it('should return a failure if the verse is not found', async () => {
      const verseNumber = createVerseNumber('BG 1.1')
      const result = await library.getByNumber(english, verseNumber)

      expect(result.isFailure).toBeTruthy()
      expect(result.error).toBe('Verse not found: ' + verseNumber.value)
    })

    it('should return a success if the verse is found', async () => {
      await library.addVerse(createVerse('BG 1.1'))
      await library.addVerse(createVerse('BG 2.13'))
      await library.addVerse(createVerse('BG 2.20'))

      const result = await library.getByNumber(english, 'BG 2.13')
      expect(result.isSuccess).toBeTruthy()
      expect(result.value.number.value).toBe('BG 2.13')
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                    getById                                 */
  /* -------------------------------------------------------------------------- */

  describe('getById', () => {
    it('should return the verse if it is found', async () => {
      const verse = createVerse('BG 1.1')
      await library.addVerse(verse)

      const result = await library.getById(verse.id)
      expect(result.isSuccess).toBeTruthy()
      expect(result.value.id).toBe(verse.id)
    })

    it('should return error if the verse is not found', async () => {
      const notFoundId = new VerseId()
      await library.addVerse(createVerse('BG 1.1'))

      const result = await library.getById(notFoundId)
      expect(result.isSuccess).toBeFalsy()
      expect(result.error).toBe(`Entity '${notFoundId.value}' not found`)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                    find                                    */
  /* -------------------------------------------------------------------------- */

  describe('.find', () => {
    it('should return verses that match the query', async () => {
      await library.addVerse(createVerse('BG 1.1'))
      await library.addVerse(createVerse('BG 2.13'))
      await library.addVerse(createVerse('BG 2.20'))

      const result = await library.find(VerseQueries.number('BG 2.13'))
      expect(result.length).toBe(1)
      expect(result[0].number.value).toBe('BG 2.13')
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                    getStatus                              */
  /* -------------------------------------------------------------------------- */

  describe('getStatus', () => {
    it('should return the status of the verse', async () => {
      const verse = (await library.addVerse(createVerse('BG 1.1'))).value
      await verseStatusesRepository.save(
        new VerseStatus(new VerseStatusId(), verse.id, Decks.None)
      )

      const result = await library.getStatus(verse.id)
      expect(result.isSuccess).toBeTruthy()
      expect(result.value.verseId).toBe(verse.id)
    })

    it('should create a new status if it does not exist', async () => {
      const verse = createVerse('BG 1.1')
      await library.addVerse(verse)

      const result = await library.getStatus(verse.id)
      expect(result.isSuccess).toBeTruthy()
      expect(result.value.verseId).toBe(verse.id)
      expect(result.value.inDeck).toEqual(Decks.None)
    })
  })
})