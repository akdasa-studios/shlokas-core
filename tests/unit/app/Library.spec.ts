import { InMemoryRepository, Repository } from '@akdasa-studios/framework'
import { Library } from '@lib/app/Library'
import {
  Decks, Declamation, Language, NoStatus, Verse, VerseId, VerseImage, VerseQueries, VerseStatus
} from '@lib/models'
import { createVerse, createVerseImage, createVerseNumber, createDeclamation } from '@tests/env'


describe('Library', () => {
  const english = new Language('en', 'EN')
  const serbian = new Language('rs', 'RS')
  let versesRepository: Repository<Verse>
  let verseStatusesRepository: Repository<VerseStatus>
  let verseImagesRepository: Repository<VerseImage>
  let declamationsRepository: Repository<Declamation>
  let library: Library

  beforeEach(() => {
    versesRepository = new InMemoryRepository<Verse>()
    verseStatusesRepository = new InMemoryRepository<VerseStatus>()
    verseImagesRepository = new InMemoryRepository<VerseImage>()
    declamationsRepository = new InMemoryRepository<Declamation>()
    library = new Library(
      versesRepository, verseStatusesRepository,
      verseImagesRepository, declamationsRepository
    )
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

      await library.addVerse(verse)
      const getVerse = await library.getByNumber(verseNumber, { lang: english })

      expect(getVerse.number.toString()).toEqual('BG 1.1')
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                  getByNumber                               */
  /* -------------------------------------------------------------------------- */

  describe('getByNumber', () => {
    it('should return a failure if the verse is not found', async () => {
      const verseNumber = createVerseNumber('BG 1.1')
      const result = () => library.getByNumber(verseNumber, { lang: english })

      await expect(result).rejects.toThrowError('Verse not found by en and ' + verseNumber.value)
    })

    it('should return a success if the verse is found', async () => {
      await library.addVerse(createVerse('BG 1.1'))
      await library.addVerse(createVerse('BG 2.13'))
      await library.addVerse(createVerse('BG 2.20'))

      const result = await library.getByNumber('BG 2.13', { lang: english })
      expect(result.number.value).toBe('BG 2.13')
    })

    it('should return a failure if the verse is unpublished', async () => {
      await library.addVerse(createVerse('BG 1.1', english.code, false))
      const result = () => library.getByNumber('BG 1.1', { lang: english })

      await expect(result).rejects.toThrowError('Verse not found by en and BG 1.1')
    })
  })


  /* -------------------------------------------------------------------------- */
  /*                                findByContent                               */
  /* -------------------------------------------------------------------------- */

  describe('findByContent', () => {
    it('should return a failure if the verse is unpublished', async () => {
      const verse = createVerse('BG 1.1', english.code, false)
      await library.addVerse(verse)
      const result = await library.findByContent('BG 1.1')

      expect(result).toEqual([])
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
      expect(result.id).toBe(verse.id)
    })

    it('should return error if the verse is not found', async () => {
      const notFoundId = new VerseId()
      await library.addVerse(createVerse('BG 1.1'))

      const result = () => library.getById(notFoundId)
      await expect(result).rejects.toThrow(`Entity '${notFoundId.value}' not found`)
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

  describe('.getStatus', () => {
    it('should return the status of the verse', async () => {
      const verse = createVerse('BG 1.1')
      await library.addVerse(verse)
      await verseStatusesRepository.save(new VerseStatus(verse.id, Decks.Inbox))

      const result = await library.getStatus(verse.id)
      expect(result.verseId).toBe(verse.id)
      expect(result.inDeck).toBe(Decks.Inbox)
    })

    it('should not create a new status if it does not exist', async () => {
      const verse = createVerse('BG 1.1')
      await library.addVerse(verse)

      const result = await library.getStatus(verse.id)
      expect(result).toBe(NoStatus)
    })
  })

  describe('.getStatuses', () => {
    it('should return the statuses of the verse', async () => {
      const verse0 = new VerseId('faa712ed-a789-4ad4-b150-8ca712914781')
      const verse1 = createVerse('BG 1.1')
      const verse2 = createVerse('BG 1.2')
      await library.addVerse(verse1)
      await library.addVerse(verse2)
      const verseStatus1 = new VerseStatus(verse1.id, Decks.None)
      const verseStatus2 = new VerseStatus(verse2.id, Decks.None)
      await verseStatusesRepository.save(verseStatus1)
      await verseStatusesRepository.save(verseStatus2)

      const result = await library.getStatuses([verse1.id, verse2.id, verse0])
      expect(result[verse1.id.value]).toEqual(verseStatus1)
      expect(result[verse2.id.value]).toEqual(verseStatus2)
      expect(result[verse0.value]).toEqual(NoStatus)
    })
  })


  /* -------------------------------------------------------------------------- */
  /*                                getVerseImage                               */
  /* -------------------------------------------------------------------------- */

  describe('.getVerseImage', () => {
    it('should return the image of the verse', async () => {
      const verse1 = createVerse('BG 1.1')
      const verse2 = createVerse('BG 1.2')
      const image1 = createVerseImage(verse1.id)
      const image2 = createVerseImage(verse2.id)

      await verseImagesRepository.save(image1)
      await verseImagesRepository.save(image2)

      // act
      const result = await library.getImages(verse1.id)

      // assert
      expect(result).toHaveLength(1)
      expect(result[0].verseId).toBe(verse1.id)
    })

    it('should return empty array if nothing found', async () => {
      const notFoundId = new VerseId()
      const result = await library.getImages(notFoundId)
      expect(result).toHaveLength(0)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                               getDeclamations                              */
  /* -------------------------------------------------------------------------- */

  describe('.getDeclamations', () => {
    it('should return the declamations of the verse', async () => {
      const verse1 = createVerse('BG 1.1')
      const verse2 = createVerse('BG 1.2')
      const declamation1 = createDeclamation(verse1.id)
      const declamation2 = createDeclamation(verse2.id)

      await declamationsRepository.save(declamation1)
      await declamationsRepository.save(declamation2)

      // act
      const result = await library.getDeclamations(verse1.id)

      // assert
      expect(result).toHaveLength(1)
      expect(result[0].verseReference).toBe(verse1.id)
    })

    it('should return empty array if nothing found', async () => {
      const notFoundId = new VerseId()
      const result = await library.getDeclamations(notFoundId)
      expect(result).toHaveLength(0)
    })

    it('should return the declamations of the verse by reference', async () => {
      const declamation1 = createDeclamation('BG 1.1')
      const declamation2 = createDeclamation('BG 1.1')

      await declamationsRepository.save(declamation1)
      await declamationsRepository.save(declamation2)

      // act
      const result = await library.getDeclamations('BG 1.1')

      // assert
      expect(result).toHaveLength(2)
      expect(result[0].verseReference).toBe('BG 1.1')
      expect(result[1].verseReference).toBe('BG 1.1')
    })
  })
})