import { InMemoryRepository, Repository } from '@akdasa-studios/framework'
import { VersesLibrary } from '@lib/app/VersesLibrary'
import { Verse, VerseBuilder, VerseNumber, VerseNumberBuilder } from '@lib/models'

describe('VersesLibrary', () => {
  let versesRepository: Repository<Verse>
  let library: VersesLibrary

  function getVerseNumber(verseNumberStr: string): VerseNumber {
    return new VerseNumberBuilder().fromString(verseNumberStr).build().value
  }

  function getVerse(verseNumberStr: string): Verse {
    const verseNumber = getVerseNumber(verseNumberStr)
    return new VerseBuilder().withNumber(verseNumber).build().value
  }

  beforeEach(() => {
    versesRepository = new InMemoryRepository<Verse>()
    library = new VersesLibrary(versesRepository)
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
      expect(library.findVerseByNumber(verseNumber).isSuccess).toBeTruthy()
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                              findVerseByNumber                             */
  /* -------------------------------------------------------------------------- */

  describe('findVerseByNumber', () => {
    it('should return a failure if the verse is not found', () => {
      const verseNumber = getVerseNumber('BG 1.1')
      const result = library.findVerseByNumber(verseNumber)
      expect(result.isFailure).toBeTruthy()
      expect(result.error).toBe('Verse not found: ' + verseNumber.toString())
    })

    it('should return a success if the verse is found', () => {
      const verseNumber = getVerseNumber('BG 1.1')
      const verse = getVerse('BG 1.1')
      library.addVerse(verse)

      const result = library.findVerseByNumber(verseNumber)
      expect(result.isSuccess).toBeTruthy()
    })
  })
})